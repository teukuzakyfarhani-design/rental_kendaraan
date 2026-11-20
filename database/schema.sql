-- ============================================================
-- RodaRent — Skema Database SQLite
-- File database: rental.db (berada langsung di folder project)
-- ============================================================

PRAGMA foreign_keys = ON;

-- ------------------------------------------------------------
-- Tabel master armada (30 mobil + 30 motor)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS kendaraan (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  kategori       TEXT    NOT NULL CHECK (kategori IN ('Mobil', 'Motor')),
  nama           TEXT    NOT NULL,
  plat_nomor     TEXT    NOT NULL UNIQUE,
  harga_per_hari INTEGER NOT NULL CHECK (harga_per_hari > 0),
  penumpang      INTEGER,
  transmisi      TEXT,
  helm           INTEGER,
  dengan_supir   INTEGER NOT NULL DEFAULT 0 CHECK (dengan_supir IN (0, 1)),
  gambar         TEXT,
  status         TEXT    NOT NULL DEFAULT 'Tersedia'
                 CHECK (status IN ('Tersedia', 'Disewa', 'Perawatan'))
);

-- ------------------------------------------------------------
-- Tabel transaksi keuangan (pemasukan & pengeluaran)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS transaksi (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  tanggal      TEXT    NOT NULL,                 -- format YYYY-MM-DD
  jenis        TEXT    NOT NULL CHECK (jenis IN ('pemasukan', 'pengeluaran')),
  kategori     TEXT    NOT NULL,
  keterangan   TEXT    NOT NULL,
  kendaraan_id INTEGER REFERENCES kendaraan(id) ON DELETE SET NULL,
  plat_nomor   TEXT,
  pelanggan    TEXT,
  jumlah_hari  INTEGER CHECK (jumlah_hari IS NULL OR jumlah_hari > 0),
  metode_bayar TEXT    NOT NULL DEFAULT 'Transfer',
  nominal      INTEGER NOT NULL CHECK (nominal > 0),
  catatan      TEXT,
  dibuat_pada  TEXT    NOT NULL DEFAULT (datetime('now', 'localtime'))
);

CREATE INDEX IF NOT EXISTS idx_transaksi_tanggal  ON transaksi (tanggal);
CREATE INDEX IF NOT EXISTS idx_transaksi_jenis    ON transaksi (jenis);
CREATE INDEX IF NOT EXISTS idx_transaksi_kategori ON transaksi (kategori);
CREATE INDEX IF NOT EXISTS idx_transaksi_kendaraan ON transaksi (kendaraan_id);

-- ------------------------------------------------------------
-- View ringkasan per bulan (dipakai laporan & grafik)
-- ------------------------------------------------------------
CREATE VIEW IF NOT EXISTS v_laporan_bulanan AS
SELECT
  substr(tanggal, 1, 7) AS bulan,
  SUM(CASE WHEN jenis = 'pemasukan'   THEN nominal ELSE 0 END) AS pemasukan,
  SUM(CASE WHEN jenis = 'pengeluaran' THEN nominal ELSE 0 END) AS pengeluaran,
  SUM(CASE WHEN jenis = 'pemasukan' THEN nominal ELSE -nominal END) AS laba_bersih,
  COUNT(*) AS jumlah_transaksi
FROM transaksi
GROUP BY substr(tanggal, 1, 7)
ORDER BY bulan;

-- ------------------------------------------------------------
-- View rekap per kategori (pemasukan & pengeluaran)
-- ------------------------------------------------------------
CREATE VIEW IF NOT EXISTS v_rekap_kategori AS
SELECT
  jenis,
  kategori,
  COUNT(*)       AS jumlah_transaksi,
  SUM(nominal)   AS total_nominal
FROM transaksi
GROUP BY jenis, kategori
ORDER BY jenis, total_nominal DESC;
