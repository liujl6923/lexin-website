const products = [
  { model:"LX1001", category:"sofa", categoryName:"Sofa Legs", material:"Aluminum", spec:"D40*D39*H151-M8*35", price:1, image:"assets/products/lx1001.png" },
  { model:"LX1012", category:"sofa", categoryName:"Sofa Legs", material:"Aluminum", spec:"D52*H190-M8*25", price:1, image:"assets/products/lx1012.png" },
  { model:"LX2003", category:"sofa", categoryName:"Sofa Legs", material:"Aluminum", spec:"D35*110-170*M8*30", price:1, image:"assets/products/lx2003.png" },
  { model:"LX2013", category:"sofa", categoryName:"Sofa Legs", material:"Steel", spec:"D35*H110-M8*32", price:1, image:"assets/products/lx2013.png" },
  { model:"LX1107", category:"sofa", categoryName:"Sofa Legs", material:"Aluminum", spec:"D27*D78*H150", price:1, image:"assets/products/lx1107.png" },
  { model:"LX1801", category:"sofa", categoryName:"Sofa Legs", material:"Aluminum", spec:"L90*W75.8*H180", price:1, image:"assets/products/lx1801.png" },
  { model:"LX1812", category:"sofa", categoryName:"Sofa Legs", material:"Aluminum", spec:"L136*W89*H170", price:1, image:"assets/products/lx1812.png" },
  { model:"LX1814", category:"sofa", categoryName:"Sofa Legs", material:"Stainless steel 201", spec:"L106*W55*H120/320", price:1, image:"assets/products/lx1814.png" },
  { model:"LX1802-CA", category:"sofa", categoryName:"Sofa Legs", material:"Steel", spec:"L80*W90*H140/H260-D25", price:1, image:"assets/products/lx1802-ca.png" },
  { model:"LX1804", category:"sofa", categoryName:"Sofa Legs", material:"Steel", spec:"L60*W60*H180", price:1, image:"assets/products/lx1804.png" },
  { model:"LX3005", category:"sofa", categoryName:"Sofa Legs", material:"Aluminum", spec:"L140*W140*H150", price:1, image:"assets/products/lx3005.png" },
  { model:"LX3006", category:"sofa", categoryName:"Sofa Legs", material:"Aluminum", spec:"L89*W89*H196", price:1, image:"assets/products/lx3006.png" },
  { model:"LX9201", category:"bed", categoryName:"Bed Frames", material:"Steel", spec:"L930*W60*H115", price:1, image:"assets/products/bed/lx9201.jpg" },
  { model:"LX9512", category:"bed", categoryName:"Bed Frames", material:"Aluminum", spec:"L900*W90*H180", price:1, image:"assets/products/bed/lx9512.jpg" },
  { model:"LX9209", category:"bed", categoryName:"Bed Frames", material:"Steel", spec:"L866*W80*H140-T8", price:1, image:"assets/products/bed/lx9209.jpg" },
  { model:"LX9513", category:"bed", categoryName:"Bed Frames", material:"Aluminum", spec:"L920*W60*H140", price:1, image:"assets/products/bed/lx9513.jpg" },
  { model:"LX9210", category:"bed", categoryName:"Bed Frames", material:"Steel", spec:"L900*W100*H105", price:1, image:"assets/products/bed/lx9210.jpg" },
  { model:"LX9514", category:"bed", categoryName:"Bed Frames", material:"Aluminum", spec:"L860*W85*H160", price:1, image:"assets/products/bed/lx9514.jpg" },
  { model:"LXB488", category:"table", categoryName:"Table Legs", material:"Aluminum", spec:"H725", price:1, image:"assets/products/table/lxb488.jpg" },
  { model:"LXB499", category:"table", categoryName:"Table Legs", material:"Aluminum", spec:"H735", price:1, image:"assets/products/table/lxb499.jpg" },
  { model:"LX9401", category:"chair", categoryName:"Armchair Bases", material:"Steel", spec:"L740*H200", price:1, image:"assets/products/chair/lx9401.jpg" },
  { model:"LX9412", category:"chair", categoryName:"Armchair Bases", material:"Steel", spec:"L788*H200", price:1, image:"assets/products/chair/lx9412.jpg" },
  { model:"LXS045", category:"chair", categoryName:"Armchair Bases", material:"Steel", spec:"Customizable", price:1, image:"assets/products/chair/lxs045.jpg" },
  { model:"LXS008", category:"chair", categoryName:"Armchair Bases", material:"Steel", spec:"700*700*215", price:1, image:"assets/products/chair/lxs008.jpg" },
  { model:"LXS026", category:"chair", categoryName:"Armchair Bases", material:"Steel", spec:"D755*T250*H220", price:1, image:"assets/products/chair/lxs026.jpg" },
];

const categoryPages = { sofa:"sofa-legs.html", bed:"bed-frames.html", table:"table-legs.html", chair:"chair-bases.html", cabinet:"cabinet-handles.html" };
const inquiryStorageKey = "lexinInquiryList";

function readInquiryList() {
  try { return JSON.parse(localStorage.getItem(inquiryStorageKey)) || []; }
  catch { return []; }
}

function saveInquiryList(items) {
  localStorage.setItem(inquiryStorageKey, JSON.stringify(items));
  updateInquiryCount();
}

function updateInquiryCount() {
  const count = readInquiryList().reduce((total, item) => total + Number(item.quantity || 1), 0);
  document.querySelectorAll(".inquiry-count").forEach((item) => { item.textContent = count; });
}

function initUtilityNav() {
  const header = document.querySelector(".site-header");
  if (!header || header.querySelector(".site-tools")) return;
  const tools = document.createElement("nav");
  tools.className = "site-tools";
  tools.setAttribute("aria-label", "Account and inquiry");
  tools.innerHTML = '<a href="account.html">Log in</a><a href="inquiry.html">Inquiry <span class="inquiry-count">0</span></a>';
  header.append(tools);
  updateInquiryCount();
}

function initNavigation() {
  const nav = document.querySelector(".main-nav");
  const navToggle = document.querySelector(".nav-toggle");
  if (!nav) return;
  navToggle?.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(open));
  });
  const active = document.body.dataset.nav;
  if (active) document.querySelector(`.nav-item > a[href="${active}.html"]`)?.parentElement.classList.add("active");
}

function initSlider() {
  const slider = document.querySelector(".hero-slider");
  if (!slider) return;
  const slides = [...slider.querySelectorAll(".hero-slide")];
  const dots = [...slider.querySelectorAll(".slider-dots button")];
  let current = 0;
  let timer;
  let startX = 0;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const show = (index) => {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => { slide.classList.toggle("active", i === current); slide.setAttribute("aria-hidden", String(i !== current)); });
    dots.forEach((dot, i) => dot.classList.toggle("active", i === current));
  };
  const restart = () => { window.clearInterval(timer); if (!reducedMotion) timer = window.setInterval(() => show(current + 1), 6500); };
  slider.querySelector(".slider-prev")?.addEventListener("click", () => { show(current - 1); restart(); });
  slider.querySelector(".slider-next")?.addEventListener("click", () => { show(current + 1); restart(); });
  dots.forEach((dot) => dot.addEventListener("click", () => { show(Number(dot.dataset.slide)); restart(); }));
  slider.addEventListener("pointerdown", (event) => { startX = event.clientX; });
  slider.addEventListener("pointerup", (event) => { const delta = event.clientX - startX; if (Math.abs(delta) > 48) { show(current + (delta < 0 ? 1 : -1)); restart(); } });
  slider.addEventListener("keydown", (event) => { if (event.key === "ArrowLeft") show(current - 1); if (event.key === "ArrowRight") show(current + 1); });
  slider.addEventListener("mouseenter", () => window.clearInterval(timer));
  slider.addEventListener("mouseleave", restart);
  restart();
}

const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

function formatPrice(value) {
  return usdFormatter.format(Number(value));
}
function productCard(product) {
  return `<a class="product-card" href="product-detail.html?model=${encodeURIComponent(product.model)}">
    <img src="${product.image}" alt="${product.model} ${product.categoryName}" loading="lazy">
    <div class="product-card-body"><span class="material-tag">${product.material}</span><div class="product-title-row"><h3>${product.model}</h3><strong class="product-price">${formatPrice(product.price)}</strong></div><p>${product.spec}</p></div>
  </a>`;
}

function initCatalog() {
  const grid = document.querySelector("#productGrid");
  const category = document.body.dataset.category;
  if (!grid || !category) return;
  const visible = category === "all" ? products : products.filter((product) => product.category === category);
  if (category === "cabinet") { grid.innerHTML = ""; return; }
  grid.innerHTML = visible.length ? visible.map(productCard).join("") : '<p class="empty-state">No products are available in this category.</p>';
}

function initProductDetail() {
  const root = document.querySelector("#productDetail");
  if (!root) return;
  const model = new URLSearchParams(window.location.search).get("model") || "LX1001";
  const product = products.find((item) => item.model.toLowerCase() === model.toLowerCase()) || products[0];
  document.title = `${product.model} | ${product.categoryName} | LEXIN METAL`;
  document.querySelector("#detailImage").src = product.image;
  document.querySelector("#detailImage").alt = `${product.model} ${product.categoryName}`;
  document.querySelector("#detailModel").textContent = product.model;
  document.querySelector("#detailCategory").textContent = product.categoryName;
  document.querySelector("#detailMaterial").textContent = product.material;
  document.querySelector("#detailSpec").textContent = product.spec;
  document.querySelector("#detailPrice").textContent = formatPrice(product.price);
  document.querySelector("#detailBreadcrumb").textContent = product.model;
  document.querySelector("#detailCategoryLink").href = categoryPages[product.category];
  document.querySelector("#detailCategoryLink").textContent = product.categoryName;
  let selectedFinish = "Polished Chrome";
  const quantity = document.querySelector("#detailQuantity");
  document.querySelectorAll(".finish-swatch").forEach((button) => button.addEventListener("click", () => {
    document.querySelectorAll(".finish-swatch").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    selectedFinish = button.dataset.finish;
    document.querySelector("#selectedFinish").textContent = selectedFinish;
  }));
  document.querySelector("#quantityMinus")?.addEventListener("click", () => { quantity.value = Math.max(1, Number(quantity.value) - 1); });
  document.querySelector("#quantityPlus")?.addEventListener("click", () => { quantity.value = Math.max(1, Number(quantity.value) + 1); });
  document.querySelector("#addToInquiry")?.addEventListener("click", () => {
    const items = readInquiryList();
    const existing = items.find((item) => item.model === product.model && item.finish === selectedFinish);
    if (existing) existing.quantity += Math.max(1, Number(quantity.value));
    else items.push({ model: product.model, categoryName: product.categoryName, material: product.material, spec: product.spec, image: product.image, finish: selectedFinish, quantity: Math.max(1, Number(quantity.value)) });
    saveInquiryList(items);
    document.querySelector("#detailStatus").textContent = `${product.model} in ${selectedFinish} was added to your inquiry list.`;
  });
  const related = products.filter((item) => item.category === product.category && item.model !== product.model).slice(0,4);
  document.querySelector("#relatedProducts").innerHTML = related.map(productCard).join("");
}

function initInquiryPage() {
  const list = document.querySelector("#inquiryList");
  if (!list) return;
  const render = () => {
    const items = readInquiryList();
    list.innerHTML = items.length ? items.map((item, index) => `<article class="inquiry-item"><img src="${item.image}" alt="${item.model}"><div><h3>${item.model}</h3><p class="muted">${item.finish} / Qty ${item.quantity}</p><p class="muted">${item.spec}</p></div><button class="remove-item" type="button" data-remove="${index}">Remove</button></article>`).join("") : '<p class="empty-state">Your inquiry list is empty. Browse products and add configured models here.</p>';
    document.querySelector("#sendInquiryList")?.toggleAttribute("disabled", !items.length);
  };
  list.addEventListener("click", (event) => {
    const button = event.target.closest("[data-remove]");
    if (!button) return;
    const items = readInquiryList();
    items.splice(Number(button.dataset.remove), 1);
    saveInquiryList(items);
    render();
  });
  document.querySelector("#sendInquiryList")?.addEventListener("click", () => {
    const lines = readInquiryList().map((item) => `${item.model} | ${item.finish} | Qty ${item.quantity} | ${item.spec}`);
    window.location.href = `mailto:sales@lexinmetal.com?subject=${encodeURIComponent("LEXIN product inquiry")}&body=${encodeURIComponent(lines.join("\n"))}`;
  });
  render();
}

function initAccountPage() {
  const form = document.querySelector("#accountForm");
  if (!form) return;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    document.querySelector("#accountStatus").textContent = "Email verification will be connected when the account backend is enabled.";
  });
}

function initGallery() {
  const items = [...document.querySelectorAll(".gallery-item")];
  const dialog = document.querySelector("#galleryLightbox");
  const image = document.querySelector("#galleryLightboxImage");
  if (!items.length || !dialog || !image) return;
  let current = 0;
  const show = (index) => {
    current = (index + items.length) % items.length;
    const source = items[current].querySelector("img");
    image.src = source.src;
    image.alt = source.alt;
    if (!dialog.open) dialog.showModal();
  };
  items.forEach((item, index) => item.addEventListener("click", () => show(index)));
  dialog.querySelector(".lightbox-close").addEventListener("click", () => dialog.close());
  dialog.querySelector(".lightbox-prev").addEventListener("click", () => show(current - 1));
  dialog.querySelector(".lightbox-next").addEventListener("click", () => show(current + 1));
  dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") show(current - 1);
    if (event.key === "ArrowRight") show(current + 1);
  });
}
function initContactForm() {
  const form = document.querySelector("#inquiryForm");
  if (!form) return;
  const product = new URLSearchParams(window.location.search).get("product");
  if (product) form.elements.product.value = product;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const subject = `Website inquiry${data.get("product") ? ` - ${data.get("product")}` : ""}`;
    const body = [`Name: ${data.get("name")}`, `Email: ${data.get("email")}`, `Company: ${data.get("company") || ""}`, `Product: ${data.get("product") || ""}`, "", data.get("message")].join("\n");
    document.querySelector("#formStatus").textContent = "Opening your email application...";
    window.location.href = `mailto:sales@lexinmetal.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
}

initUtilityNav();
initNavigation();
initSlider();
initCatalog();
initProductDetail();
initInquiryPage();
initAccountPage();
initContactForm();
initGallery();
document.querySelectorAll("[data-year]").forEach((item) => { item.textContent = new Date().getFullYear(); });
