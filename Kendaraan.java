package SewaKendaraan;

// [ABSTRACTION] Class dibuat abstract karena "Kendaraan" adalah konsep umum/induk,
// bukan objek nyata langsung, dan mendefinisikan aturan method abstrak untuk turunannya.
public abstract class Kendaraan {

    // [ENCAPSULATION] Atribut dibuat private agar tidak bisa diubah sembarangan dari luar class.
    // Akses dan pengubahannya dikontrol melalui getter dan setter.
    private String merk;
    private String platNomor;
    private double hargaSewaPerHari;
    private boolean tersedia;

    // Constructor untuk menginisialisasi data awal saat objek dibuat
    public Kendaraan(String merk, String platNomor, double hargaSewaPerHari) {
        setMerk(merk);
        setPlatNomor(platNomor);
        setHargaSewaPerHari(hargaSewaPerHari);
        this.tersedia = true;
    }

    // [ENCAPSULATION] Getter & Setter dengan validasi data
    public String getMerk() {
        return merk;
    }

    public void setMerk(String merk) {
        // Validasi agar merk tidak kosong atau null
        if (merk != null && !merk.trim().isEmpty()) {
            this.merk = merk.trim();
        } else {
            this.merk = "Tidak Diketahui";
        }
    }

    public String getPlatNomor() {
        return platNomor;
    }

    public void setPlatNomor(String platNomor) {
        // Validasi dan format plat nomor agar konsisten (uppercase)
        if (platNomor != null && !platNomor.trim().isEmpty()) {
            this.platNomor = platNomor.trim().toUpperCase();
        } else {
            this.platNomor = "UNKNOWN";
        }
    }

    public double getHargaSewaPerHari() {
        return hargaSewaPerHari;
    }

    public void setHargaSewaPerHari(double hargaSewaPerHari) {
        // Validasi agar harga sewa selalu bernilai positif
        if (hargaSewaPerHari > 0) {
            this.hargaSewaPerHari = hargaSewaPerHari;
        } else {
            this.hargaSewaPerHari = 100000;
        }
    }

    public boolean isTersedia() {
        return tersedia;
    }

    // [ENCAPSULATION] Perubahan status "tersedia" dibungkus dalam method khusus
    // agar tidak bisa langsung diubah dari luar tanpa aturan
    public boolean prosesSewa() {
        if (!tersedia) {
            return false;
        }
        tersedia = false;
        return true;
    }

    public boolean prosesKembali() {
        if (tersedia) {
            return false;
        }
        tersedia = true;
        return true;
    }

    // [ABSTRACTION] Menyembunyikan detail implementasi kategori; tiap subclass wajib menentukan sendiri
    public abstract String getKategori();

    // [ABSTRACTION] Kontrak perhitungan biaya sewa yang wajib diimplementasikan tiap subclass
    // sesuai aturan tarif masing-masing jenis kendaraan
    public abstract double hitungBiayaSewa(int jumlahHari);

    // [POLYMORPHISM - OVERLOADING] Nama method sama (hitungBiayaSewa), tetapi parameter berbeda
    // (menambahkan parameter diskonPersen) dalam class yang sama
    public double hitungBiayaSewa(int jumlahHari, double diskonPersen) {
        double total = hitungBiayaSewa(jumlahHari);
        if (diskonPersen > 0 && diskonPersen <= 100) {
            return total - (total * (diskonPersen / 100.0));
        }
        return total;
    }

    public void tampilkanInfo() {
        System.out.println("Kategori          : " + getKategori());
        System.out.println("Merk              : " + merk);
        System.out.println("Plat Nomor        : " + platNomor);
        System.out.println("Harga Sewa/Hari   : Rp " + String.format("%,.0f", hargaSewaPerHari));
        System.out.println("Status            : " + (tersedia ? "Tersedia" : "Sedang Disewa"));
    }
}