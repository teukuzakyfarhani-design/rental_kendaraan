// ============================================================
// RodaRent — Server lokal (Node.js + SQLite)
//   npm start  ->  http://localhost:3000
//
// Menyajikan website statis di folder website/ dan API laporan
// transaksi yang dibaca langsung dari rental.db (SQLite).
// ============================================================
import { createServer } from "node:http";
import { DatabaseSync } from "node:sqlite";
import { createReadStream, existsSync, readFileSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { seedDatabase } from "./database/seed.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)));
const webRoot = path.join(root, "website");
const dbPath = process.env.RENTAL_DB || path.join(root, "rental.db");
const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || "127.0.0.1";

// ------------------------------------------------------------
// Database: buat otomatis jika belum ada
// ------------------------------------------------------------
const db = new DatabaseSync(dbPath);
db.exec("PRAGMA journal_mode = WAL;");
db.exec("PRAGMA foreign_keys = ON;");
db.exec(readFileSync(path.join(root, "database", "schema.sql"), "utf8"));
if (db.prepare("SELECT COUNT(*) AS n FROM kendaraan").get().n === 0) {
  const seeded = seedDatabase(db);
  console.log(`Database baru dibuat & di-seed: ${seeded.kendaraan} kendaraan, ${seeded.transaksi} transaksi.`);
}

// ------------------------------------------------------------
// Helper
// ------------------------------------------------------------
const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
};

function sendJson(res, status, data) {
  const body = JSON.stringify(data);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "Content-Length": Buffer.byteLength(body),
  });
  res.end(body);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
      if (raw.length > 1e6) {
        reject(new Error("Payload terlalu besar"));
        req.destroy();
      }
    });
    req.on("end", () => {
      if (!raw) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch {
        reject(new Error("Body bukan JSON yang valid"));
      }
    });
    req.on("error", reject);
  });
}

const isValidDate = (s) => typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s);
const isMonth = (s) => typeof s === "string" && /^\d{4}-\d{2}$/.test(s);

function dateFilter(url, column = "tanggal") {
  const dari = url.searchParams.get("dari");
  const sampai = url.searchParams.get("sampai");
  const clauses = [];
  const params = [];
  if (isValidDate(dari)) { clauses.push(`${column} >= ?`); params.push(dari); }
  if (isValidDate(sampai)) { clauses.push(`${column} <= ?`); params.push(sampai); }
  return { clauses, params };
}

// ------------------------------------------------------------
// API
// ------------------------------------------------------------
function apiRingkasan(url) {
  const { clauses, params } = dateFilter(url);
  const where = clauses.length ? "WHERE " + clauses.join(" AND ") : "";

  const total = db.prepare(`
    SELECT
      COALESCE(SUM(CASE WHEN jenis = 'pemasukan'   THEN nominal END), 0) AS pemasukan,
      COALESCE(SUM(CASE WHEN jenis = 'pengeluaran' THEN nominal END), 0) AS pengeluaran,
      COUNT(*) AS jumlah_transaksi,
      SUM(CASE WHEN jenis = 'pemasukan'   THEN 1 ELSE 0 END) AS transaksi_pemasukan,
      SUM(CASE WHEN jenis = 'pengeluaran' THEN 1 ELSE 0 END) AS transaksi_pengeluaran
    FROM transaksi ${where}
  `).get(...params);

  total.laba_bersih = total.pemasukan - total.pengeluaran;
  total.margin = total.pemasukan > 0
    ? Math.round((total.laba_bersih / total.pemasukan) * 1000) / 10
    : 0;

  const perJenis = db.prepare(`
    SELECT jenis, kategori, COUNT(*) AS jumlah, SUM(nominal) AS total
    FROM transaksi ${where}
    GROUP BY jenis, kategori
    ORDER BY jenis, total DESC
  `).all(...params);

  return {
    periode: {
      dari: url.searchParams.get("dari") || null,
      sampai: url.searchParams.get("sampai") || null,
    },
    ringkasan: total,
    perKategori: perJenis,
  };
}

function apiBulanan(url) {
  const dari = url.searchParams.get("dari");
  const sampai = url.searchParams.get("sampai");
  const clauses = [];
  const params = [];
  if (isMonth(dari)) { clauses.push("substr(tanggal, 1, 7) >= ?"); params.push(dari); }
  if (isMonth(sampai)) { clauses.push("substr(tanggal, 1, 7) <= ?"); params.push(sampai); }
  const where = clauses.length ? "WHERE " + clauses.join(" AND ") : "";
  return db.prepare(`
    SELECT * FROM v_laporan_bulanan ${where} ORDER BY bulan
  `).all(...params);
}

function buildTransaksiFilter(url) {
  const clauses = [];
  const params = [];

  const jenis = url.searchParams.get("jenis");
  if (jenis === "pemasukan" || jenis === "pengeluaran") {
    clauses.push("t.jenis = ?");
    params.push(jenis);
  }
  const kategori = url.searchParams.get("kategori");
  if (kategori && kategori !== "all") {
    clauses.push("t.kategori = ?");
    params.push(kategori);
  }
  const q = (url.searchParams.get("q") || "").trim();
  if (q) {
    clauses.push("(t.keterangan LIKE ? OR t.plat_nomor LIKE ? OR t.pelanggan LIKE ? OR t.kategori LIKE ?)");
    const like = `%${q}%`;
    params.push(like, like, like, like);
  }
  const { clauses: dateClauses, params: dateParams } = dateFilter(url, "t.tanggal");
  clauses.push(...dateClauses);
  params.push(...dateParams);

  return { where: clauses.length ? "WHERE " + clauses.join(" AND ") : "", params };
}

function apiTransaksi(url) {
  const { where, params } = buildTransaksiFilter(url);
  const limit = Math.min(500, Math.max(1, Number(url.searchParams.get("limit")) || 50));
  const offset = Math.max(0, Number(url.searchParams.get("offset")) || 0);

  const total = db.prepare(`SELECT COUNT(*) AS n FROM transaksi t ${where}`).get(...params).n;

  const order = url.searchParams.get("sort") === "asc" ? "ASC" : "DESC";
  const rows = db.prepare(`
    SELECT t.*, k.nama AS kendaraan_nama
    FROM transaksi t
    LEFT JOIN kendaraan k ON k.id = t.kendaraan_id
    ${where}
    ORDER BY t.tanggal ${order}, t.id ${order}
    LIMIT ? OFFSET ?
  `).all(...params, limit, offset);

  return { total, limit, offset, data: rows };
}

function apiKendaraan() {
  return db.prepare(`
    SELECT k.*,
      (SELECT COUNT(*) FROM transaksi t WHERE t.kendaraan_id = k.id) AS jumlah_transaksi,
      (SELECT COALESCE(SUM(nominal), 0) FROM transaksi t
        WHERE t.kendaraan_id = k.id AND t.jenis = 'pemasukan') AS total_pendapatan
    FROM kendaraan k
    ORDER BY k.kategori, k.plat_nomor
  `).all();
}

function apiKategori() {
  return {
    pemasukan: db.prepare("SELECT DISTINCT kategori FROM transaksi WHERE jenis = 'pemasukan' ORDER BY kategori").all().map((r) => r.kategori),
    pengeluaran: db.prepare("SELECT DISTINCT kategori FROM transaksi WHERE jenis = 'pengeluaran' ORDER BY kategori").all().map((r) => r.kategori),
  };
}

function apiTambahTransaksi(payload) {
  const errors = [];
  if (!isValidDate(payload.tanggal)) errors.push("Tanggal harus berformat YYYY-MM-DD.");
  if (!["pemasukan", "pengeluaran"].includes(payload.jenis)) errors.push("Jenis harus 'pemasukan' atau 'pengeluaran'.");
  if (!payload.kategori || !String(payload.kategori).trim()) errors.push("Kategori wajib diisi.");
  if (!payload.keterangan || !String(payload.keterangan).trim()) errors.push("Keterangan wajib diisi.");
  const nominal = Number(payload.nominal);
  if (!Number.isInteger(nominal) || nominal <= 0) errors.push("Nominal harus bilangan bulat lebih dari 0.");
  const jumlahHari = payload.jumlah_hari == null || payload.jumlah_hari === "" ? null : Number(payload.jumlah_hari);
  if (jumlahHari != null && (!Number.isInteger(jumlahHari) || jumlahHari <= 0)) errors.push("Jumlah hari tidak valid.");
  if (errors.length) return { status: 400, body: { error: errors.join(" ") } };

  let kendaraanId = null;
  let platNomor = payload.plat_nomor ? String(payload.plat_nomor).trim().toUpperCase() : null;
  if (payload.kendaraan_id) {
    const k = db.prepare("SELECT id, plat_nomor FROM kendaraan WHERE id = ?").get(Number(payload.kendaraan_id));
    if (!k) return { status: 400, body: { error: "Kendaraan tidak ditemukan." } };
    kendaraanId = k.id;
    platNomor = k.plat_nomor;
  } else if (platNomor) {
    const k = db.prepare("SELECT id FROM kendaraan WHERE plat_nomor = ?").get(platNomor);
    if (k) kendaraanId = k.id;
  }

  const info = db.prepare(`
    INSERT INTO transaksi
      (tanggal, jenis, kategori, keterangan, kendaraan_id, plat_nomor, pelanggan, jumlah_hari, metode_bayar, nominal, catatan)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    payload.tanggal,
    payload.jenis,
    String(payload.kategori).trim(),
    String(payload.keterangan).trim(),
    kendaraanId,
    platNomor,
    payload.pelanggan ? String(payload.pelanggan).trim() : null,
    jumlahHari,
    payload.metode_bayar ? String(payload.metode_bayar).trim() : "Transfer Bank",
    nominal,
    payload.catatan ? String(payload.catatan).trim() : null,
  );

  const row = db.prepare("SELECT * FROM transaksi WHERE id = ?").get(Number(info.lastInsertRowid));
  return { status: 201, body: row };
}

function apiHapusTransaksi(id) {
  const info = db.prepare("DELETE FROM transaksi WHERE id = ?").run(Number(id));
  if (info.changes === 0) return { status: 404, body: { error: "Transaksi tidak ditemukan." } };
  return { status: 200, body: { ok: true, id: Number(id) } };
}

function apiExportCsv(url) {
  const { where, params } = buildTransaksiFilter(url);
  const order = url.searchParams.get("sort") === "asc" ? "ASC" : "DESC";
  const data = db.prepare(`
    SELECT t.id, t.tanggal, t.jenis, t.kategori, t.keterangan, t.plat_nomor,
           t.pelanggan, t.jumlah_hari, t.metode_bayar, t.nominal, t.catatan
    FROM transaksi t
    ${where}
    ORDER BY t.tanggal ${order}, t.id ${order}
  `).all(...params);
  const esc = (v) => {
    if (v == null) return "";
    const s = String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const header = ["ID", "Tanggal", "Jenis", "Kategori", "Keterangan", "Plat Nomor", "Pelanggan", "Jumlah Hari", "Metode Bayar", "Nominal", "Catatan"];
  const lines = [header.join(",")];
  for (const r of data) {
    lines.push([
      r.id, r.tanggal, r.jenis, r.kategori, r.keterangan, r.plat_nomor, r.pelanggan,
      r.jumlah_hari, r.metode_bayar, r.nominal, r.catatan,
    ].map(esc).join(","));
  }
  return "\uFEFF" + lines.join("\r\n");
}

// ------------------------------------------------------------
// Router
// ------------------------------------------------------------
const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  const pathname = decodeURIComponent(url.pathname);

  try {
    if (pathname.startsWith("/api/")) {
      if (req.method === "GET" && pathname === "/api/laporan/ringkasan") {
        return sendJson(res, 200, apiRingkasan(url));
      }
      if (req.method === "GET" && pathname === "/api/laporan/bulanan") {
        return sendJson(res, 200, apiBulanan(url));
      }
      if (req.method === "GET" && pathname === "/api/laporan/kategori") {
        return sendJson(res, 200, apiKategori());
      }
      if (req.method === "GET" && pathname === "/api/laporan/export.csv") {
        const csv = apiExportCsv(url);
        res.writeHead(200, {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": 'attachment; filename="laporan-transaksi-rodarent.csv"',
        });
        return res.end(csv);
      }
      if (req.method === "GET" && pathname === "/api/transaksi") {
        return sendJson(res, 200, apiTransaksi(url));
      }
      if (req.method === "POST" && pathname === "/api/transaksi") {
        const payload = await readBody(req);
        const result = apiTambahTransaksi(payload);
        return sendJson(res, result.status, result.body);
      }
      if (req.method === "DELETE" && pathname.startsWith("/api/transaksi/")) {
        const id = pathname.split("/").pop();
        const result = apiHapusTransaksi(id);
        return sendJson(res, result.status, result.body);
      }
      if (req.method === "GET" && pathname === "/api/kendaraan") {
        return sendJson(res, 200, apiKendaraan());
      }
      return sendJson(res, 404, { error: "Endpoint tidak ditemukan." });
    }

    // ---- Static files ----
    let filePath = pathname === "/" ? "/index.html" : pathname;
    const absolute = path.join(webRoot, path.normalize(filePath));
    if (!absolute.startsWith(webRoot)) {
      res.writeHead(403);
      return res.end("Forbidden");
    }
    if (!existsSync(absolute) || !statSync(absolute).isFile()) {
      res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
      return res.end("<h1>404</h1><p>Halaman tidak ditemukan.</p>");
    }
    const ext = path.extname(absolute).toLowerCase();
    res.writeHead(200, {
      "Content-Type": MIME[ext] || "application/octet-stream",
      "Cache-Control": ext === ".html" ? "no-cache" : "public, max-age=3600",
    });
    createReadStream(absolute).pipe(res);
  } catch (err) {
    console.error(err);
    if (!res.headersSent) sendJson(res, 500, { error: err.message || "Terjadi kesalahan server." });
    else res.end();
  }
});

server.listen(PORT, HOST, () => {
  console.log("==============================================");
  console.log("  RodaRent berjalan di http://localhost:" + PORT);
  console.log("  Katalog : http://localhost:" + PORT + "/");
  console.log("  Laporan : http://localhost:" + PORT + "/laporan.html");
  console.log("  Database: " + dbPath);
  console.log("==============================================");
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => {
    try { db.close(); } catch {}
    server.close(() => process.exit(0));
  });
}
