// ============================================================
// RodaRent — Halaman laporan keuangan
// Membaca data langsung dari API SQLite (server.mjs).
// ============================================================
const rupiah = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

const BULAN = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

const state = {
  dari: "",
  sampai: "",
  jenis: "all",
  q: "",
  page: 1,
  limit: 25,
  sort: "desc",
};

const els = {
  dariBulan: document.querySelector("#dariBulan"),
  sampaiBulan: document.querySelector("#sampaiBulan"),
  filterJenis: document.querySelector("#filterJenis"),
  filterCari: document.querySelector("#filterCari"),
  resetFilterBtn: document.querySelector("#resetFilterBtn"),
  sortTransaksi: document.querySelector("#sortTransaksi"),
  summary: document.querySelector("#reportSummary"),
  totalPemasukan: document.querySelector("#totalPemasukan"),
  totalPengeluaran: document.querySelector("#totalPengeluaran"),
  totalLaba: document.querySelector("#totalLaba"),
  totalTransaksi: document.querySelector("#totalTransaksi"),
  jumlahPemasukan: document.querySelector("#jumlahPemasukan"),
  jumlahPengeluaran: document.querySelector("#jumlahPengeluaran"),
  marginLaba: document.querySelector("#marginLaba"),
  periodeAktif: document.querySelector("#periodeAktif"),
  monthlyChart: document.querySelector("#monthlyChart"),
  monthlyTable: document.querySelector("#monthlyTable tbody"),
  breakdown: document.querySelector("#breakdownKategori"),
  transaksiBody: document.querySelector("#transaksiBody"),
  hasilTransaksi: document.querySelector("#hasilTransaksi"),
  emptyTransaksi: document.querySelector("#emptyTransaksi"),
  pageInfo: document.querySelector("#pageInfo"),
  prevPageBtn: document.querySelector("#prevPageBtn"),
  nextPageBtn: document.querySelector("#nextPageBtn"),
  exportBtn: document.querySelector("#exportBtn"),
  printBtn: document.querySelector("#printBtn"),
  openFormBtn: document.querySelector("#openFormBtn"),
  dbBadge: document.querySelector("#dbBadge"),
  dialog: document.querySelector("#transaksiDialog"),
  form: document.querySelector("#transaksiForm"),
  closeDialog: document.querySelector("#closeTransaksiDialog"),
  trxTanggal: document.querySelector("#trxTanggal"),
  trxJenis: document.querySelector("#trxJenis"),
  trxKategori: document.querySelector("#trxKategori"),
  trxKeterangan: document.querySelector("#trxKeterangan"),
  trxNominal: document.querySelector("#trxNominal"),
  trxKendaraan: document.querySelector("#trxKendaraan"),
  trxMetode: document.querySelector("#trxMetode"),
  trxPelanggan: document.querySelector("#trxPelanggan"),
  trxJumlahHari: document.querySelector("#trxJumlahHari"),
  trxCatatan: document.querySelector("#trxCatatan"),
  kategoriList: document.querySelector("#kategoriList"),
  trxError: document.querySelector("#trxError"),
  toast: document.querySelector("#toastNotification"),
};

let toastTimer = null;
function showToast(message) {
  els.toast.textContent = message;
  els.toast.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { els.toast.hidden = true; }, 3600);
}

function pad2(n) { return String(n).padStart(2, "0"); }

function lastDayOfMonth(ym) {
  const [y, m] = ym.split("-").map(Number);
  return `${ym}-${pad2(new Date(y, m, 0).getDate())}`;
}

function monthLabel(ym) {
  const [y, m] = ym.split("-");
  return `${BULAN[Number(m) - 1]} ${y.slice(2)}`;
}

function formatTanggal(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("id-ID", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

function buildParams(extra = {}) {
  const p = new URLSearchParams();
  if (state.dari) p.set("dari", `${state.dari}-01`);
  if (state.sampai) p.set("sampai", lastDayOfMonth(state.sampai));
  if (state.jenis !== "all") p.set("jenis", state.jenis);
  if (state.q) p.set("q", state.q);
  if (state.sort) p.set("sort", state.sort);
  for (const [k, v] of Object.entries(extra)) p.set(k, v);
  return p;
}

async function getJson(path, params) {
  const url = params ? `${path}?${params}` : path;
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`Gagal memuat ${path} (${res.status})`);
  return res.json();
}

function showApiError(message) {
  let box = document.querySelector(".report-alert");
  if (!box) {
    box = document.createElement("div");
    box.className = "report-alert";
    document.querySelector(".report-main").prepend(box);
  }
  box.innerHTML = `<strong>Laporan tidak dapat dimuat.</strong> ${message}
    <br>Jalankan <code>npm start</code> lalu buka <code>http://localhost:3000/laporan.html</code>.`;
}

function clearApiError() {
  document.querySelector(".report-alert")?.remove();
}

// ------------------------------------------------------------
// Render ringkasan
// ------------------------------------------------------------
function renderRingkasan(payload) {
  const r = payload.ringkasan || {};
  els.totalPemasukan.textContent = rupiah.format(r.pemasukan || 0);
  els.totalPengeluaran.textContent = rupiah.format(r.pengeluaran || 0);
  els.totalLaba.textContent = rupiah.format(r.laba_bersih || 0);
  els.totalTransaksi.textContent = String(r.jumlah_transaksi || 0);

  els.jumlahPemasukan.textContent = `${r.transaksi_pemasukan || 0} transaksi pemasukan`;
  els.jumlahPengeluaran.textContent = `${r.transaksi_pengeluaran || 0} transaksi pengeluaran`;
  els.marginLaba.textContent = `Margin ${r.margin || 0}% dari pemasukan`;

  const periode = state.dari || state.sampai
    ? `${state.dari ? monthLabel(state.dari) : "awal"} — ${state.sampai ? monthLabel(state.sampai) : "terbaru"}`
    : "Seluruh periode tercatat";
  els.periodeAktif.textContent = periode;

  els.totalLaba.style.color = (r.laba_bersih || 0) < 0 ? "#b23c2c" : "";
}

// ------------------------------------------------------------
// Render grafik bulanan
// ------------------------------------------------------------
function renderBulanan(rows) {
  els.monthlyChart.replaceChildren();
  els.monthlyTable.replaceChildren();

  if (!rows.length) {
    const kosong = document.createElement("p");
    kosong.className = "empty-state";
    kosong.textContent = "Belum ada transaksi pada periode ini.";
    els.monthlyChart.append(kosong);
    return;
  }

  const max = Math.max(...rows.map((r) => Math.max(r.pemasukan, r.pengeluaran)), 1);

  for (const row of rows) {
    const col = document.createElement("div");
    col.className = "chart-col";

    const bars = document.createElement("div");
    bars.className = "chart-bars";

    const income = document.createElement("div");
    income.className = "chart-bar chart-bar--income";
    income.style.height = `${Math.max(2, (row.pemasukan / max) * 100)}%`;
    income.title = `${monthLabel(row.bulan)} — Pemasukan: ${rupiah.format(row.pemasukan)}`;

    const expense = document.createElement("div");
    expense.className = "chart-bar chart-bar--expense";
    expense.style.height = `${Math.max(2, (row.pengeluaran / max) * 100)}%`;
    expense.title = `${monthLabel(row.bulan)} — Pengeluaran: ${rupiah.format(row.pengeluaran)}`;

    bars.append(income, expense);

    const label = document.createElement("span");
    label.className = "chart-label";
    label.textContent = monthLabel(row.bulan);

    col.append(bars, label);
    els.monthlyChart.append(col);

    const tr = document.createElement("tr");
    const labaClass = row.laba_bersih >= 0 ? "pos" : "neg";
    tr.innerHTML = `
      <td>${monthLabel(row.bulan)}</td>
      <td class="pos">${rupiah.format(row.pemasukan)}</td>
      <td class="neg">${rupiah.format(row.pengeluaran)}</td>
      <td class="${labaClass}">${rupiah.format(row.laba_bersih)}</td>
    `;
    els.monthlyTable.append(tr);
  }
}

// ------------------------------------------------------------
// Render rekap kategori
// ------------------------------------------------------------
function renderBreakdown(perKategori) {
  els.breakdown.replaceChildren();

  const groups = [
    { jenis: "pemasukan", title: "Sumber pemasukan", cls: "" },
    { jenis: "pengeluaran", title: "Pos pengeluaran", cls: "breakdown-fill--expense" },
  ];

  for (const group of groups) {
    const items = perKategori
      .filter((k) => k.jenis === group.jenis)
      .sort((a, b) => b.total - a.total);

    const wrap = document.createElement("div");
    wrap.className = "breakdown-group";

    const total = items.reduce((sum, i) => sum + i.total, 0);
    const head = document.createElement("h3");
    head.innerHTML = `${group.title} <span>${rupiah.format(total)}</span>`;
    wrap.append(head);

    if (!items.length) {
      const kosong = document.createElement("p");
      kosong.className = "breakdown-empty";
      kosong.textContent = "Tidak ada data.";
      wrap.append(kosong);
    }

    for (const item of items) {
      const porsi = total ? (item.total / total) * 100 : 0;

      const row = document.createElement("div");
      row.className = "breakdown-item";

      const top = document.createElement("div");
      top.className = "breakdown-item__top";
      const name = document.createElement("strong");
      name.textContent = item.kategori;
      const value = document.createElement("span");
      value.textContent = `${rupiah.format(item.total)} · ${porsi.toFixed(1)}%`;
      top.append(name, value);

      const track = document.createElement("div");
      track.className = "breakdown-track";
      const fill = document.createElement("div");
      fill.className = `breakdown-fill ${group.cls}`;
      fill.style.width = `${Math.max(1.5, porsi)}%`;
      track.append(fill);

      row.append(top, track);
      wrap.append(row);
    }

    els.breakdown.append(wrap);
  }
}

// ------------------------------------------------------------
// Render tabel transaksi
// ------------------------------------------------------------
function renderTransaksi(payload) {
  els.transaksiBody.replaceChildren();
  const rows = payload.data || [];

  els.hasilTransaksi.textContent = payload.total
    ? `Menampilkan ${payload.offset + 1}–${payload.offset + rows.length} dari ${payload.total} transaksi`
    : "Tidak ada transaksi";

  els.emptyTransaksi.hidden = rows.length > 0;

  for (const r of rows) {
    const tr = document.createElement("tr");

    const tdTanggal = document.createElement("td");
    tdTanggal.className = "trx-date";
    tdTanggal.textContent = formatTanggal(r.tanggal);

    const tdJenis = document.createElement("td");
    const pill = document.createElement("span");
    pill.className = `jenis-pill jenis-pill--${r.jenis}`;
    pill.textContent = r.jenis === "pemasukan" ? "Masuk" : "Keluar";
    tdJenis.append(pill);

    const tdKategori = document.createElement("td");
    tdKategori.textContent = r.kategori;

    const tdKet = document.createElement("td");
    tdKet.className = "trx-desc";
    const strong = document.createElement("strong");
    strong.textContent = r.keterangan;
    tdKet.append(strong);
    if (r.plat_nomor) {
      const plat = document.createElement("span");
      plat.className = "trx-plat";
      plat.textContent = r.plat_nomor;
      tdKet.append(plat);
    }
    if (r.catatan) {
      const small = document.createElement("small");
      small.textContent = ` — ${r.catatan}`;
      tdKet.append(small);
    }

    const tdPelanggan = document.createElement("td");
    tdPelanggan.textContent = r.pelanggan || "—";

    const tdMetode = document.createElement("td");
    tdMetode.textContent = r.metode_bayar;

    const tdNominal = document.createElement("td");
    tdNominal.className = `text-right trx-amount ${r.jenis === "pemasukan" ? "trx-amount--income" : "trx-amount--expense"}`;
    tdNominal.textContent = `${r.jenis === "pemasukan" ? "+" : "−"} ${rupiah.format(r.nominal)}`;

    const tdAksi = document.createElement("td");
    const del = document.createElement("button");
    del.type = "button";
    del.className = "trx-delete";
    del.title = "Hapus transaksi";
    del.setAttribute("aria-label", `Hapus transaksi ${r.keterangan}`);
    del.textContent = "×";
    del.addEventListener("click", () => hapusTransaksi(r));
    tdAksi.append(del);

    tr.append(tdTanggal, tdJenis, tdKategori, tdKet, tdPelanggan, tdMetode, tdNominal, tdAksi);
    els.transaksiBody.append(tr);
  }

  const pages = Math.max(1, Math.ceil(payload.total / payload.limit));
  const current = Math.floor(payload.offset / payload.limit) + 1;
  els.pageInfo.textContent = `Halaman ${current} dari ${pages}`;
  els.prevPageBtn.disabled = current <= 1;
  els.nextPageBtn.disabled = current >= pages;
}

// ------------------------------------------------------------
// Muat semua data
// ------------------------------------------------------------
async function loadLaporan() {
  const params = buildParams({ limit: state.limit, offset: (state.page - 1) * state.limit });

  try {
    const [ringkasan, bulanan, transaksi] = await Promise.all([
      getJson("/api/laporan/ringkasan", buildParams()),
      getJson("/api/laporan/bulanan", buildParams()),
      getJson("/api/transaksi", params),
    ]);

    clearApiError();
    renderRingkasan(ringkasan);
    renderBulanan(bulanan);
    renderBreakdown(ringkasan.perKategori || []);
    renderTransaksi(transaksi);

    els.dbBadge.textContent = `SQLite · ${ringkasan.ringkasan.jumlah_transaksi} trx`;
  } catch (err) {
    console.error(err);
    showApiError(err.message);
    els.totalPemasukan.textContent = "—";
    els.totalPengeluaran.textContent = "—";
    els.totalLaba.textContent = "—";
    els.totalTransaksi.textContent = "—";
  }
}

async function hapusTransaksi(row) {
  const yakin = confirm(`Hapus transaksi "${row.keterangan}" sebesar ${rupiah.format(row.nominal)}?`);
  if (!yakin) return;
  try {
    const res = await fetch(`/api/transaksi/${row.id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Gagal menghapus transaksi.");
    showToast("Transaksi berhasil dihapus.");
    await loadLaporan();
  } catch (err) {
    showToast(err.message);
  }
}

// ------------------------------------------------------------
// Form tambah transaksi
// ------------------------------------------------------------
async function siapkanForm() {
  els.trxTanggal.value = new Date().toISOString().slice(0, 10);

  try {
    const [kendaraan, kategori] = await Promise.all([
      getJson("/api/kendaraan"),
      getJson("/api/laporan/kategori"),
    ]);

    const grouped = { Mobil: [], Motor: [] };
    for (const k of kendaraan) grouped[k.kategori]?.push(k);

    for (const [kategoriName, list] of Object.entries(grouped)) {
      if (!list.length) continue;
      const optgroup = document.createElement("optgroup");
      optgroup.label = kategoriName;
      for (const k of list) {
        const opt = document.createElement("option");
        opt.value = k.id;
        opt.textContent = `${k.nama} — ${k.plat_nomor}`;
        optgroup.append(opt);
      }
      els.trxKendaraan.append(optgroup);
    }

    const semua = [...new Set([...kategori.pemasukan, ...kategori.pengeluaran])].sort();
    els.kategoriList.replaceChildren(
      ...semua.map((k) => {
        const opt = document.createElement("option");
        opt.value = k;
        return opt;
      }),
    );
  } catch (err) {
    console.error(err);
  }
}

function bukaDialog() {
  els.trxError.hidden = true;
  els.form.reset();
  els.trxTanggal.value = new Date().toISOString().slice(0, 10);
  els.trxJenis.value = "pemasukan";
  els.dialog.showModal();
}

els.form.addEventListener("submit", async (e) => {
  e.preventDefault();
  els.trxError.hidden = true;

  const payload = {
    tanggal: els.trxTanggal.value,
    jenis: els.trxJenis.value,
    kategori: els.trxKategori.value.trim(),
    keterangan: els.trxKeterangan.value.trim(),
    nominal: Number(els.trxNominal.value),
    kendaraan_id: els.trxKendaraan.value ? Number(els.trxKendaraan.value) : null,
    metode_bayar: els.trxMetode.value,
    pelanggan: els.trxPelanggan.value.trim() || null,
    jumlah_hari: els.trxJumlahHari.value ? Number(els.trxJumlahHari.value) : null,
    catatan: els.trxCatatan.value.trim() || null,
  };

  try {
    const res = await fetch("/api/transaksi", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const body = await res.json();
    if (!res.ok) throw new Error(body.error || "Gagal menyimpan transaksi.");

    els.dialog.close();
    state.page = 1;
    showToast(`Transaksi tersimpan: ${payload.keterangan} (${rupiah.format(payload.nominal)}).`);
    await loadLaporan();
  } catch (err) {
    els.trxError.textContent = err.message;
    els.trxError.hidden = false;
  }
});

// ------------------------------------------------------------
// Event filter
// ------------------------------------------------------------
els.dariBulan.addEventListener("change", () => {
  state.dari = els.dariBulan.value;
  state.page = 1;
  loadLaporan();
});

els.sampaiBulan.addEventListener("change", () => {
  state.sampai = els.sampaiBulan.value;
  state.page = 1;
  loadLaporan();
});

els.filterJenis.addEventListener("change", () => {
  state.jenis = els.filterJenis.value;
  state.page = 1;
  loadLaporan();
});

let searchTimer = null;
els.filterCari.addEventListener("input", () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    state.q = els.filterCari.value.trim();
    state.page = 1;
    loadLaporan();
  }, 320);
});

els.sortTransaksi.addEventListener("change", () => {
  state.sort = els.sortTransaksi.value;
  state.page = 1;
  loadLaporan();
});

els.resetFilterBtn.addEventListener("click", () => {
  state.dari = "";
  state.sampai = "";
  state.jenis = "all";
  state.q = "";
  state.page = 1;
  state.sort = "desc";
  els.dariBulan.value = "";
  els.sampaiBulan.value = "";
  els.filterJenis.value = "all";
  els.filterCari.value = "";
  els.sortTransaksi.value = "desc";
  loadLaporan();
});

els.prevPageBtn.addEventListener("click", () => {
  if (state.page > 1) {
    state.page -= 1;
    loadLaporan();
    document.querySelector(".panel--table")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
});

els.nextPageBtn.addEventListener("click", () => {
  state.page += 1;
  loadLaporan();
  document.querySelector(".panel--table")?.scrollIntoView({ behavior: "smooth", block: "start" });
});

els.exportBtn.addEventListener("click", () => {
  window.location.href = `/api/laporan/export.csv?${buildParams()}`;
});

els.printBtn.addEventListener("click", () => window.print());
els.openFormBtn.addEventListener("click", bukaDialog);
els.closeDialog.addEventListener("click", () => els.dialog.close());
els.dialog.addEventListener("click", (e) => {
  if (e.target === els.dialog) els.dialog.close();
});

document.querySelector("#currentYear").textContent = String(new Date().getFullYear());

loadLaporan();
siapkanForm();
