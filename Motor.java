package SewaKendaraan;

// [INHERITANCE] Motor mewarisi Kendaraan menggunakan "extends"
public class Motor extends Kendaraan {

    // [ENCAPSULATION] Atribut khusus Motor dibuat private
    private int jumlahHelm;
    private String tipeTransmisi;

    public Motor(String merk, String platNomor, double hargaSewaPerHari, int jumlahHelm, String tipeTransmisi) {
        // [INHERITANCE] Memanggil constructor superclass Kendaraan
        super(merk, platNomor, hargaSewaPerHari);
        setJumlahHelm(jumlahHelm);
        setTipeTransmisi(tipeTransmisi);
    }

    // [ENCAPSULATION] Getter & Setter atribut Motor
    public int getJumlahHelm() {
        return jumlahHelm;
    }

    public void setJumlahHelm(int jumlahHelm) {
        this.jumlahHelm = (jumlahHelm >= 0 && jumlahHelm <= 2) ? jumlahHelm : 1;
    }

    public String getTipeTransmisi() {
        return tipeTransmisi;
    }

    public void setTipeTransmisi(String tipeTransmisi) {
        if (tipeTransmisi != null && !tipeTransmisi.trim().isEmpty()) {
            this.tipeTransmisi = tipeTransmisi.trim();
        } else {
            this.tipeTransmisi = "Matic";
        }
    }

    // [POLYMORPHISM - OVERRIDING] Implementasi getKategori() untuk Motor
    @Override
    public String getKategori() {
        return "Motor";
    }

    // [POLYMORPHISM - OVERRIDING] Aturan hitungBiayaSewa khusus Motor:
    // potongan otomatis 10% jika disewa >= 7 hari
    @Override
    public double hitungBiayaSewa(int jumlahHari) {
        if (jumlahHari <= 0) return 0;
        double total = getHargaSewaPerHari() * jumlahHari;
        if (jumlahHari >= 7) {
            total *= 0.90;
        }
        return total;
    }

    // [POLYMORPHISM - OVERRIDING] Memperluas tampilkanInfo() dengan detail Motor
    @Override
    public void tampilkanInfo() {
        super.tampilkanInfo();
        System.out.println("Transmisi         : " + tipeTransmisi);
        System.out.println("Kelengkapan Helm  : " + jumlahHelm + " Helm");
    }
}
