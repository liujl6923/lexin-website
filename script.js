const products = Array.isArray(window.allCatalogProducts)
  ? window.allCatalogProducts.map((product) => ({
      ...product,
      category: "all",
      categoryName: "All Products",
      spec: product.size ?? product.spec ?? "",
      price: 1,
      catalogOnly: true,
    }))
  : [];

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
  return `<article class="product-card product-card-static">
    <img src="${product.image}" alt="${product.model} ${product.categoryName}" loading="lazy">
    <div class="product-card-body"><span class="material-tag">${product.material}</span><div class="product-title-row"><h3>${product.model}</h3><strong class="product-price">${formatPrice(product.price)}</strong></div><p>${product.spec}</p></div>
  </article>`;
}

function initCatalog() {
  const grid = document.querySelector("#productGrid");
  const category = document.body.dataset.category;
  if (!grid || !category) return;
  const visible = category === "all" ? products : [];
  grid.innerHTML = visible.map(productCard).join("");
}

function initProductDetail() {
  const root = document.querySelector("#productDetail");
  if (!root) return;
  const model = new URLSearchParams(window.location.search).get("model") || "LX1001";
  const product = products.find((item) => item.model.toLowerCase() === model.toLowerCase()) || products[0];
  if (!product) { root.innerHTML = ""; return; }
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

function initInspirationGallery() {
  const gallery = document.querySelector("#inspirationGallery");
  const pagination = document.querySelector("#inspirationPagination");
  const dialog = document.querySelector("#inspirationLightbox");
  const dialogImage = document.querySelector("#inspirationLightboxImage");
  const dialogNumber = document.querySelector("#inspirationLightboxNumber");
  if (!gallery || !pagination || !dialog || !dialogImage || !dialogNumber) return;

  const total = Number.parseInt(gallery.dataset.total, 10);
  const pageSize = Number.parseInt(gallery.dataset.pageSize, 10);
  const totalPages = Math.ceil(total / pageSize);
  const requestedPage = Number.parseInt(new URLSearchParams(window.location.search).get("page") || "1", 10);
  const currentPage = Number.isInteger(requestedPage) ? Math.min(Math.max(requestedPage, 1), totalPages) : 1;
  const start = ((currentPage - 1) * pageSize) + 1;
  const end = Math.min(start + pageSize - 1, total);
  const fragment = document.createDocumentFragment();

  for (let number = start; number <= end; number += 1) {
    const label = String(number).padStart(3, "0");
    const card = document.createElement("button");
    card.className = "inspiration-card";
    card.type = "button";
    card.dataset.number = label;
    card.setAttribute("aria-label", `Enlarge inspiration image ${label}`);
    card.innerHTML = `<span class="image-number">${label}</span><img src="assets/images/inspiration/inspiration-${label}.jpg" loading="lazy" decoding="async" alt="Furniture inspiration with metal base">`;
    card.addEventListener("click", () => {
      const source = card.querySelector("img");
      dialogImage.src = source.src;
      dialogImage.alt = source.alt;
      dialogNumber.textContent = label;
      dialog.showModal();
    });
    fragment.appendChild(card);
  }
  gallery.appendChild(fragment);

  const pageHref = (page) => page === 1 ? "gallery.html#inspirationGallery" : `gallery.html?page=${page}#inspirationGallery`;
  const addPageLink = (label, page, disabled = false) => {
    if (disabled) {
      const span = document.createElement("span");
      span.className = "inspiration-page-link disabled";
      span.textContent = label;
      pagination.appendChild(span);
      return;
    }
    const link = document.createElement("a");
    link.className = "inspiration-page-link";
    link.href = pageHref(page);
    link.textContent = label;
    if (page === currentPage && Number.isInteger(label)) link.setAttribute("aria-current", "page");
    pagination.appendChild(link);
  };

  addPageLink("Previous", currentPage - 1, currentPage === 1);
  for (let page = 1; page <= totalPages; page += 1) addPageLink(page, page);
  addPageLink("Next", currentPage + 1, currentPage === totalPages);

  dialog.querySelector(".inspiration-lightbox-close").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
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
initInspirationGallery();
document.querySelectorAll("[data-year]").forEach((item) => { item.textContent = new Date().getFullYear(); });
