package SewaKendaraan;

import java.util.ArrayList;
import java.util.List;

public class RentalManager {
    // [ENCAPSULATION] List armada dikelola melalui method class ini
    private final List<Kendaraan> armada;

    public RentalManager() {
        this.armada = new ArrayList<>();
        inisialisasiDataAwal();
    }

    private void inisialisasiDataAwal() {
        // --- 30 UNIT MOBIL ---
        armada.add(new Mobil("Toyota Avanza 1.3 E", "BL 1001 AA", 350000, 7, false));
        armada.add(new Mobil("Toyota Avanza 1.5 G", "BL 1002 AB", 380000, 7, true));
        armada.add(new Mobil("Toyota Veloz Q", "BL 1003 AC", 420000, 7, false));
        armada.add(new Mobil("Toyota Innova Reborn G", "BL 1004 AD", 550000, 7, false));
        armada.add(new Mobil("Toyota Innova Reborn V", "BL 1005 AE", 600000, 7, true));
        armada.add(new Mobil("Toyota Innova Zenix Hybrid", "BL 1006 AF", 750000, 7, true));
        armada.add(new Mobil("Toyota Fortuner VRZ", "BL 1007 AG", 850000, 7, false));
        armada.add(new Mobil("Toyota Rush TRD", "BL 1008 AH", 400000, 7, false));
        armada.add(new Mobil("Toyota Calya G", "BL 1009 AI", 300000, 7, false));
        armada.add(new Mobil("Toyota Agya GR Sport", "BL 1010 AJ", 280000, 5, false));
        armada.add(new Mobil("Honda Brio Satya E", "BL 1011 AK", 290000, 5, false));
        armada.add(new Mobil("Honda Brio RS CVT", "BL 1012 AL", 330000, 5, false));
        armada.add(new Mobil("Honda Mobilio E", "BL 1013 AM", 340000, 7, false));
        armada.add(new Mobil("Honda HR-V SE", "BL 1014 AN", 520000, 5, false));
        armada.add(new Mobil("Honda CR-V Turbo", "BL 1015 AO", 700000, 5, true));
        armada.add(new Mobil("Mitsubishi Xpander Exceed", "BL 1016 AP", 430000, 7, false));
        armada.add(new Mobil("Mitsubishi Xpander Ultimate", "BL 1017 AQ", 470000, 7, true));
        armada.add(new Mobil("Mitsubishi Xpander Cross", "BL 1018 AR", 490000, 7, false));
        armada.add(new Mobil("Mitsubishi Pajero Sport Dakar", "BL 1019 AS", 850000, 7, true));
        armada.add(new Mobil("Daihatsu Xenia 1.3 R", "BL 1020 AT", 340000, 7, false));
        armada.add(new Mobil("Daihatsu Sigra R", "BL 1021 AU", 295000, 7, false));
        armada.add(new Mobil("Daihatsu Terios X", "BL 1022 AV", 390000, 7, false));
        armada.add(new Mobil("Daihatsu Ayla R", "BL 1023 AW", 275000, 5, false));
        armada.add(new Mobil("Suzuki Ertiga Hybrid", "BL 1024 AX", 370000, 7, false));
        armada.add(new Mobil("Suzuki XL7 Alpha", "BL 1025 AY", 410000, 7, false));
        armada.add(new Mobil("Hyundai Stargazer Prime", "BL 1026 AZ", 440000, 7, false));
        armada.add(new Mobil("Hyundai Creta Trend", "BL 1027 BA", 480000, 5, false));
        armada.add(new Mobil("Wuling Confero S", "BL 1028 BB", 320000, 7, false));
        armada.add(new Mobil("Wuling Almaz RS", "BL 1029 BC", 580000, 5, false));
        armada.add(new Mobil("Nissan Livina VL", "BL 1030 BD", 360000, 7, false));

        // --- 30 UNIT MOTOR ---
        armada.add(new Motor("Honda Beat CBS", "BL 2001 MA", 75000, 2, "Matic"));
        armada.add(new Motor("Honda Beat Deluxe", "BL 2002 MB", 80000, 2, "Matic"));
        armada.add(new Motor("Honda Beat Street", "BL 2003 MC", 80000, 1, "Matic"));
        armada.add(new Motor("Honda Scoopy Prestige", "BL 2004 MD", 90000, 2, "Matic"));
        armada.add(new Motor("Honda Vario 125 CBS", "BL 2005 ME", 95000, 2, "Matic"));
        armada.add(new Motor("Honda Vario 160 ABS", "BL 2006 MF", 115000, 2, "Matic"));
        armada.add(new Motor("Honda PCX 160 ABS", "BL 2007 MG", 145000, 2, "Matic"));
        armada.add(new Motor("Honda ADV 160", "BL 2008 MH", 150000, 2, "Matic"));
        armada.add(new Motor("Honda Genio CBS", "BL 2009 MI", 85000, 1, "Matic"));
        armada.add(new Motor("Honda Supra X 125 FI", "BL 2010 MJ", 85000, 1, "Manual"));
        armada.add(new Motor("Honda CB150R Streetfire", "BL 2011 MK", 135000, 1, "Manual"));
        armada.add(new Motor("Honda CRF150L", "BL 2012 ML", 155000, 1, "Manual"));
        armada.add(new Motor("Yamaha Mio M3 125", "BL 2013 MM", 75000, 2, "Matic"));
        armada.add(new Motor("Yamaha Gear 125", "BL 2014 MN", 80000, 2, "Matic"));
        armada.add(new Motor("Yamaha Fazzio Hybrid", "BL 2015 MO", 95000, 2, "Matic"));
        armada.add(new Motor("Yamaha Grand Filano", "BL 2016 MP", 105000, 2, "Matic"));
        armada.add(new Motor("Yamaha Freego 125", "BL 2017 MQ", 85000, 2, "Matic"));
        armada.add(new Motor("Yamaha Aerox 155 Connected", "BL 2018 MR", 130000, 2, "Matic"));
        armada.add(new Motor("Yamaha NMAX 155 Connected", "BL 2019 MS", 135000, 2, "Matic"));
        armada.add(new Motor("Yamaha Lexi LX 155", "BL 2020 MT", 120000, 2, "Matic"));
        armada.add(new Motor("Yamaha XMAX 250", "BL 2021 MU", 250000, 2, "Matic"));
        armada.add(new Motor("Yamaha Vixion R 155", "BL 2022 MV", 130000, 1, "Manual"));
        armada.add(new Motor("Yamaha WR 155 R", "BL 2023 MW", 160000, 1, "Manual"));
        armada.add(new Motor("Yamaha Jupiter Z1", "BL 2024 MX", 80000, 1, "Manual"));
        armada.add(new Motor("Suzuki Nex II", "BL 2025 MY", 75000, 1, "Matic"));
        armada.add(new Motor("Suzuki Address FI", "BL 2026 MZ", 80000, 2, "Matic"));
        armada.add(new Motor("Suzuki Burgman Street 125EX", "BL 2027 NA", 105000, 2, "Matic"));
        armada.add(new Motor("Suzuki GSX-R150", "BL 2028 NB", 165000, 1, "Manual"));
        armada.add(new Motor("Kawasaki KLX 150", "BL 2029 NC", 155000, 1, "Manual"));
        armada.add(new Motor("Vespa LX 125 i-Get", "BL 2030 ND", 180000, 2, "Matic"));
    }

    // [POLYMORPHISM] Parameter bertipe Kendaraan bisa menerima objek Mobil maupun Motor
    public void tambahKendaraan(Kendaraan kendaraan) {
        if (kendaraan != null) {
            armada.add(kendaraan);
        }
    }

    public Kendaraan cariByPlat(String platNomor) {
        if (platNomor == null) return null;
        String target = platNomor.trim().toUpperCase();
        for (Kendaraan k : armada) {
            if (k.getPlatNomor().equalsIgnoreCase(target)) {
                return k;
            }
        }
        return null;
    }

    public List<Kendaraan> getSemuaKendaraan() {
        return armada;
    }

    public List<Kendaraan> getKendaraanTersedia() {
        List<Kendaraan> hasil = new ArrayList<>();
        for (Kendaraan k : armada) {
            if (k.isTersedia()) {
                hasil.add(k);
            }
        }
        return hasil;
    }

    public int hitungTotalByKategori(String kategori) {
        int count = 0;
        for (Kendaraan k : armada) {
            if (k.getKategori().equalsIgnoreCase(kategori)) {
                count++;
            }
        }
        return count;
    }

    public double sewaUnit(String platNomor, int jumlahHari, double diskonPersen) {
        if (jumlahHari <= 0) {
            System.out.println("Lama sewa harus lebih dari 0 hari.");
            return -1;
        }
        if (!Double.isFinite(diskonPersen) || diskonPersen < 0 || diskonPersen > 100) {
            System.out.println("Diskon harus berada di antara 0 sampai 100 persen.");
            return -1;
        }

        Kendaraan k = cariByPlat(platNomor);
        if (k == null) {
            System.out.println("Kendaraan dengan plat " + platNomor + " tidak ditemukan.");
            return -1;
        }
        if (!k.prosesSewa()) {
            System.out.println("Kendaraan " + k.getMerk() + " (" + k.getPlatNomor() + ") sedang tidak tersedia.");
            return -1;
        }
        // [POLYMORPHISM - DYNAMIC BINDING] Memanggil hitungBiayaSewa sesuai tipe asli objek
        // (apakah Mobil atau Motor) saat program berjalan
        return k.hitungBiayaSewa(jumlahHari, diskonPersen);
    }

    public boolean kembalikanUnit(String platNomor) {
        Kendaraan k = cariByPlat(platNomor);
        if (k == null) {
            System.out.println("Kendaraan dengan plat " + platNomor + " tidak ditemukan.");
            return false;
        }
        if (!k.prosesKembali()) {
            System.out.println("Kendaraan " + k.getMerk() + " (" + k.getPlatNomor() + ") memang sudah tersedia.");
            return false;
        }
        System.out.println("Pengembalian berhasil: " + k.getMerk() + " (" + k.getPlatNomor() + ")");
        return true;
    }
}
