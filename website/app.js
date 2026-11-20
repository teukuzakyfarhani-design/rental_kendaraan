// Data master armada dimuat dari fleet-data.js (window.FLEET_DATA)
// agar konsisten dengan database SQLite (rental.db).
const fleetData = window.FLEET_DATA || [];
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
const customerNameInput = document.querySelector("#customerName");
const paymentRadios = Array.from(document.querySelectorAll('input[name="paymentMethod"]'));
const bankField = document.querySelector("#bankField");
const bankSelect = document.querySelector("#bankSelect");
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
    img.className = "vehicle-card__photo";
    img.src = vehicle.image;
    img.alt = `Foto ${vehicle.name} full body`;
    img.loading = "lazy";
    img.decoding = "async";
    img.addEventListener("error", () => {
      img.remove();
      visualContainer.classList.remove("vehicle-card__visual--photo");
      visualContainer.prepend(createFallbackPreview(vehicle));
    }, { once: true });
    visualContainer.classList.add("vehicle-card__visual--photo");
    visualContainer.prepend(img);
  } else {
    visualContainer.prepend(createFallbackPreview(vehicle));
  }

  const credit = (window.FLEET_IMAGE_SOURCES || {})[vehicle.platNomor];
  if (credit) {
    const link = document.createElement("a");
    link.className = "vehicle-photo-credit";
    link.href = credit.source;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "Foto: Wikimedia Commons";
    link.title = credit.license ? `${credit.title} · ${credit.license}` : credit.title;
    visualContainer.append(link);
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

function isTransferSelected() {
  return paymentRadios.some((radio) => radio.value === "transfer" && radio.checked);
}

function syncPaymentFields() {
  bankField.hidden = !isTransferSelected();
}

function getMetodeBayar() {
  return isTransferSelected() ? `Transfer ${bankSelect.value}` : "Tunai";
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
    <div class="estimate-method">Pembayaran: <strong>${getMetodeBayar()}</strong>${isTransferSelected() ? " · transfer sebelum pengambilan unit" : " · bayar saat pengambilan unit"}</div>
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
  customerNameInput.value = "";

  const transferRadio = paymentRadios.find((radio) => radio.value === "transfer");
  if (transferRadio) transferRadio.checked = true;
  bankSelect.value = "BCA";
  syncPaymentFields();

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
  customerNameInput.focus();
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
paymentRadios.forEach((radio) => radio.addEventListener("change", () => {
  syncPaymentFields();
  updateLiveEstimate();
}));
bankSelect.addEventListener("change", updateLiveEstimate);

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
  const customerName = customerNameInput.value.trim();

  if (!Number.isInteger(days) || days < 1 || days > 60) {
    rentalDaysInput.setCustomValidity("Lama sewa harus antara 1 sampai 60 hari.");
    rentalDaysInput.reportValidity();
    return;
  }
  rentalDaysInput.setCustomValidity("");

  if (!customerName) {
    customerNameInput.setCustomValidity("Nama pelanggan wajib diisi.");
    customerNameInput.reportValidity();
    return;
  }
  customerNameInput.setCustomValidity("");

  const metodeBayar = getMetodeBayar();
  const calc = hitungBiayaSewa(activeVehicle, days, withDriver, promo);
  const bookedVehicle = activeVehicle;
  const catatan = calc.notes.join(" · ") || "Tarif reguler harian";

  bookedVehicle.available = false;
  bookingDialog.close();
  renderFleet();
  showToast(`Sewa berhasil! ${bookedVehicle.name} (${bookedVehicle.platNomor}) untuk ${customerName} - Total ${rupiah.format(calc.final)} via ${metodeBayar}`);

  // Simpan otomatis ke buku kas SQLite (jika diakses lewat server).
  if (location.protocol.startsWith("http")) {
    fetch("/api/transaksi", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tanggal: startDateInput.value,
        jenis: "pemasukan",
        kategori: `Sewa ${bookedVehicle.category}`,
        keterangan: `Sewa ${bookedVehicle.name} (${bookedVehicle.platNomor}) ${days} hari`,
        plat_nomor: bookedVehicle.platNomor,
        pelanggan: customerName,
        jumlah_hari: days,
        metode_bayar: metodeBayar,
        nominal: Math.round(calc.final),
        catatan,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("gagal");
        showToast(`Sewa tercatat di laporan keuangan: ${rupiah.format(calc.final)}.`);
      })
      .catch(() => {
        /* Mode file:// atau server mati — transaksi tetap berjalan di sisi klien. */
      });
  }
});

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
startDateInput.min = tomorrow.toISOString().split("T")[0];
startDateInput.value = startDateInput.min;

document.querySelector("#currentYear").textContent = String(new Date().getFullYear());
renderFleet();