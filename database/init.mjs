// ============================================================
// Inisialisasi database SQLite RodaRent
//   node database/init.mjs           -> buat jika belum ada
//   node database/init.mjs --reset   -> hapus & buat ulang
// File database: rental.db (di root folder project)
// ============================================================
import { DatabaseSync } from "node:sqlite";
import { existsSync, readFileSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { seedDatabase } from "./seed.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dbPath = process.env.RENTAL_DB || path.join(root, "rental.db");
const reset = process.argv.includes("--reset");

if (reset) {
  for (const suffix of ["", "-wal", "-shm"]) {
    const f = dbPath + suffix;
    if (existsSync(f)) rmSync(f);
  }
  console.log("Database lama dihapus.");
}

const db = new DatabaseSync(dbPath);
db.exec("PRAGMA journal_mode = WAL;");
db.exec(readFileSync(path.join(root, "database", "schema.sql"), "utf8"));

const existing = db.prepare("SELECT COUNT(*) AS n FROM kendaraan").get().n;
if (existing === 0) {
  const result = seedDatabase(db);
  console.log(`Seed selesai: ${result.kendaraan} kendaraan, ${result.transaksi} transaksi.`);
} else {
  console.log(`Database sudah berisi ${existing} kendaraan — seed dilewati.`);
}

const ringkas = db.prepare(`
  SELECT
    SUM(CASE WHEN jenis = 'pemasukan' THEN nominal ELSE 0 END) AS pemasukan,
    SUM(CASE WHEN jenis = 'pengeluaran' THEN nominal ELSE 0 END) AS pengeluaran,
    COUNT(*) AS total
  FROM transaksi
`).get();

const rupiah = (n) => "Rp " + Number(n || 0).toLocaleString("id-ID");
console.log("\n=== RINGKASAN DATABASE ===");
console.log("Lokasi       :", dbPath);
console.log("Transaksi    :", ringkas.total);
console.log("Pemasukan    :", rupiah(ringkas.pemasukan));
console.log("Pengeluaran  :", rupiah(ringkas.pengeluaran));
console.log("Laba bersih  :", rupiah((ringkas.pemasukan || 0) - (ringkas.pengeluaran || 0)));

db.close();
