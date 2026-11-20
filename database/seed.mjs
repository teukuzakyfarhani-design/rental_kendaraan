// ============================================================
// Seed database RodaRent — membuat 60 unit armada + riwayat
// transaksi pemasukan & pengeluaran yang lengkap.
// Data dibangkitkan secara deterministik (hasil selalu sama).
// ============================================================
import { readFileSync } from "node:fs";

const START_YEAR = 2026;
const START_MONTH = 5;   // Mei 2026
const END_YEAR = 2026;
const END_MONTH = 11;    // November 2026
const END_DAY = 20;

const BIAYA_SUPIR_PER_HARI = 150000;

// ------------------------------------------------------------
// PRNG deterministik (mulberry32) supaya data bisa direproduksi
// ------------------------------------------------------------
function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(20261120);
const pick = (arr) => arr[Math.floor(rand() * arr.length)];
const randInt = (min, max) => Math.floor(rand() * (max - min + 1)) + min;

function pad(n) {
  return String(n).padStart(2, "0");
}
function daysInMonth(y, m) {
  return new Date(y, m, 0).getDate();
}
function randomDate(y, m, maxDay) {
  const last = Math.min(daysInMonth(y, m), maxDay ?? 31);
  return `${y}-${pad(m)}-${pad(randInt(1, last))}`;
}
function monthRange() {
  const list = [];
  let y = START_YEAR;
  let m = START_MONTH;
  while (y < END_YEAR || (y === END_YEAR && m <= END_MONTH)) {
    list.push({ y, m, maxDay: m === END_MONTH && y === END_YEAR ? END_DAY : undefined });
    m += 1;
    if (m > 12) { m = 1; y += 1; }
  }
  return list;
}
function roundTo(n, step = 1000) {
  return Math.round(n / step) * step;
}

// ------------------------------------------------------------
// Data pendukung
// ------------------------------------------------------------
const PELANGGAN = [
  "Budi Santoso", "Siti Rahmawati", "Ahmad Fauzi", "Dewi Lestari", "Rizky Pratama",
  "Nur Aisyah", "Agus Setiawan", "Putri Maharani", "Hendra Wijaya", "Maya Anggraini",
  "Fajar Nugroho", "Rina Kartika", "Bayu Saputra", "Intan Permata", "Doni Firmansyah",
  "Wulan Sari", "Eko Prasetyo", "Fitri Handayani", "Yoga Aditya", "Sinta Amelia",
  "PT Sinar Abadi", "CV Mitra Jaya", "PT Bumi Sejahtera", "Koperasi Nusantara",
  "PT Karya Mandiri", "Universitas Cendekia", "Yayasan Harapan Bangsa", "PT Trans Logistik",
  "Dimas Aryo", "Nabila Zahra", "Rangga Putra", "Ayu Wandira", "Teguh Hidayat",
  "Lia Kurniawati", "Arif Budiman", "Sari Wulandari", "Bagus Ramadhan", "Nadia Safitri",
  "PT Global Wisata", "Hotel Grand Permata", "CV Karya Teknik", "PT Agro Lestari",
];

const METODE = ["Transfer Bank", "Tunai", "QRIS", "Kartu Debit"];

const EXPENSE_TEMPLATES = [
  { kategori: "Gaji & THR", keterangan: "Gaji bulanan 6 karyawan operasional", nominal: [8800000, 9400000], day: 1, metode: "Transfer Bank" },
  { kategori: "Sewa & Utilitas", keterangan: "Sewa kantor & garasi armada", nominal: [4500000, 4500000], day: 1, metode: "Transfer Bank" },
  { kategori: "Sewa & Utilitas", keterangan: "Listrik, air & internet kantor", nominal: [950000, 1350000], day: 5, metode: "Transfer Bank" },
  { kategori: "Asuransi", keterangan: "Premi asuransi all risk armada", nominal: [1750000, 2100000], day: 10, metode: "Transfer Bank" },
  { kategori: "Promosi", keterangan: "Iklan digital & cetak brosur", nominal: [650000, 1250000], day: 8, metode: "QRIS" },
  { kategori: "BBM & Operasional", keterangan: "BBM operasional antar-jemput unit", nominal: [700000, 1500000], day: 12, metode: "Tunai" },
  { kategori: "BBM & Operasional", keterangan: "BBM operasional antar-jemput unit", nominal: [700000, 1500000], day: 24, metode: "Tunai" },
  { kategori: "Perawatan & Servis", keterangan: "Cuci & detailing armada bulanan", nominal: [450000, 750000], day: 15, metode: "Tunai" },
  { kategori: "Operasional Kantor", keterangan: "ATK, konsumsi & kebersihan kantor", nominal: [350000, 650000], day: 18, metode: "Tunai" },
];

const MAINTENANCE_NOTES = [
  "Servis berkala & ganti oli",
  "Ganti kampas rem depan-belakang",
  "Servis kaki-kaki dan spooring balancing",
  "Ganti ban & rotasi roda",
  "Perbaikan AC dan isi freon",
  "Ganti aki dan tune up mesin",
  "Servis CVT dan ganti oli gardan",
  "Ganti rantai, gir, dan busi",
  "Perbaikan bodi & pengecatan panel",
  "Ganti filter udara dan busi",
];

const SPAREPART_NOTES = [
  "Pembelian ban luar & dalam",
  "Pembelian oli mesin dan filter",
  "Pembelian aki kendaraan",
  "Pembelian kampas rem dan lampu",
  "Pembelian sparepart CVT",
];

// ------------------------------------------------------------
// Perhitungan tarif (sama dengan aturan di website & Java)
// ------------------------------------------------------------
function hitungTarif(vehicle, days, withDriver, promoPercent) {
  let total = vehicle.price * days;
  if (vehicle.category === "Mobil" && withDriver) {
    total += BIAYA_SUPIR_PER_HARI * days;
  }
  if (vehicle.category === "Motor" && days >= 7) {
    total *= 0.9;
  }
  if (promoPercent > 0) {
    total -= total * (promoPercent / 100);
  }
  return roundTo(total, 1000);
}

// ------------------------------------------------------------
// Muat data armada dari website/fleet-data.js
// ------------------------------------------------------------
export function loadFleet() {
  const raw = readFileSync(new URL("../website/fleet-data.js", import.meta.url), "utf8");
  const sandbox = {};
  new Function("window", raw)(sandbox);
  return sandbox.FLEET_DATA;
}

// ------------------------------------------------------------
// Seed
// ------------------------------------------------------------
export function seedDatabase(db) {
  const fleet = loadFleet();

  const insertKendaraan = db.prepare(`
    INSERT INTO kendaraan (kategori, nama, plat_nomor, harga_per_hari, penumpang, transmisi, helm, dengan_supir, gambar, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Tersedia')
  `);

  const idByPlat = new Map();
  for (const v of fleet) {
    const info = insertKendaraan.run(
      v.category,
      v.name,
      v.platNomor,
      v.price,
      v.passengers ?? null,
      v.transmission ?? null,
      v.helmets ?? null,
      v.withDriver ? 1 : 0,
      v.image ?? null,
    );
    idByPlat.set(v.platNomor, Number(info.lastInsertRowid));
  }

  const insertTransaksi = db.prepare(`
    INSERT INTO transaksi
      (tanggal, jenis, kategori, keterangan, kendaraan_id, plat_nomor, pelanggan, jumlah_hari, metode_bayar, nominal, catatan)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const mobil = fleet.filter((v) => v.category === "Mobil");
  const motor = fleet.filter((v) => v.category === "Motor");
  const months = monthRange();

  for (const { y, m, maxDay } of months) {
    // ---------------- PEMASUKAN: sewa harian ----------------
    const jumlahSewa = randInt(38, 48);
    for (let i = 0; i < jumlahSewa; i++) {
      const vehicle = rand() < 0.52 ? pick(mobil) : pick(motor);
      const days = rand() < 0.18 ? randInt(7, 12) : randInt(1, 6);
      const withDriver = vehicle.category === "Mobil" ? rand() < (vehicle.withDriver ? 0.65 : 0.18) : false;
      const promo = rand() < 0.1 ? pick([5, 10]) : 0;
      const nominal = hitungTarif(vehicle, days, withDriver, promo);
      const tanggal = randomDate(y, m, maxDay);
      const metode = pick(METODE);
      const catatan = [
        withDriver ? "Termasuk layanan supir" : "Lepas kunci",
        promo ? `Diskon promo ${promo}%` : null,
        vehicle.category === "Motor" && days >= 7 ? "Diskon motor 10% (≥7 hari)" : null,
      ].filter(Boolean).join(" · ");

      insertTransaksi.run(
        tanggal,
        "pemasukan",
        `Sewa ${vehicle.category}`,
        `Sewa ${vehicle.name} (${vehicle.platNomor}) ${days} hari`,
        idByPlat.get(vehicle.platNomor),
        vehicle.platNomor,
        pick(PELANGGAN),
        days,
        metode,
        nominal,
        catatan || null,
      );
    }

    // ---------------- PEMASUKAN: kontrak korporat ----------------
    if (rand() < 0.7) {
      const vehicle = pick(mobil);
      const days = randInt(14, 30);
      const withDriver = rand() < 0.5;
      const nominal = hitungTarif(vehicle, days, withDriver, 5);
      insertTransaksi.run(
        randomDate(y, m, maxDay),
        "pemasukan",
        "Sewa Mobil",
        `Kontrak sewa korporat ${vehicle.name} (${vehicle.platNomor}) ${days} hari`,
        idByPlat.get(vehicle.platNomor),
        vehicle.platNomor,
        pick(PELANGGAN.filter((p) => /^PT|^CV|^Koperasi|^Universitas|^Yayasan|^Hotel/.test(p))),
        days,
        "Transfer Bank",
        nominal,
        "Kontrak jangka panjang, diskon korporat 5%",
      );
    }

    // ---------------- PEMASUKAN: denda keterlambatan ----------------
    if (rand() < 0.75) {
      const vehicle = pick(fleet);
      insertTransaksi.run(
        randomDate(y, m, maxDay),
        "pemasukan",
        "Denda Keterlambatan",
        `Denda keterlambatan pengembalian ${vehicle.name} (${vehicle.platNomor})`,
        idByPlat.get(vehicle.platNomor),
        vehicle.platNomor,
        pick(PELANGGAN),
        null,
        pick(METODE),
        roundTo(randInt(50, 350) * 1000),
        "Denda 1–3 hari keterlambatan",
      );
    }

    // ---------------- PEMASUKAN: layanan tambahan ----------------
    const antarJemput = randInt(2, 4);
    for (let i = 0; i < antarJemput; i++) {
      insertTransaksi.run(
        randomDate(y, m, maxDay),
        "pemasukan",
        "Layanan Tambahan",
        pick(["Antar-jemput bandara", "Antar-jemput hotel", "Pengantaran unit ke alamat pelanggan", "Paket antar-jemput luar kota"]),
        null,
        null,
        pick(PELANGGAN),
        null,
        pick(METODE),
        roundTo(randInt(100, 300) * 1000),
        "Layanan tambahan di luar tarif sewa",
      );
    }

    // ---------------- PENGELUARAN: rutin bulanan ----------------
    for (const tpl of EXPENSE_TEMPLATES) {
      const day = Math.min(tpl.day, maxDay ?? 31);
      insertTransaksi.run(
        `${y}-${pad(m)}-${pad(day)}`,
        "pengeluaran",
        tpl.kategori,
        tpl.keterangan,
        null,
        null,
        null,
        null,
        tpl.metode,
        roundTo(randInt(tpl.nominal[0], tpl.nominal[1]), 50000),
        null,
      );
    }

    // ---------------- PENGELUARAN: perawatan unit ----------------
    const jumlahServis = randInt(2, 4);
    for (let i = 0; i < jumlahServis; i++) {
      const vehicle = pick(fleet);
      insertTransaksi.run(
        randomDate(y, m, maxDay),
        "pengeluaran",
        "Perawatan & Servis",
        `${pick(MAINTENANCE_NOTES)} — ${vehicle.name} (${vehicle.platNomor})`,
        idByPlat.get(vehicle.platNomor),
        vehicle.platNomor,
        null,
        null,
        pick(["Tunai", "Transfer Bank", "QRIS"]),
        roundTo(randInt(350, 2800) * 1000, 50000),
        "Biaya perawatan berkala armada",
      );
    }

    // ---------------- PENGELUARAN: sparepart ----------------
    if (rand() < 0.8) {
      insertTransaksi.run(
        randomDate(y, m, maxDay),
        "pengeluaran",
        "Sparepart",
        pick(SPAREPART_NOTES),
        null,
        null,
        null,
        null,
        "Transfer Bank",
        roundTo(randInt(600, 3200) * 1000, 50000),
        "Stok sparepart gudang",
      );
    }

    // ---------------- PENGELUARAN: pajak & legalitas ----------------
    if (rand() < 0.55) {
      const vehicle = pick(fleet);
      insertTransaksi.run(
        randomDate(y, m, maxDay),
        "pengeluaran",
        "Pajak & Legalitas",
        `Perpanjangan pajak & STNK ${vehicle.name} (${vehicle.platNomor})`,
        idByPlat.get(vehicle.platNomor),
        vehicle.platNomor,
        null,
        null,
        "Transfer Bank",
        roundTo(randInt(1200, 2600) * 1000, 50000),
        "Biaya pajak tahunan kendaraan",
      );
    }

    // ---------------- PENGELUARAN: honor supir lepas ----------------
    if (rand() < 0.65) {
      insertTransaksi.run(
        randomDate(y, m, maxDay),
        "pengeluaran",
        "Honor Supir",
        "Honor supir lepas & lembur antar-jemput",
        null,
        null,
        null,
        null,
        "Tunai",
        roundTo(randInt(900, 2200) * 1000, 50000),
        null,
      );
    }
  }

  return {
    kendaraan: fleet.length,
    transaksi: db.prepare("SELECT COUNT(*) AS n FROM transaksi").get().n,
  };
}
