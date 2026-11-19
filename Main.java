package SewaKendaraan;

import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        RentalManager manager = new RentalManager();
        Scanner scanner = new Scanner(System.in);

        System.out.println("=== SISTEM MANAJEMEN RENTAL KENDARAAN ===");
        System.out.println("Total Mobil : " + manager.hitungTotalByKategori("Mobil") + " unit");
        System.out.println("Total Motor : " + manager.hitungTotalByKategori("Motor") + " unit");
        System.out.println("Total Armada: " + manager.getSemuaKendaraan().size() + " unit");

        boolean jalan = true;
        while (jalan) {
            System.out.println("\nMenu:");
            System.out.println("1. Lihat Semua Kendaraan");
            System.out.println("2. Lihat Kendaraan Tersedia");
            System.out.println("3. Sewa Kendaraan");
            System.out.println("4. Kembalikan Kendaraan");
            System.out.println("5. Keluar");
            System.out.print("Pilih menu (1-5): ");

            int pilihan;
            try {
                pilihan = Integer.parseInt(scanner.nextLine().trim());
            } catch (NumberFormatException e) {
                System.out.println("Input harus berupa angka.");
                continue;
            }

            switch (pilihan) {
                case 1:
                    tampilkanDaftar(manager.getSemuaKendaraan());
                    break;
                case 2:
                    tampilkanDaftar(manager.getKendaraanTersedia());
                    break;
                case 3:
                    System.out.print("Masukkan Plat Nomor (contoh: BL 1001 AA): ");
                    String platSewa = scanner.nextLine();
                    try {
                        System.out.print("Lama sewa (hari): ");
                        int hari = Integer.parseInt(scanner.nextLine().trim());
                        System.out.print("Diskon (% jika ada, isi 0 jika tidak): ");
                        double diskon = Double.parseDouble(scanner.nextLine().trim());

                        double totalBiaya = manager.sewaUnit(platSewa, hari, diskon);
                        if (totalBiaya >= 0) {
                            System.out.println("Sewa berhasil! Total biaya: Rp " + String.format("%,.0f", totalBiaya));
                        }
                    } catch (NumberFormatException e) {
                        System.out.println("Lama sewa dan diskon harus berupa angka.");
                    }
                    break;
                case 4:
                    System.out.print("Masukkan Plat Nomor yang dikembalikan: ");
                    String platKembali = scanner.nextLine();
                    manager.kembalikanUnit(platKembali);
                    break;
                case 5:
                    jalan = false;
                    System.out.println("Program selesai.");
                    break;
                default:
                    System.out.println("Pilihan tidak valid.");
            }
        }

        scanner.close();
    }

    // [POLYMORPHISM] List<Kendaraan> menampung campuran objek Mobil & Motor, lalu saat k.tampilkanInfo()
    // dipanggil, Java otomatis menjalankan versi method sesuai jenis objek aslinya
    private static void tampilkanDaftar(java.util.List<Kendaraan> daftar) {
        if (daftar.isEmpty()) {
            System.out.println("Tidak ada data kendaraan.");
            return;
        }
        int nomor = 1;
        for (Kendaraan k : daftar) {
            System.out.println("\n--- Unit #" + nomor++ + " ---");
            k.tampilkanInfo();
        }
    }
}