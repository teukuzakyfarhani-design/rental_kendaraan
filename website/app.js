// Data lengkap 30 Mobil + 30 Motor sesuai program Java SewaKendaraan
// Foto lokal di folder images/ dipadukan dengan foto asli kendaraan per merek/model
const fleetData = [
  // --- 30 UNIT MOBIL ---
  {
    category: "Mobil",
    name: "Toyota Avanza 1.3 E",
    platNomor: "BL 1001 AA",
    price: 350000,
    passengers: 7,
    withDriver: false,
    available: true,
    image: "images/avanza.jpg"
  },
  {
    category: "Mobil",
    name: "Toyota Avanza 1.5 G",
    platNomor: "BL 1002 AB",
    price: 380000,
    passengers: 7,
    withDriver: true,
    available: true,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/2021_Toyota_Avanza_1.5_G_Toyota_Safety_Sense_%28Indonesia%29_front_view_01.jpg/640px-2021_Toyota_Avanza_1.5_G_Toyota_Safety_Sense_%28Indonesia%29_front_view_01.jpg"
  },
  {
    category: "Mobil",
    name: "Toyota Veloz Q",
    platNomor: "BL 1003 AC",
    price: 420000,
    passengers: 7,
    withDriver: false,
    available: true,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/2021_Toyota_Veloz_1.5_Q_TSS_%28Indonesia%29_front_view.jpg/640px-2021_Toyota_Veloz_1.5_Q_TSS_%28Indonesia%29_front_view.jpg"
  },
  {
    category: "Mobil",
    name: "Toyota Innova Reborn G",
    platNomor: "BL 1004 AD",
    price: 550000,
    passengers: 7,
    withDriver: false,
    available: true,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/2021_Toyota_Kijang_Innova_2.4_G_%28Indonesia%29_front_view.jpg/640px-2021_Toyota_Kijang_Innova_2.4_G_%28Indonesia%29_front_view.jpg"
  },
  {
    category: "Mobil",
    name: "Toyota Innova Reborn V",
    platNomor: "BL 1005 AE",
    price: 600000,
    passengers: 7,
    withDriver: true,
    available: true,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/2021_Toyota_Kijang_Innova_2.4_V_%28Indonesia%29_front_view.jpg/640px-2021_Toyota_Kijang_Innova_2.4_V_%28Indonesia%29_front_view.jpg"
  },
  {
    category: "Mobil",
    name: "Toyota Innova Zenix Hybrid",
    platNomor: "BL 1006 AF",
    price: 750000,
    passengers: 7,
    withDriver: true,
    available: true,
    image: "images/innova-zenix.jpg"
  },
  {
    category: "Mobil",
    name: "Toyota Fortuner VRZ",
    platNomor: "BL 1007 AG",
    price: 850000,
    passengers: 7,
    withDriver: false,
    available: true,
    image: "images/fortuner.jpg"
  },
  {
    category: "Mobil",
    name: "Toyota Rush TRD",
    platNomor: "BL 1008 AH",
    price: 400000,
    passengers: 7,
    withDriver: false,
    available: true,
    image: "images/rush.jpg"
  },
  {
    category: "Mobil",
    name: "Toyota Calya G",
    platNomor: "BL 1009 AI",
    price: 300000,
    passengers: 7,
    withDriver: false,
    available: true,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/2019_Toyota_Calya_1.2_G_%28B401RA%29_front_view.jpg/640px-2019_Toyota_Calya_1.2_G_%28B401RA%29_front_view.jpg"
  },
  {
    category: "Mobil",
    name: "Toyota Agya GR Sport",
    platNomor: "BL 1010 AJ",
    price: 280000,
    passengers: 5,
    withDriver: false,
    available: true,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/2023_Toyota_Agya_1.2_GR_Sport_%28Indonesia%29_front_view.jpg/640px-2023_Toyota_Agya_1.2_GR_Sport_%28Indonesia%29_front_view.jpg"
  },
  {
    category: "Mobil",
    name: "Honda Brio Satya E",
    platNomor: "BL 1011 AK",
    price: 290000,
    passengers: 5,
    withDriver: false,
    available: true,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/2023_Honda_Brio_Satya_1.2_E_%28Indonesia%29_front_view.jpg/640px-2023_Honda_Brio_Satya_1.2_E_%28Indonesia%29_front_view.jpg"
  },
  {
    category: "Mobil",
    name: "Honda Brio RS CVT",
    platNomor: "BL 1012 AL",
    price: 330000,
    passengers: 5,
    withDriver: false,
    available: true,
    image: "images/brio.jpg"
  },
  {
    category: "Mobil",
    name: "Honda Mobilio E",
    platNomor: "BL 1013 AM",
    price: 340000,
    passengers: 7,
    withDriver: false,
    available: true,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/2019_Honda_Mobilio_1.5_E_%28Indonesia%29_front_view.jpg/640px-2019_Honda_Mobilio_1.5_E_%28Indonesia%29_front_view.jpg"
  },
  {
    category: "Mobil",
    name: "Honda HR-V SE",
    platNomor: "BL 1014 AN",
    price: 520000,
    passengers: 5,
    withDriver: false,
    available: true,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/2022_Honda_HR-V_1.5_SE_%28Indonesia%29_front_view.jpg/640px-2022_Honda_HR-V_1.5_SE_%28Indonesia%29_front_view.jpg"
  },
  {
    category: "Mobil",
    name: "Honda CR-V Turbo",
    platNomor: "BL 1015 AO",
    price: 700000,
    passengers: 5,
    withDriver: true,
    available: true,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/2021_Honda_CR-V_1.5_Prestige_Turbo_%28Indonesia%29_front_view.jpg/640px-2021_Honda_CR-V_1.5_Prestige_Turbo_%28Indonesia%29_front_view.jpg"
  },
  {
    category: "Mobil",
    name: "Mitsubishi Xpander Exceed",
    platNomor: "BL 1016 AP",
    price: 430000,
    passengers: 7,
    withDriver: false,
    available: true,
    image: "images/xpander.jpg"
  },
  {
    category: "Mobil",
    name: "Mitsubishi Xpander Ultimate",
    platNomor: "BL 1017 AQ",
    price: 470000,
    passengers: 7,
    withDriver: true,
    available: true,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/2022_Mitsubishi_Xpander_Ultimate_%28Indonesia%29_front_view.jpg/640px-2022_Mitsubishi_Xpander_Ultimate_%28Indonesia%29_front_view.jpg"
  },
  {
    category: "Mobil",
    name: "Mitsubishi Xpander Cross",
    platNomor: "BL 1018 AR",
    price: 490000,
    passengers: 7,
    withDriver: false,
    available: true,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/2022_Mitsubishi_Xpander_Cross_%28Indonesia%29_front_view.jpg/640px-2022_Mitsubishi_Xpander_Cross_%28Indonesia%29_front_view.jpg"
  },
  {
    category: "Mobil",
    name: "Mitsubishi Pajero Sport Dakar",
    platNomor: "BL 1019 AS",
    price: 850000,
    passengers: 7,
    withDriver: true,
    available: true,
    image: "images/pajero-sport.jpg"
  },
  {
    category: "Mobil",
    name: "Daihatsu Xenia 1.3 R",
    platNomor: "BL 1020 AT",
    price: 340000,
    passengers: 7,
    withDriver: false,
    available: true,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/2021_Daihatsu_Xenia_1.5_R_ASA_%28Indonesia%29_front_view.jpg/640px-2021_Daihatsu_Xenia_1.5_R_ASA_%28Indonesia%29_front_view.jpg"
  },
  {
    category: "Mobil",
    name: "Daihatsu Sigra R",
    platNomor: "BL 1021 AU",
    price: 295000,
    passengers: 7,
    withDriver: false,
    available: true,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/2022_Daihatsu_Sigra_1.2_R_%28Indonesia%29_front_view.jpg/640px-2022_Daihatsu_Sigra_1.2_R_%28Indonesia%29_front_view.jpg"
  },
  {
    category: "Mobil",
    name: "Daihatsu Terios X",
    platNomor: "BL 1022 AV",
    price: 390000,
    passengers: 7,
    withDriver: false,
    available: true,
    image: "images/terios.jpg"
  },
  {
    category: "Mobil",
    name: "Daihatsu Ayla R",
    platNomor: "BL 1023 AW",
    price: 275000,
    passengers: 5,
    withDriver: false,
    available: true,
    image: "images/ayla.jpg"
  },
  {
    category: "Mobil",
    name: "Suzuki Ertiga Hybrid",
    platNomor: "BL 1024 AX",
    price: 370000,
    passengers: 7,
    withDriver: false,
    available: true,
    image: "images/ertiga.jpg"
  },
  {
    category: "Mobil",
    name: "Suzuki XL7 Alpha",
    platNomor: "BL 1025 AY",
    price: 410000,
    passengers: 7,
    withDriver: false,
    available: true,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/2020_Suzuki_XL7_Alpha_%28Indonesia%29_front_view.jpg/640px-2020_Suzuki_XL7_Alpha_%28Indonesia%29_front_view.jpg"
  },
  {
    category: "Mobil",
    name: "Hyundai Stargazer Prime",
    platNomor: "BL 1026 AZ",
    price: 440000,
    passengers: 7,
    withDriver: false,
    available: true,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/2022_Hyundai_Stargazer_Prime_%28Indonesia%29_front_view.jpg/640px-2022_Hyundai_Stargazer_Prime_%28Indonesia%29_front_view.jpg"
  },
  {
    category: "Mobil",
    name: "Hyundai Creta Trend",
    platNomor: "BL 1027 BA",
    price: 480000,
    passengers: 5,
    withDriver: false,
    available: true,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/2022_Hyundai_Creta_Prime_%28Indonesia%29_front_view.jpg/640px-2022_Hyundai_Creta_Prime_%28Indonesia%29_front_view.jpg"
  },
  {
    category: "Mobil",
    name: "Wuling Confero S",
    platNomor: "BL 1028 BB",
    price: 320000,
    passengers: 7,
    withDriver: false,
    available: true,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/2021_Wuling_Confero_S_1.5_L_%28Indonesia%29_front_view.jpg/640px-2021_Wuling_Confero_S_1.5_L_%28Indonesia%29_front_view.jpg"
  },
  {
    category: "Mobil",
    name: "Wuling Almaz RS",
    platNomor: "BL 1029 BC",
    price: 580000,
    passengers: 5,
    withDriver: false,
    available: true,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/2021_Wuling_Almaz_RS_Pro_%28Indonesia%29_front_view.jpg/640px-2021_Wuling_Almaz_RS_Pro_%28Indonesia%29_front_view.jpg"
  },
  {
    category: "Mobil",
    name: "Nissan Livina VL",
    platNomor: "BL 1030 BD",
    price: 360000,
    passengers: 7,
    withDriver: false,
    available: true,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/2019_Nissan_Livina_1.5_VL_%28Indonesia%29_front_view.jpg/640px-2019_Nissan_Livina_1.5_VL_%28Indonesia%29_front_view.jpg"
  },

  // --- 30 UNIT MOTOR ---
  {
    category: "Motor",
    name: "Honda Beat CBS",
    platNomor: "BL 2001 MA",
    price: 75000,
    helmets: 2,
    transmission: "Matic",
    available: true,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/2020_Honda_BeAT_CBS_%28Indonesia%29_front_right_view.jpg/640px-2020_Honda_BeAT_CBS_%28Indonesia%29_front_right_view.jpg"
  },
  {
    category: "Motor",
    name: "Honda Beat Deluxe",
    platNomor: "BL 2002 MB",
    price: 80000,
    helmets: 2,
    transmission: "Matic",
    available: true,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/2023_Honda_BeAT_Deluxe_%28Indonesia%29_front_right_view.jpg/640px-2023_Honda_BeAT_Deluxe_%28Indonesia%29_front_right_view.jpg"
  },
  {
    category: "Motor",
    name: "Honda Beat Street",
    platNomor: "BL 2003 MC",
    price: 80000,
    helmets: 1,
    transmission: "Matic",
    available: true,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/2020_Honda_BeAT_Street_%28Indonesia%29_front_right_view.jpg/640px-2020_Honda_BeAT_Street_%28Indonesia%29_front_right_view.jpg"
  },
  {
    category: "Motor",
    name: "Honda Scoopy Prestige",
    platNomor: "BL 2004 MD",
    price: 90000,
    helmets: 2,
    transmission: "Matic",
    available: true,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/2021_Honda_Scoopy_Prestige_%28Indonesia%29_front_right_view.jpg/640px-2021_Honda_Scoopy_Prestige_%28Indonesia%29_front_right_view.jpg"
  },
  {
    category: "Motor",
    name: "Honda Vario 125 CBS",
    platNomor: "BL 2005 ME",
    price: 95000,
    helmets: 2,
    transmission: "Matic",
    available: true,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/2022_Honda_Vario_125_CBS-ISS_%28Indonesia%29_front_right_view.jpg/640px-2022_Honda_Vario_125_CBS-ISS_%28Indonesia%29_front_right_view.jpg"
  },
  {
    category: "Motor",
    name: "Honda Vario 160 ABS",
    platNomor: "BL 2006 MF",
    price: 115000,
    helmets: 2,
    transmission: "Matic",
    available: true,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/2022_Honda_Vario_160_ABS_%28Indonesia%29_front_right_view.jpg/640px-2022_Honda_Vario_160_ABS_%28Indonesia%29_front_right_view.jpg"
  },
  {
    category: "Motor",
    name: "Honda PCX 160 ABS",
    platNomor: "BL 2007 MG",
    price: 145000,
    helmets: 2,
    transmission: "Matic",
    available: true,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/2021_Honda_PCX_160_ABS_%28Indonesia%29_front_right_view.jpg/640px-2021_Honda_PCX_160_ABS_%28Indonesia%29_front_right_view.jpg"
  },
  {
    category: "Motor",
    name: "Honda ADV 160",
    platNomor: "BL 2008 MH",
    price: 150000,
    helmets: 2,
    transmission: "Matic",
    available: true,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/2022_Honda_ADV_160_ABS_%28Indonesia%29_front_right_view.jpg/640px-2022_Honda_ADV_160_ABS_%28Indonesia%29_front_right_view.jpg"
  },
  {
    category: "Motor",
    name: "Honda Genio CBS",
    platNomor: "BL 2009 MI",
    price: 85000,
    helmets: 1,
    transmission: "Matic",
    available: true,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/2022_Honda_Genio_CBS_%28Indonesia%29_front_right_view.jpg/640px-2022_Honda_Genio_CBS_%28Indonesia%29_front_right_view.jpg"
  },
  {
    category: "Motor",
    name: "Honda Supra X 125 FI",
    platNomor: "BL 2010 MJ",
    price: 85000,
    helmets: 1,
    transmission: "Manual",
    available: true,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Honda_Supra_X_125_FI.jpg/640px-Honda_Supra_X_125_FI.jpg"
  },
  {
    category: "Motor",
    name: "Honda CB150R Streetfire",
    platNomor: "BL 2011 MK",
    price: 135000,
    helmets: 1,
    transmission: "Manual",
    available: true,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/2021_Honda_CB150R_StreetFire_%28Indonesia%29_front_right_view.jpg/640px-2021_Honda_CB150R_StreetFire_%28Indonesia%29_front_right_view.jpg"
  },
  {
    category: "Motor",
    name: "Honda CRF150L",
    platNomor: "BL 2012 ML",
    price: 155000,
    helmets: 1,
    transmission: "Manual",
    available: true,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Honda_CRF150L_Indonesia.jpg/640px-Honda_CRF150L_Indonesia.jpg"
  },
  {
    category: "Motor",
    name: "Yamaha Mio M3 125",
    platNomor: "BL 2013 MM",
    price: 75000,
    helmets: 2,
    transmission: "Matic",
    available: true,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Yamaha_Mio_M3_125.jpg/640px-Yamaha_Mio_M3_125.jpg"
  },
  {
    category: "Motor",
    name: "Yamaha Gear 125",
    platNomor: "BL 2014 MN",
    price: 80000,
    helmets: 2,
    transmission: "Matic",
    available: true,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/2021_Yamaha_Gear_125_S_%28Indonesia%29_front_right_view.jpg/640px-2021_Yamaha_Gear_125_S_%28Indonesia%29_front_right_view.jpg"
  },
  {
    category: "Motor",
    name: "Yamaha Fazzio Hybrid",
    platNomor: "BL 2015 MO",
    price: 95000,
    helmets: 2,
    transmission: "Matic",
    available: true,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/2022_Yamaha_Fazzio_Hybrid_Connected_Lux_%28Indonesia%29_front_right_view.jpg/640px-2022_Yamaha_Fazzio_Hybrid_Connected_Lux_%28Indonesia%29_front_right_view.jpg"
  },
  {
    category: "Motor",
    name: "Yamaha Grand Filano",
    platNomor: "BL 2016 MP",
    price: 105000,
    helmets: 2,
    transmission: "Matic",
    available: true,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/2023_Yamaha_Grand_Filano_Hybrid_Connected_Lux_%28Indonesia%29_front_right_view.jpg/640px-2023_Yamaha_Grand_Filano_Hybrid_Connected_Lux_%28Indonesia%29_front_right_view.jpg"
  },
  {
    category: "Motor",
    name: "Yamaha Freego 125",
    platNomor: "BL 2017 MQ",
    price: 85000,
    helmets: 2,
    transmission: "Matic",
    available: true,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/2022_Yamaha_FreeGo_125_Connected_%28Indonesia%29_front_right_view.jpg/640px-2022_Yamaha_FreeGo_125_Connected_%28Indonesia%29_front_right_view.jpg"
  },
  {
    category: "Motor",
    name: "Yamaha Aerox 155 Connected",
    platNomor: "BL 2018 MR",
    price: 130000,
    helmets: 2,
    transmission: "Matic",
    available: true,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/2021_Yamaha_All_New_Aerox_155_Connected_ABS_%28Indonesia%29_front_right_view.jpg/640px-2021_Yamaha_All_New_Aerox_155_Connected_ABS_%28Indonesia%29_front_right_view.jpg"
  },
  {
    category: "Motor",
    name: "Yamaha NMAX 155 Connected",
    platNomor: "BL 2019 MS",
    price: 135000,
    helmets: 2,
    transmission: "Matic",
    available: true,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/2020_Yamaha_All_New_NMAX_155_Connected_ABS_%28Indonesia%29_front_right_view.jpg/640px-2020_Yamaha_All_New_NMAX_155_Connected_ABS_%28Indonesia%29_front_right_view.jpg"
  },
  {
    category: "Motor",
    name: "Yamaha Lexi LX 155",
    platNomor: "BL 2020 MT",
    price: 120000,
    helmets: 2,
    transmission: "Matic",
    available: true,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/2018_Yamaha_Lexi_S_125_%28Indonesia%29_front_right_view.jpg/640px-2018_Yamaha_Lexi_S_125_%28Indonesia%29_front_right_view.jpg"
  },
  {
    category: "Motor",
    name: "Yamaha XMAX 250",
    platNomor: "BL 2021 MU",
    price: 250000,
    helmets: 2,
    transmission: "Matic",
    available: true,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/2023_Yamaha_XMAX_250_Connected_%28Indonesia%29_front_right_view.jpg/640px-2023_Yamaha_XMAX_250_Connected_%28Indonesia%29_front_right_view.jpg"
  },
  {
    category: "Motor",
    name: "Yamaha Vixion R 155",
    platNomor: "BL 2022 MV",
    price: 130000,
    helmets: 1,
    transmission: "Manual",
    available: true,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Yamaha_V-Ixion_R.jpg/640px-Yamaha_V-Ixion_R.jpg"
  },
  {
    category: "Motor",
    name: "Yamaha WR 155 R",
    platNomor: "BL 2023 MW",
    price: 160000,
    helmets: 1,
    transmission: "Manual",
    available: true,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/2020_Yamaha_WR_155_R_%28Indonesia%29_front_right_view.jpg/640px-2020_Yamaha_WR_155_R_%28Indonesia%29_front_right_view.jpg"
  },
  {
    category: "Motor",
    name: "Yamaha Jupiter Z1",
    platNomor: "BL 2024 MX",
    price: 80000,
    helmets: 1,
    transmission: "Manual",
    available: true,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Yamaha_Jupiter_Z1_Indonesia.jpg/640px-Yamaha_Jupiter_Z1_Indonesia.jpg"
  },
  {
    category: "Motor",
    name: "Suzuki Nex II",
    platNomor: "BL 2025 MY",
    price: 75000,
    helmets: 1,
    transmission: "Matic",
    available: true,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/2018_Suzuki_Nex_II_%28Indonesia%29_front_right_view.jpg/640px-2018_Suzuki_Nex_II_%28Indonesia%29_front_right_view.jpg"
  },
  {
    category: "Motor",
    name: "Suzuki Address FI",
    platNomor: "BL 2026 MZ",
    price: 80000,
    helmets: 2,
    transmission: "Matic",
    available: true,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Suzuki_Address_110_2015.jpg/640px-Suzuki_Address_110_2015.jpg"
  },
  {
    category: "Motor",
    name: "Suzuki Burgman Street 125EX",
    platNomor: "BL 2027 NA",
    price: 105000,
    helmets: 2,
    transmission: "Matic",
    available: true,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Suzuki_Burgman_Street_125.jpg/640px-Suzuki_Burgman_Street_125.jpg"
  },
  {
    category: "Motor",
    name: "Suzuki GSX-R150",
    platNomor: "BL 2028 NB",
    price: 165000,
    helmets: 1,
    transmission: "Manual",
    available: true,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/2017_Suzuki_GSX-R150_%28Indonesia%29_front_right_view.jpg/640px-2017_Suzuki_GSX-R150_%28Indonesia%29_front_right_view.jpg"
  },
  {
    category: "Motor",
    name: "Kawasaki KLX 150",
    platNomor: "BL 2029 NC",
    price: 155000,
    helmets: 1,
    transmission: "Manual",
    available: true,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Kawasaki_KLX_150BF.jpg/640px-Kawasaki_KLX_150BF.jpg"
  },
  {
    category: "Motor",
    name: "Vespa LX 125 i-Get",
    platNomor: "BL 2030 ND",
    price: 180000,
    helmets: 2,
    transmission: "Matic",
    available: true,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Vespa_LX_125_i-get.jpg/640px-Vespa_LX_125_i-get.jpg"
  },
];

const BIAYA_SUPIR_PER_HARI = 150000;
const PAGE_SIZE = 12;

let visibleLimit = PAGE_SIZE;
let activeVehicle = null;

const vehicleGrid = document.querySelector("#vehicleGrid");
const filterButtons = Array.from(document.querySelectorAll(".filter-chip"));
const searchInput = document.querySelector("#searchInput");
const categorySelect = document.querySelector("#categorySelect");
const sortSelect = document.querySelector("#sortSelect");
const onlyAvailableCheckbox = document.querySelector("#onlyAvailableCheckbox");
const resultsCount = document.querySelector("#resultsCount");
const emptyState = document.querySelector("#emptyState");
const loadMoreWrap = document.querySelector("#loadMoreWrap");
const loadMoreBtn = document.querySelector("#loadMoreBtn");
const fleetSection = document.querySelector("#armada");

const bookingDialog = document.querySelector("#bookingDialog");
const bookingForm = document.querySelector("#bookingForm");
const dialogCategoryBadge = document.querySelector("#dialogCategoryBadge");
const selectedCarName = document.querySelector("#selectedCarName");
const selectedCarPlat = document.querySelector("#selectedCarPlat");
const selectedCarPriceText = document.querySelector("#selectedCarPriceText");
const startDateInput = document.querySelector("#startDate");
const rentalDaysInput = document.querySelector("#rentalDays");
const driverOptionBox = document.querySelector("#driverOptionBox");
const withDriverCheckbox = document.querySelector("#withDriverCheckbox");
const motorPromoNote = document.querySelector("#motorPromoNote");
const promoDiscountInput = document.querySelector("#promoDiscount");
const estimateResult = document.querySelector("#estimateResult");
const toastNotification = document.querySelector("#toastNotification");

const rupiah = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

function createFallbackPreview(vehicle) {
  const fallback = document.createElement("div");
  fallback.className = "vehicle-fallback";

  const brandLabel = document.createElement("span");
  brandLabel.className = "vehicle-fallback__category";
  brandLabel.textContent = `${vehicle.category} · ${vehicle.platNomor}`;

  const title = document.createElement("strong");
  title.textContent = vehicle.name;

  const sub = document.createElement("small");
  sub.textContent = vehicle.category === "Mobil"
    ? `${vehicle.passengers} Penumpang · ${vehicle.withDriver ? "Dengan Supir" : "Lepas Kunci"}`
    : `${vehicle.transmission} · ${vehicle.helmets} Helm`;

  fallback.append(brandLabel, title, sub);
  return fallback;
}

function renderVehicleVisual(visualContainer, vehicle) {
  if (vehicle.image) {
    const img = document.createElement("img");
    img.src = vehicle.image;
    img.alt = `Foto ${vehicle.name}`;
    img.loading = "lazy";
    img.decoding = "async";
    img.addEventListener("error", () => {
      img.remove();
      visualContainer.prepend(createFallbackPreview(vehicle));
    }, { once: true });
    visualContainer.prepend(img);
  } else {
    visualContainer.prepend(createFallbackPreview(vehicle));
  }
}

function hitungBiayaSewa(vehicle, jumlahHari, denganSupir, diskonPromoPersen) {
  if (jumlahHari <= 0) return { normal: 0, final: 0, notes: [] };

  const notes = [];
  let total = vehicle.price * jumlahHari;

  if (vehicle.category === "Mobil" && denganSupir) {
    const biayaSupir = BIAYA_SUPIR_PER_HARI * jumlahHari;
    total += biayaSupir;
    notes.push(`Termasuk jasa supir (${rupiah.format(biayaSupir)})`);
  }

  if (vehicle.category === "Motor" && jumlahHari >= 7) {
    total *= 0.90;
    notes.push("Diskon otomatis motor ≥ 7 hari (10%)");
  }

  const normalAfterCategoryRule = total;

  if (diskonPromoPersen > 0 && diskonPromoPersen <= 100) {
    total = total - (total * (diskonPromoPersen / 100));
    notes.push(`Diskon promo tambahan (${diskonPromoPersen}%)`);
  }

  return {
    normal: normalAfterCategoryRule,
    final: total,
    notes,
  };
}

function showToast(message) {
  toastNotification.textContent = message;
  toastNotification.hidden = false;
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => {
    toastNotification.hidden = true;
  }, 3400);
}

function updateStats() {
  const totalMobil = fleetData.filter((v) => v.category === "Mobil").length;
  const totalMotor = fleetData.filter((v) => v.category === "Motor").length;
  const totalTersedia = fleetData.filter((v) => v.available).length;

  document.querySelector("#statTotalMobil").textContent = String(totalMobil);
  document.querySelector("#statTotalMotor").textContent = String(totalMotor);
  document.querySelector("#statTersedia").textContent = String(totalTersedia);
  document.querySelector("#headerAvailableBadge").textContent = `${totalTersedia} Unit Siap`;
}

function createVehicleCard(vehicle) {
  const card = document.createElement("article");
  card.className = `vehicle-card ${vehicle.available ? "" : "vehicle-card--rented"}`;

  const visual = document.createElement("div");
  visual.className = `vehicle-card__visual ${vehicle.category === "Mobil" ? "vehicle-card__visual--mobil" : "vehicle-card__visual--motor"}`;

  const tag = document.createElement("span");
  tag.className = `vehicle-tag ${vehicle.category === "Motor" ? "vehicle-tag--motor" : ""}`;
  tag.textContent = vehicle.category;

  const statusPill = document.createElement("span");
  statusPill.className = `status-pill ${vehicle.available ? "status-pill--available" : "status-pill--rented"}`;
  statusPill.textContent = vehicle.available ? "Tersedia" : "Sedang Disewa";

  const platBadge = document.createElement("span");
  platBadge.className = "plat-badge";
  platBadge.textContent = vehicle.platNomor;

  visual.append(tag, statusPill, platBadge);
  renderVehicleVisual(visual, vehicle);

  const content = document.createElement("div");
  content.className = "vehicle-card__content";

  const title = document.createElement("h3");
  title.textContent = vehicle.name;

  const specs = document.createElement("div");
  specs.className = "vehicle-specs";

  if (vehicle.category === "Mobil") {
    const cap = document.createElement("span");
    cap.className = "spec-chip";
    cap.textContent = `♙ ${vehicle.passengers} Penumpang`;

    const driver = document.createElement("span");
    driver.className = `spec-chip ${vehicle.withDriver ? "spec-chip--highlight" : ""}`;
    driver.textContent = vehicle.withDriver ? "★ Dengan Supir" : "Lepas Kunci";

    specs.append(cap, driver);
  } else {
    const trans = document.createElement("span");
    trans.className = "spec-chip";
    trans.textContent = `⚙ ${vehicle.transmission}`;

    const helm = document.createElement("span");
    helm.className = "spec-chip spec-chip--highlight";
    helm.textContent = `⛑ ${vehicle.helmets} Helm`;

    specs.append(trans, helm);
  }

  const footer = document.createElement("div");
  footer.className = "vehicle-card__footer";

  const price = document.createElement("p");
  price.className = "vehicle-price";
  const priceStrong = document.createElement("strong");
  priceStrong.textContent = rupiah.format(vehicle.price);
  const priceSpan = document.createElement("span");
  priceSpan.textContent = "per hari";
  price.append(priceStrong, priceSpan);

  footer.append(price);

  if (vehicle.available) {
    const rentBtn = document.createElement("button");
    rentBtn.type = "button";
    rentBtn.className = "button button--outline";
    rentBtn.textContent = "Hitung & Sewa ↗";
    rentBtn.addEventListener("click", () => openBookingDialog(vehicle));
    footer.append(rentBtn);
  } else {
    const returnBtn = document.createElement("button");
    returnBtn.type = "button";
    returnBtn.className = "button button--return";
    returnBtn.textContent = "Kembalikan Unit";
    returnBtn.addEventListener("click", () => {
      vehicle.available = true;
      showToast(`Pengembalian berhasil: ${vehicle.name} (${vehicle.platNomor}) kini tersedia.`);
      renderFleet();
    });
    footer.append(returnBtn);
  }

  content.append(title, specs, footer);
  card.append(visual, content);
  return card;
}

function getFilteredVehicles() {
  const query = searchInput.value.trim().toLocaleLowerCase("id");
  const category = categorySelect.value;
  const onlyAvailable = onlyAvailableCheckbox.checked;
  const sortBy = sortSelect.value;

  const filtered = fleetData.filter((v) => {
    const matchQuery =
      v.name.toLocaleLowerCase("id").includes(query) ||
      v.platNomor.toLocaleLowerCase("id").includes(query);
    const matchCategory = category === "all" || v.category === category;
    const matchStatus = !onlyAvailable || v.available;
    return matchQuery && matchCategory && matchStatus;
  });

  if (sortBy === "price-low") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortBy === "price-high") {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sortBy === "name-asc") {
    filtered.sort((a, b) => a.name.localeCompare(b.name, "id"));
  }

  return filtered;
}

function renderFleet() {
  const filtered = getFilteredVehicles();
  const sliced = filtered.slice(0, visibleLimit);

  vehicleGrid.replaceChildren(...sliced.map(createVehicleCard));
  resultsCount.textContent = `Menampilkan ${sliced.length} dari ${filtered.length} unit`;
  emptyState.hidden = filtered.length > 0;
  loadMoreWrap.hidden = sliced.length >= filtered.length;

  filterButtons.forEach((btn) => {
    const isActive = btn.dataset.filter === categorySelect.value;
    btn.classList.toggle("is-active", isActive);
    btn.setAttribute("aria-pressed", String(isActive));
  });

  updateStats();
}

function updateLiveEstimate() {
  if (!activeVehicle) return;

  const days = Math.max(1, Number(rentalDaysInput.value) || 1);
  const promo = Math.min(100, Math.max(0, Number(promoDiscountInput.value) || 0));
  const withDriver = activeVehicle.category === "Mobil" ? withDriverCheckbox.checked : false;

  if (activeVehicle.category === "Motor") {
    motorPromoNote.hidden = days < 7;
  } else {
    motorPromoNote.hidden = true;
  }

  const calc = hitungBiayaSewa(activeVehicle, days, withDriver, promo);
  const noteText = calc.notes.length > 0 ? calc.notes.join(" · ") : "Tarif reguler harian";

  estimateResult.innerHTML = `
    <div>Estimasi total untuk <strong>${days} hari</strong> (${noteText}):</div>
    <span class="total-amount">${rupiah.format(calc.final)}</span>
  `;
}

function openBookingDialog(vehicle) {
  activeVehicle = vehicle;
  dialogCategoryBadge.textContent = `SEWA ${vehicle.category.toUpperCase()}`;
  selectedCarName.textContent = vehicle.name;
  selectedCarPlat.textContent = vehicle.platNomor;
  selectedCarPriceText.textContent = `${rupiah.format(vehicle.price)} / hari`;

  rentalDaysInput.value = "3";
  promoDiscountInput.value = "0";

  if (vehicle.category === "Mobil") {
    driverOptionBox.hidden = false;
    withDriverCheckbox.checked = Boolean(vehicle.withDriver);
    motorPromoNote.hidden = true;
  } else {
    driverOptionBox.hidden = true;
    withDriverCheckbox.checked = false;
    motorPromoNote.hidden = true;
  }

  updateLiveEstimate();
  if (typeof bookingDialog.showModal === "function") {
    bookingDialog.showModal();
  }
}

document.querySelector("#searchForm").addEventListener("submit", (e) => {
  e.preventDefault();
  visibleLimit = PAGE_SIZE;
  renderFleet();
  fleetSection.scrollIntoView({ behavior: "smooth", block: "start" });
});

searchInput.addEventListener("input", () => {
  visibleLimit = PAGE_SIZE;
  renderFleet();
});

categorySelect.addEventListener("change", () => {
  visibleLimit = PAGE_SIZE;
  renderFleet();
});

sortSelect.addEventListener("change", renderFleet);
onlyAvailableCheckbox.addEventListener("change", () => {
  visibleLimit = PAGE_SIZE;
  renderFleet();
});

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    categorySelect.value = btn.dataset.filter;
    visibleLimit = PAGE_SIZE;
    renderFleet();
  });
});

loadMoreBtn.addEventListener("click", () => {
  visibleLimit += PAGE_SIZE;
  renderFleet();
});

rentalDaysInput.addEventListener("input", updateLiveEstimate);
withDriverCheckbox.addEventListener("change", updateLiveEstimate);
promoDiscountInput.addEventListener("input", updateLiveEstimate);

document.querySelector("#closeDialog").addEventListener("click", () => bookingDialog.close());
bookingDialog.addEventListener("click", (e) => {
  if (e.target === bookingDialog) bookingDialog.close();
});

bookingForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!activeVehicle) return;

  const days = Number(rentalDaysInput.value);
  const promo = Number(promoDiscountInput.value) || 0;
  const withDriver = activeVehicle.category === "Mobil" ? withDriverCheckbox.checked : false;

  if (!Number.isInteger(days) || days < 1 || days > 60) {
    rentalDaysInput.setCustomValidity("Lama sewa harus antara 1 sampai 60 hari.");
    rentalDaysInput.reportValidity();
    return;
  }
  rentalDaysInput.setCustomValidity("");

  const calc = hitungBiayaSewa(activeVehicle, days, withDriver, promo);
  activeVehicle.available = false;
  bookingDialog.close();
  renderFleet();
  showToast(`Sewa berhasil! ${activeVehicle.name} (${activeVehicle.platNomor}) - Total ${rupiah.format(calc.final)}`);
});

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
startDateInput.min = tomorrow.toISOString().split("T")[0];
startDateInput.value = startDateInput.min;

document.querySelector("#currentYear").textContent = String(new Date().getFullYear());
renderFleet();