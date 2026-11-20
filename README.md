# RodaRent — Rental Kendaraan (Mobil & Motor)

Sistem manajemen & katalog rental **60 armada** (30 mobil + 30 motor) lengkap dengan
**laporan keuangan pemasukan/pengeluaran** yang tersimpan pada database **SQLite**
(`rental.db`) langsung di folder project.

Project ini terdiri dari dua bagian:

| Bagian | Teknologi | Keterangan |
| --- | --- | --- |
| Katalog & laporan | HTML + CSS + JavaScript, Node.js, SQLite | Website interaktif, foto armada dari internet |
| Program OOP | Java (`Kendaraan`, `Mobil`, `Motor`, `RentalManager`, `Main`) | Tugas PBO: abstraction, encapsulation, inheritance, polymorphism |

---

## Fitur Utama

### Website katalog (`website/index.html`)
- 60 unit armada dengan **foto full body sesuai merek & model** (Toyota Avanza, Honda Brio, Xpander, NMAX, dll).
- Pencarian berdasarkan nama/plat nomor, filter kategori, filter unit tersedia, dan pengurutan harga.
- Kalkulator tarif otomatis: lama sewa, opsi supir, diskon motor ≥ 7 hari (10%), dan diskon promo.
- Form sewa mencatat **nama pelanggan** dan **metode pembayaran**: transfer bank (pilihan BCA, BRI, BNI, Mandiri, BSI, Bank Kalsel, CIMB Niaga, lainnya) atau **tunai/cash**.
- Booking unit → status unit berubah menjadi *Sedang Disewa* dan **otomatis dicatat sebagai pemasukan** di database (saat dijalankan lewat server).

### Laporan keuangan (`website/laporan.html`)
- Ringkasan **total pemasukan, total pengeluaran, laba bersih, margin, dan jumlah transaksi**.
- Grafik arus kas per bulan + tabel rekap bulanan.
- Rekap per kategori pemasukan (sewa mobil, sewa motor, denda, layanan tambahan) dan pengeluaran (gaji, sewa, BBM, perawatan, asuransi, pajak, sparepart, promosi, dll).
- Tabel buku kas lengkap: filter periode (bulan), jenis, pencarian, urutkan, dan pagination.
- Form **catat transaksi baru** dan hapus transaksi.
- **Unduh CSV** dan **cetak laporan** (print-friendly).

### Laporan terminal (`npm run laporan`)
Mencetak laporan lengkap langsung dari SQLite ke terminal, termasuk rekap bulanan,
per kategori, top 5 unit penyumbang pendapatan, dan 10 transaksi terbaru.

---

## Struktur Folder

```
rental_kendaraan/
├── rental.db                 # Database SQLite (dibuat otomatis)
├── server.mjs                # Server lokal + REST API laporan
├── package.json
├── database/
│   ├── schema.sql            # Skema tabel, index, dan view
│   ├── seed.mjs              # Generator data armada + transaksi
│   └── init.mjs              # Inisialisasi / reset database
├── scripts/
│   └── laporan-cli.mjs       # Laporan lengkap di terminal
├── website/
│   ├── index.html            # Katalog armada
│   ├── laporan.html          # Halaman laporan keuangan
│   ├── styles.css
│   ├── laporan.css
│   ├── fleet-data.js         # Data master 60 armada + foto
│   ├── app.js                # Logika katalog & booking
│   ├── laporan.js            # Logika halaman laporan
│   └── images/
│       ├── cars/             # 30 foto mobil full body (JPG/PNG)
│       └── motors/           # 30 foto motor full body (JPG)
└── *.java                    # Program OOP Java
```

---

## Cara Menjalankan

Prasyarat: **Node.js ≥ 22.5** (memakai modul bawaan `node:sqlite`, tanpa `npm install`).

```bash
# 1. Buat database + data contoh (opsional, server juga otomatis membuatnya)
npm run db:init

# 2. Jalankan server
npm start
```

Buka:
- Katalog: <http://localhost:3000/>
- Laporan keuangan: <http://localhost:3000/laporan.html>

Perintah lain:

```bash
npm run db:reset                      # hapus & buat ulang database + seed
npm run laporan                       # laporan lengkap di terminal
npm run laporan -- --bulan=2026-11    # filter satu bulan
npm run laporan -- --dari=2026-05-01 --sampai=2026-11-20
npm run laporan -- --csv=laporan.csv  # ekspor CSV
```

---

## Skema Database

**Tabel `kendaraan`** — master 60 unit:
`id, kategori, nama, plat_nomor, harga_per_hari, penumpang, transmisi, helm, dengan_supir, gambar, status`

**Tabel `transaksi`** — buku kas:
`id, tanggal, jenis (pemasukan|pengeluaran), kategori, keterangan, kendaraan_id, plat_nomor, pelanggan, jumlah_hari, metode_bayar, nominal, catatan, dibuat_pada`

**View**:
- `v_laporan_bulanan` — pemasukan, pengeluaran, laba bersih per bulan.
- `v_rekap_kategori` — total transaksi per kategori.

Data seed berisi **442 transaksi** periode **Mei–November 2026**:
- Pemasukan: sewa harian mobil/motor, kontrak korporat, denda keterlambatan, layanan antar-jemput.
- Pengeluaran: gaji karyawan, sewa kantor & utilitas, BBM, perawatan unit, sparepart, asuransi, pajak/STNK, honor supir, promosi, operasional kantor.

### API

| Method | Endpoint | Fungsi |
| --- | --- | --- |
| GET | `/api/laporan/ringkasan?dari=&sampai=` | Total pemasukan/pengeluaran/laba + rekap kategori |
| GET | `/api/laporan/bulanan?dari=&sampai=` | Rekap per bulan |
| GET | `/api/laporan/kategori` | Daftar kategori transaksi |
| GET | `/api/transaksi?jenis=&q=&dari=&sampai=&limit=&offset=&sort=` | Daftar transaksi |
| POST | `/api/transaksi` | Tambah transaksi |
| DELETE | `/api/transaksi/:id` | Hapus transaksi |
| GET | `/api/kendaraan` | Daftar armada + total pendapatan |
| GET | `/api/laporan/export.csv?...` | Unduh CSV |

Contoh menambah transaksi:

```bash
curl -X POST http://localhost:3000/api/transaksi \
  -H "Content-Type: application/json" \
  -d '{"tanggal":"2026-11-20","jenis":"pemasukan","kategori":"Sewa Mobil","keterangan":"Sewa Toyota Avanza 3 hari","plat_nomor":"BL 1001 AA","pelanggan":"Budi Santoso","jumlah_hari":3,"metode_bayar":"Transfer BCA","nominal":1050000}'
```

---

## Aturan Tarif

- **Mobil**: harga harian × lama sewa; opsi supir **+Rp 150.000/hari**.
- **Motor**: harga harian × lama sewa; **diskon otomatis 10%** jika sewa ≥ 7 hari.
- **Diskon promo** tambahan 0–100% (opsional).
- Perhitungan yang sama dipakai di `app.js` (website) dan `Mobil.java` / `Motor.java`.

---

## Sumber Gambar

**60 foto armada** (30 mobil + 30 motor) diambil langsung dari internet melalui
**Wikimedia Commons**, lalu disimpan lokal di `website/images/cars/` dan
`website/images/motors/` agar situs tetap berjalan tanpa koneksi (termasuk saat
dibuka langsung lewat `file://`). Pemilihan gambar memprioritaskan tampak depan /
depan-samping **full body** yang sesuai merek dan model unit.

Setiap kartu menampilkan tautan kredit **"Foto: Wikimedia Commons"**. Daftar lengkap
judul berkas, URL sumber, pemilik, dan lisensi tersedia pada variabel
`window.FLEET_IMAGE_SOURCES` di `website/fleet-data.js`. Sebagian besar gambar
berlisensi CC BY-SA / domain publik — sertakan atribusi bila digunakan ulang.

## Program Java

Compile & jalankan:

```bash
javac -d . Kendaraan.java Mobil.java Motor.java RentalManager.java Main.java
java SewaKendaraan.Main
```

Menu: lihat kendaraan, sewa, kembalikan, dan keluar. Program Java memakai aturan tarif
yang sama dengan website.
