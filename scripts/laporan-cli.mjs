// ============================================================
// Laporan lengkap transaksi RodaRent (terminal)
//   npm run laporan
//   npm run laporan -- --bulan=2026-11
//   npm run laporan -- --dari=2026-05-01 --sampai=2026-11-20
//   npm run laporan -- --csv=laporan.csv
// ============================================================
import { DatabaseSync } from "node:sqlite";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { seedDatabase } from "../database/seed.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dbPath = process.env.RENTAL_DB || path.join(root, "rental.db");

const db = new DatabaseSync(dbPath);
db.exec("PRAGMA journal_mode = WAL;");
db.exec(readFileSync(path.join(root, "database", "schema.sql"), "utf8"));
if (db.prepare("SELECT COUNT(*) AS n FROM kendaraan").get().n === 0) {
  seedDatabase(db);
}

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, ...v] = a.replace(/^--/, "").split("=");
    return [k, v.join("=")];
  }),
);

const clauses = [];
const params = [];
if (args.bulan && /^\d{4}-\d{2}$/.test(args.bulan)) {
  clauses.push("substr(tanggal, 1, 7) = ?");
  params.push(args.bulan);
}
if (args.dari && /^\d{4}-\d{2}-\d{2}$/.test(args.dari)) {
  clauses.push("tanggal >= ?");
  params.push(args.dari);
}
if (args.sampai && /^\d{4}-\d{2}-\d{2}$/.test(args.sampai)) {
  clauses.push("tanggal <= ?");
  params.push(args.sampai);
}
const where = clauses.length ? "WHERE " + clauses.join(" AND ") : "";

const rupiah = (n) => "Rp " + Number(n || 0).toLocaleString("id-ID");
const pad = (s, n) => String(s).padStart(n);
const padEnd = (s, n) => String(s).padEnd(n);
const line = (c = "=") => c.repeat(92);

const ringkasan = db.prepare(`
  SELECT
    COALESCE(SUM(CASE WHEN jenis = 'pemasukan'   THEN nominal END), 0) AS pemasukan,
    COALESCE(SUM(CASE WHEN jenis = 'pengeluaran' THEN nominal END), 0) AS pengeluaran,
    COUNT(*) AS jumlah,
    MIN(tanggal) AS awal,
    MAX(tanggal) AS akhir
  FROM transaksi ${where}
`).get(...params);

console.log("\n" + line());
console.log("                 LAPORAN TRANSAKSI KEUANGAN RODARENT");
console.log("                 Rental Mobil & Motor — BL (Banjarmasin)");
console.log(line());
console.log(`Periode laporan : ${ringkasan.awal || "-"} s/d ${ringkasan.akhir || "-"}`);
console.log(`Database        : ${dbPath}`);
console.log(`Dicetak         : ${new Date().toLocaleString("id-ID")}`);
console.log(line());
console.log("RINGKASAN");
console.log(line("-"));
console.log(`${padEnd("Total Pemasukan", 26)}: ${pad(rupiah(ringkasan.pemasukan), 18)}`);
console.log(`${padEnd("Total Pengeluaran", 26)}: ${pad(rupiah(ringkasan.pengeluaran), 18)}`);
console.log(`${padEnd("Laba Bersih", 26)}: ${pad(rupiah(ringkasan.pemasukan - ringkasan.pengeluaran), 18)}`);
const margin = ringkasan.pemasukan > 0
  ? ((ringkasan.pemasukan - ringkasan.pengeluaran) / ringkasan.pemasukan * 100).toFixed(1)
  : "0.0";
console.log(`${padEnd("Margin Laba", 26)}: ${pad(margin + " %", 18)}`);
console.log(`${padEnd("Jumlah Transaksi", 26)}: ${pad(ringkasan.jumlah, 18)}`);
console.log(line());

// ---------------- Laporan bulanan ----------------
console.log("\nLAPORAN BULANAN");
console.log(line("-"));
console.log(
  padEnd("Bulan", 12) + pad("Pemasukan", 18) + pad("Pengeluaran", 18) + pad("Laba Bersih", 18) + pad("Trx", 7),
);
console.log(line("-"));
const bulanan = db.prepare(`
  SELECT substr(tanggal, 1, 7) AS bulan,
    COALESCE(SUM(CASE WHEN jenis = 'pemasukan' THEN nominal END), 0) AS pemasukan,
    COALESCE(SUM(CASE WHEN jenis = 'pengeluaran' THEN nominal END), 0) AS pengeluaran,
    SUM(CASE WHEN jenis = 'pemasukan' THEN nominal ELSE -nominal END) AS laba,
    COUNT(*) AS jumlah
  FROM transaksi ${where}
  GROUP BY substr(tanggal, 1, 7)
  ORDER BY bulan
`).all(...params);
for (const b of bulanan) {
  console.log(
    padEnd(b.bulan, 12) + pad(rupiah(b.pemasukan), 18) + pad(rupiah(b.pengeluaran), 18)
    + pad(rupiah(b.laba), 18) + pad(b.jumlah, 7),
  );
}
console.log(line("-"));
console.log(
  padEnd("TOTAL", 12) + pad(rupiah(ringkasan.pemasukan), 18) + pad(rupiah(ringkasan.pengeluaran), 18)
  + pad(rupiah(ringkasan.pemasukan - ringkasan.pengeluaran), 18) + pad(ringkasan.jumlah, 7),
);

// ---------------- Rekap kategori ----------------
function rekap(jenis) {
  console.log(`\nREKAP ${jenis.toUpperCase()} PER KATEGORI`);
  console.log(line("-"));
  console.log(padEnd("Kategori", 30) + pad("Jumlah Trx", 14) + pad("Total", 18) + pad("Porsi", 10));
  console.log(line("-"));
  const rows = db.prepare(`
    SELECT kategori, COUNT(*) AS jumlah, SUM(nominal) AS total
    FROM transaksi ${where ? where + " AND" : "WHERE"} jenis = ?
    GROUP BY kategori ORDER BY total DESC
  `).all(...params, jenis);
  const grand = rows.reduce((a, r) => a + r.total, 0);
  for (const r of rows) {
    const porsi = grand ? ((r.total / grand) * 100).toFixed(1) + " %" : "0 %";
    console.log(padEnd(r.kategori, 30) + pad(r.jumlah, 14) + pad(rupiah(r.total), 18) + pad(porsi, 10));
  }
  console.log(line("-"));
  console.log(padEnd("TOTAL", 30) + pad(rows.reduce((a, r) => a + r.jumlah, 0), 14) + pad(rupiah(grand), 18));
}
rekap("pemasukan");
rekap("pengeluaran");

// ---------------- Top unit ----------------
console.log("\nTOP 5 UNIT PENYUMBANG PENDAPATAN");
console.log(line("-"));
const topUnit = db.prepare(`
  SELECT k.nama, k.plat_nomor, COUNT(t.id) AS jumlah, SUM(t.nominal) AS total
  FROM transaksi t JOIN kendaraan k ON k.id = t.kendaraan_id
  ${where ? where + " AND" : "WHERE"} t.jenis = 'pemasukan' AND t.kategori LIKE 'Sewa%'
  GROUP BY k.id ORDER BY total DESC LIMIT 5
`).all(...params);
let no = 1;
for (const u of topUnit) {
  console.log(`${no++}. ${padEnd(u.nama, 34)} ${padEnd(u.plat_nomor, 12)} ${pad(u.jumlah + " trx", 9)} ${pad(rupiah(u.total), 18)}`);
}

// ---------------- Transaksi terbaru ----------------
console.log("\n10 TRANSAKSI TERBARU");
console.log(line("-"));
const terbaru = db.prepare(`
  SELECT tanggal, jenis, kategori, keterangan, nominal
  FROM transaksi ${where} ORDER BY tanggal DESC, id DESC LIMIT 10
`).all(...params);
for (const t of terbaru) {
  const tanda = t.jenis === "pemasukan" ? "+" : "-";
  console.log(`${t.tanggal}  ${t.jenis === "pemasukan" ? "MASUK " : "KELUAR"}  ${padEnd(t.kategori, 20)} ${pad(tanda + rupiah(t.nominal), 18)}`);
  console.log(`             ${t.keterangan}`);
}
console.log(line());
console.log("Keterangan: + pemasukan   - pengeluaran");
console.log(line() + "\n");

// ---------------- Export CSV opsional ----------------
if (args.csv) {
  const esc = (v) => {
    if (v == null) return "";
    const s = String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const rows = db.prepare(`
    SELECT t.id, t.tanggal, t.jenis, t.kategori, t.keterangan, t.plat_nomor, t.pelanggan,
           t.jumlah_hari, t.metode_bayar, t.nominal, t.catatan
    FROM transaksi t ${where} ORDER BY t.tanggal, t.id
  `).all(...params);
  const header = ["ID", "Tanggal", "Jenis", "Kategori", "Keterangan", "Plat Nomor", "Pelanggan", "Jumlah Hari", "Metode Bayar", "Nominal", "Catatan"];
  const csv = [header.join(","), ...rows.map((r) => Object.values(r).map(esc).join(","))].join("\r\n");
  const outPath = path.isAbsolute(args.csv) ? args.csv : path.join(root, args.csv);
  writeFileSync(outPath, "\uFEFF" + csv, "utf8");
  console.log(`CSV diekspor ke: ${outPath} (${rows.length} baris)\n`);
}

db.close();
