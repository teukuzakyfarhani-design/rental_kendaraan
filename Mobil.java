package SewaKendaraan;

// [INHERITANCE] Mobil mewarisi sifat dan method dari superclass Kendaraan menggunakan "extends"
public class Mobil extends Kendaraan {

    // [ENCAPSULATION] Atribut khusus Mobil disembunyikan dengan modifier private
    private int jumlahPenumpang;
    private boolean denganSupir;
    private static final double BIAYA_SUPIR_PER_HARI = 150000;

    public Mobil(String merk, String platNomor, double hargaSewaPerHari, int jumlahPenumpang, boolean denganSupir) {
        // [INHERITANCE] Memanggil constructor milik superclass (Kendaraan) menggunakan "super"
        super(merk, platNomor, hargaSewaPerHari);
        setJumlahPenumpang(jumlahPenumpang);
        this.denganSupir = denganSupir;
    }

    // [ENCAPSULATION] Getter & Setter untuk atribut milik Mobil
    public int getJumlahPenumpang() {
        return jumlahPenumpang;
    }

    public void setJumlahPenumpang(int jumlahPenumpang) {
        this.jumlahPenumpang = (jumlahPenumpang > 0) ? jumlahPenumpang : 4;
    }

    public boolean isDenganSupir() {
        return denganSupir;
    }

    public void setDenganSupir(boolean denganSupir) {
        this.denganSupir = denganSupir;
    }

    // [POLYMORPHISM - OVERRIDING] Mengisi implementasi method abstract getKategori() dari Kendaraan
    @Override
    public String getKategori() {
        return "Mobil";
    }

    // [POLYMORPHISM - OVERRIDING] Menulis ulang aturan hitungBiayaSewa khusus Mobil
    // (biaya dasar + biaya supir jika opsi denganSupir aktif)
    @Override
    public double hitungBiayaSewa(int jumlahHari) {
        if (jumlahHari <= 0) return 0;
        double biayaDasar = getHargaSewaPerHari() * jumlahHari;
        double biayaSupir = denganSupir ? (BIAYA_SUPIR_PER_HARI * jumlahHari) : 0;
        return biayaDasar + biayaSupir;
    }

    // [POLYMORPHISM - OVERRIDING] Memperluas method tampilkanInfo() dari Kendaraan
    // dengan memanggil super.tampilkanInfo() lalu menambah info khusus Mobil
    @Override
    public void tampilkanInfo() {
        super.tampilkanInfo();
        System.out.println("Kapasitas         : " + jumlahPenumpang + " Penumpang");
        System.out.println("Layanan Supir     : " + (denganSupir ? "Dengan Supir (+Rp 150.000/hari)" : "Lepas Kunci"));
    }
}