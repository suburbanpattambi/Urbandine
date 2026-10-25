/* ==========================================================================
   UrbanDine — main.js
   GSAP + ScrollTrigger + Lenis (synced through the GSAP ticker)
   ========================================================================== */

/* If a CDN is blocked, don't leave the visitor staring at the preloader. */
if (!window.gsap || !window.ScrollTrigger) {
  document.querySelector(".pre")?.remove();
  document.documentElement.classList.add("no-gsap");
  throw new Error("UrbanDine: GSAP / ScrollTrigger failed to load. Check the <script> tags in index.html.");
}

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

const $  = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer  = matchMedia("(hover: hover) and (pointer: fine)").matches;

/* --------------------------------------------------------------------------
   0. EDITABLE CONTENT
   price: null shows "Ask us". Edit these lists to match your real menu.
   -------------------------------------------------------------------------- */
const WHATSAPP = "918111807554";

/* IMAGES: paste your own paths or full URLs here (CDN, Cloudinary, Imgur, etc.).
   Any key left as-is keeps the default path written in index.html. */
const IMAGES = {
  "hero": "assets/hero.jpg",
  "platter-1": "assets/platter-1.jpg", "platter-2": "assets/platter-2.jpg",
  "platter-3": "assets/platter-3.jpg", "platter-4": "assets/platter-4.jpg",
  "about": "assets/about.jpg",
  "feature-1": "assets/feature-1.jpg", "feature-2": "assets/feature-2.jpg",
  "feature-3": "assets/feature-3.jpg", "feature-4": "assets/feature-4.jpg",
  "gallery-1": "assets/gallery-1.jpg", "gallery-2": "assets/gallery-2.jpg",
  "gallery-3": "assets/gallery-3.jpg", "gallery-4": "assets/gallery-4.jpg",
  "gallery-5": "assets/gallery-5.jpg", "gallery-6": "assets/gallery-6.jpg",
  "gallery-7": "assets/gallery-7.jpg", "gallery-8": "assets/gallery-8.jpg"
};
$$("img[src^='assets/']").forEach((img) => {
  const key = img.getAttribute("src").replace(/^assets\//, "").replace(/\.\w+$/, "");
  if (IMAGES[key] && IMAGES[key] !== img.getAttribute("src")) img.src = IMAGES[key];
});

const Q3 = (q, h, f) => [{ size: "Quarter", price: q }, { size: "Half", price: h }, { size: "Full", price: f }];
const H2 = (h, f) => [{ size: "Half", price: h }, { size: "Full", price: f }];

/* options: [{size, price}] for portions, or price: n for a single price. price null = "Ask us". */
const MENU = {
  alfaham: [
    { tag: "Classic Recipe",     name: "Classic Alfaham",          options: Q3(150, 300, 580), desc: "Traditional Arabian spice blend of cardamom, coriander, lemon juice, yogurt, and live wood smoke." },
    { tag: "Spicy Craving",      name: "Peri-Peri Alfaham",        options: Q3(170, 340, 650), desc: "Drenched in crushed African bird's eye chili, smoked garlic, tangy lime, and roasted over slow embers." },
    { tag: "Indo-Arabian",       name: "Shezwan Alfaham",          options: Q3(170, 340, 650), desc: "Wok-tossed schezwan peppercorn glaze, red chilies, crushed ginger, char-grilled for bold umami notes." },
    { tag: "Sweet & Tangy",      name: "Honey Chilly Alfaham",     options: Q3(190, 380, 720), desc: "Wild forest honey glaze tempered with roasted crushed chili flakes and sesame notes, finished on red hot coals." },
    { tag: "Ultra Fiery",        name: "Daynamit Alfaham",         options: Q3(200, 400, 760), desc: "Explosive red marinade infused with smoked habanero essence, garlic oil, and zesty paprika flakes." },
    { tag: "Traditional Kerala", name: "Pollicha Alfaham",         options: Q3(190, 380, 740), desc: "Char-grilled chicken wrapped in seasoned tender plantain leaf with caramelized onion gravy and Malabar spices." },
    { tag: "Country Style",      name: "Jellikett Alfaham",        options: Q3(190, 380, 740), desc: "Spicy country-style marinade with whole red chilies, crushed shallots, and fragrant coconut oil finish." },
    { tag: "Country Style",      name: "Beef Jellikett Alfaham",   price: 250, desc: "Tender beef rubbed in the same fiery country-style marinade, with whole red chilies and shallots, charred over live coals." },
    { tag: "Wayanad Pepper",     name: "Pepper Alfaham",           price: 190, desc: "Crushed high-altitude Wayanad black peppercorns, curry leaf oil, roasted cumin, and robust smoke." },
    { tag: "Smoky Tang",         name: "Mexican Alfaham",          price: 210, desc: "Smoked chipotle peppers, crushed roasted cumin, oregano, and crushed sun-dried tomato basting." },
    { tag: "Chef Special",       name: "Cheez Alfaham",            price: 190, desc: "Classic Arabian spiced charcoal chicken generously draped with melted artisan cheese and roasted spices." },
    { tag: "Top Bestseller",     name: "Cheez Cream Alfaham",      price: 220, desc: "Marinated in melted mozzarella, Arabian cream curd, mild green peppercorns, and charcoal-caramelized to golden crust perfection." },
    { tag: "Rich & Mild",        name: "Malai Alfaham",            price: 220, desc: "Cashew paste, cardamom, fresh dairy cream, and white pepper marinade yielding unmatched tenderness." },
    { tag: "Signature Fusion",   name: "Peri-Peri Pollicha Alfaham", price: 210, desc: "Charcoal-roasted bird's eye peri-peri chicken, enveloped in roasted shallots and wrapped inside fresh charred banana leaves." },
    { tag: "New",                name: "Honey Mustard Alfaham",    price: 220, desc: "Charcoal-grilled chicken glazed with sweet wild honey and sharp whole-grain mustard for a golden, tangy finish." },
    { tag: "Alfaham",            name: "Dragon Alfaham",           price: 220, desc: "Fiery dragon-chili glaze with roasted garlic and ginger, flame-grilled until blistered, smoky and bold." },
    { tag: "Alfaham",            name: "Bang-Bang Alfaham",        price: 210, desc: "Creamy, sweet-heat bang-bang sauce over smoky charcoal chicken, with a crisp, caramelised edge." },
    { tag: "Add-on",             name: "Mandhi Chicken Piece",     price: 130, desc: "An extra piece of slow-pit Mandhi chicken, fall-off-the-bone tender and rich with smoky spice." }
  ],
  mandhi: [
    { tag: "Pit Classic",    name: "Chicken Mandhi",             options: Q3(190, 380, 740), desc: "Slow-cooked in our traditional pit, sealed until every grain of rice carries the flavour." },
    { tag: "House Favorite", name: "Alfaham Mandhi",             options: Q3(210, 420, 800), desc: "The best of fire and the feast: charcoal Alfaham resting on fragrant Yemeni-style rice." },
    { tag: "Fire & Spice",   name: "Peri-Peri Alfaham Mandhi",   options: Q3(230, 460, 880), desc: "Fiery peri-peri charcoal Alfaham served over fragrant Yemeni-style Mandhi rice, smoky and bold." },
    { tag: "Indo-Arabian",   name: "Shezwan Alfaham Mandhi",     options: Q3(230, 460, 880), desc: "Wok-glazed schezwan Alfaham with red chilies and ginger, laid over aromatic, slow-cooked Mandhi rice." },
    { tag: "Country Style",  name: "Jellikett Mandhi",           options: Q3(240, 480, 940), desc: "Country-style spiced chicken with whole red chilies and shallots, resting on smoky pit-cooked Mandhi rice." },
    { tag: "Mandhi Combo",   name: "Peri-Peri Pollicha Mandhi",  price: 260, desc: "Peri-peri chicken wrapped in banana leaf and charred over embers, served on aromatic Mandhi rice." },
    { tag: "Mandhi Combo",   name: "Normal Pollicha Mandhi",     price: 240, desc: "Mildly spiced chicken wrapped in banana leaf and slow-roasted, served over fragrant pit-cooked Mandhi rice." },
    { tag: "Mandhi Combo",   name: "Pepper Alfaham Mandhi",      price: 240, desc: "Wayanad black pepper Alfaham with curry leaf and roasted cumin, served on warm, aromatic Mandhi rice." },
    { tag: "Mandhi Combo",   name: "Honey Chilly Mandhi",        price: 240, desc: "Sweet honey-chilli glazed Alfaham with sesame, served over smoky, fragrant Mandhi rice." },
    { tag: "Beef Special",   name: "Beef Jellikett Mandhi",      price: 280, desc: "Slow-roasted beef in a fiery country-style marinade, piled on smoky pit-cooked Mandhi rice." },
    { tag: "Beef Special",   name: "Beef Rib Mandhi",            price: 300, desc: "Meaty beef ribs cooked low and slow until tender, served on fragrant Yemeni-style Mandhi rice." }
  ],
  specials: [
    { tag: "Rice",          name: "Zurbian Rice (portion)",   price: 120, desc: "Fragrant basmati rice slow-cooked with whole spices in the traditional Zurbian style." },
    { tag: "Rice",          name: "Mandhi Rice (portion)",    price: 110, desc: "Long-grain Mandhi rice infused with smoky pit aromas and whole Arabian spices." },
    { tag: "Rice",          name: "Ghee Rice",                options: H2(80, 100), desc: "Fluffy rice tossed in pure ghee with fried onions and whole spices, rich, aromatic and comforting." },
    { tag: "Rice",          name: "Biriyani Rice",            options: H2(80, 100), desc: "Fragrant biriyani-style rice layered with whole spices, fried onions and fresh herbs." },
    { tag: "Zurbian",       name: "Zurbian Beef",             price: 250, desc: "Tender beef simmered with whole spices and layered with aromatic basmati rice, slow-cooked in the Zurbian style." },
    { tag: "Zurbian",       name: "Zurbian Chicken",          price: 230, desc: "Juicy chicken cooked with fragrant basmati rice and Arabian whole spices, rich and perfectly balanced." },
    { tag: "Beef",          name: "Beef Ribs",                options: [{ size: "Pepper", price: null }, { size: "Peri-Peri", price: null }, { size: "Normal", price: null }], desc: "Succulent beef ribs slow-cooked until tender and finished in your choice of Pepper, Peri-Peri or Normal masala." },
    { tag: "Biriyani",      name: "Chicken Dum Biriyani",     options: H2(120, 160), desc: "Chicken and aromatic basmati rice sealed and slow-cooked on dum, layered with saffron, mint and fried onions." },
    { tag: "Kerala",        name: "Nadan Chicken Curry & Roast", price: 190, desc: "Kerala-style chicken curry and spicy pepper roast, made with coconut oil, curry leaves and Malabar spices." },
    { tag: "Veg",           name: "Veg Kuruma",               price: 160, desc: "Mixed vegetables simmered in a smooth coconut and cashew gravy, gently spiced and creamy." },
    { tag: "Beef",          name: "Beef Curry & Masala",      price: 190, desc: "Tender beef cooked in a rich, robust Malabar masala with caramelised onions and freshly ground spices." },
    { tag: "Special Days",  name: "Beef & Kuttan Dum Biriyani", options: H2(130, 170), desc: "A special-day dum biriyani of tender beef and Kuttan layered with fragrant basmati, spices and fried onions." },
    { tag: "Seafood",       name: "Fish",                     price: null, desc: "Priced as per size." }
  ],
  breads: [
    { tag: "After 5 PM", name: "Naan",              price: 25, desc: "Soft, pillowy tandoor-baked flatbread, ideal for scooping up curries and gravies." },
    { tag: "After 5 PM", name: "Garlic Naan",       price: 40, desc: "Fluffy tandoor naan topped with roasted garlic and fresh coriander." },
    { tag: "After 5 PM", name: "Garlic Butter Naan", price: 45, desc: "Soft naan brushed with garlic butter and herbs, warm, fragrant and lightly golden." },
    { tag: "After 5 PM", name: "Butter Naan",       price: 35, desc: "Tandoor-baked naan finished with a generous brush of melted butter." },
    { tag: "After 5 PM", name: "Rotti",             price: 20, desc: "Traditional soft, thin flatbread, freshly cooked and perfect with any curry." },
    { tag: "After 5 PM", name: "Butter Rotti",      price: 30, desc: "Soft, freshly made rotti glossed with melted butter." },
    { tag: "After 5 PM", name: "Kulcha",            price: 35, desc: "Soft leavened flatbread baked fresh in the tandoor with a lightly crisp edge." },
    { tag: "After 5 PM", name: "Butter Kulcha",     price: 40, desc: "Tandoor-baked kulcha brushed with melted butter, soft, golden and indulgent." },
    { tag: "After 5 PM", name: "Kuboos",            price: 10, desc: "Warm, traditional Arabian pita bread, soft and pillowy, made for dips and grills." }
  ]
};
const MENU_NOTES = { breads: "Breads are available after 5:00 PM.", specials: "Beef Ribs and Fish are priced on request." };

/* --------------------------------------------------------------------------
   LIVE MENU FROM GOOGLE SHEET
   Paste the "Publish to web -> CSV" link of the menu sheet between the quotes.
   Leave it empty ("") to use the built-in menu above. If the sheet cannot be
   loaded (offline, wrong link) the built-in menu is used automatically.
   Sheet columns (row 1 = headers, exactly):
   Category | Tag | Name | Quarter | Half | Full | Price | Description | Available
   -------------------------------------------------------------------------- */
const MENU_SHEET_URL = "";

function parseCSV(text) {
  const rows = []; let row = [], cell = "", q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else q = false; }
      else cell += c;
    } else if (c === '"') q = true;
    else if (c === ",") { row.push(cell); cell = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(cell); rows.push(row); row = []; cell = "";
    } else cell += c;
  }
  if (cell !== "" || row.length) { row.push(cell); rows.push(row); }
  return rows;
}

function sheetCategory(v) {
  const k = String(v || "").toLowerCase().replace(/[^a-z]/g, "");
  if (k.includes("alfaham")) return "alfaham";
  if (k.includes("mandhi")) return "mandhi";
  if (k.includes("rice") || k.includes("special")) return "specials";
  if (k.includes("bread")) return "breads";
  return null;
}
const sheetPrice = (v) => { const n = parseInt(String(v || "").replace(/[^\d]/g, ""), 10); return n > 0 ? n : null; };

async function loadSheetMenu() {
  if (!MENU_SHEET_URL) return false;
  try {
    const res = await fetch(MENU_SHEET_URL, { cache: "no-store" });
    if (!res.ok) throw new Error("HTTP " + res.status);
    const rows = parseCSV(await res.text());
    const head = rows.shift().map((h) => h.trim().toLowerCase());
    const col = (n) => head.indexOf(n);
    const C = { cat: col("category"), tag: col("tag"), name: col("name"), q: col("quarter"), h: col("half"), f: col("full"), p: col("price"), d: col("description"), a: col("available") };
    if (C.cat < 0 || C.name < 0) throw new Error("Missing Category/Name columns");

    const next = {};
    rows.forEach((r) => {
      const name = (r[C.name] || "").trim(), key = sheetCategory(r[C.cat]);
      if (!name || !key) return;
      if (C.a >= 0 && /^(no|n|false|0|sold)/i.test((r[C.a] || "").trim())) return;
      const it = { tag: (r[C.tag] || "").trim() || "Menu", name };
      const desc = (r[C.d] || "").trim(); if (desc) it.desc = desc;
      const opts = [["Quarter", C.q], ["Half", C.h], ["Full", C.f]]
        .map(([size, c]) => ({ size, price: c >= 0 ? sheetPrice(r[c]) : null })).filter((o) => o.price);
      if (opts.length) it.options = opts; else it.price = C.p >= 0 ? sheetPrice(r[C.p]) : null;
      (next[key] = next[key] || []).push(it);
    });

    const keys = Object.keys(next);
    if (!keys.length) throw new Error("No valid rows");
    keys.forEach((k) => { MENU[k] = next[k]; });
    return true;
  } catch (err) {
    console.warn("Menu sheet not loaded, using built-in menu:", err);
    return false;
  }
}

const fmt = (p) => (p ? "₹" + p : "Ask us");
const optLabel = (o) => o.size || (o.price ? "Starting at ₹" + o.price : "Ask us for price");
const addKey = (it, o) => `${it.name}${o.size ? " (" + o.size + ")" : ""}|${o.price ?? ""}`;

/* --------------------------------------------------------------------------
   1. LENIS SMOOTH SCROLL — synced with GSAP ticker
   -------------------------------------------------------------------------- */
const lenis = window.Lenis
  ? new Lenis({ lerp: 0.09, smoothWheel: !reduceMotion, wheelMultiplier: 1, touchMultiplier: 1.4 })
  : { /* graceful fallback: native scrolling if the Lenis CDN is blocked */
      on() {}, raf() {}, stop() { document.documentElement.style.overflow = "hidden"; },
      start() { document.documentElement.style.overflow = ""; },
      scrollTo(t) { (typeof t === "number" ? window.scrollTo({ top: t, behavior: "smooth" }) : t.scrollIntoView({ behavior: "smooth" })); }
    };
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);
lenis.stop(); // locked until the preloader finishes

const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

/* --------------------------------------------------------------------------
   2. HELPERS
   -------------------------------------------------------------------------- */
function splitWords(el) {
  if (el.dataset.splitDone) return $$(".w-in", el);
  const out = document.createElement("div");
  const walk = (node, parent) => {
    node.childNodes.forEach((n) => {
      if (n.nodeType === 3) {
        n.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) { parent.appendChild(document.createTextNode(" ")); return; }
          const w = document.createElement("span"); w.className = "w";
          const i = document.createElement("span"); i.className = "w-in"; i.textContent = part;
          w.appendChild(i); parent.appendChild(w);
        });
      } else if (n.nodeName === "BR") {
        parent.appendChild(n.cloneNode());
      } else {
        const c = n.cloneNode(false); parent.appendChild(c); walk(n, c);
      }
    });
  };
  walk(el, out);
  el.innerHTML = "";
  el.append(...out.childNodes);
  el.dataset.splitDone = "1";
  return $$(".w-in", el);
}

let toastTimer;
function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  gsap.killTweensOf(t);
  gsap.timeline()
    .to(t, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" })
    .to(t, { opacity: 0, y: -12, duration: 0.5, ease: "power2.in" }, "+=1.6");
}

/* Build premium buttons: label roll, arrow swap, fill sweep, click ripple */
function enhanceButtons() {
  $$(".btn").forEach((btn) => {
    if (btn.dataset.enhanced) return;
    btn.dataset.enhanced = "1";
    const text = btn.textContent.trim();
    const noIcon = btn.classList.contains("btn--sm") && btn.id === "orderSend";
    btn.innerHTML =
      '<span class="btn__fill"></span>' +
      `<span class="btn__label"><span>${text}</span><span aria-hidden="true">${text}</span></span>` +
      (noIcon ? "" : '<span class="btn__icon"><svg><use href="#arrow"/></svg><svg><use href="#arrow"/></svg></span>');

    btn.addEventListener("click", (e) => {
      const r = btn.getBoundingClientRect();
      const d = Math.max(r.width, r.height) * 2;
      const rip = document.createElement("span");
      rip.className = "ripple";
      Object.assign(rip.style, { width: d + "px", height: d + "px", left: e.clientX - r.left - d / 2 + "px", top: e.clientY - r.top - d / 2 + "px" });
      btn.appendChild(rip);
      gsap.to(rip, { scale: 1, opacity: 0, duration: 0.8, ease: "power2.out", onComplete: () => rip.remove() });
    });
  });
}

/* --------------------------------------------------------------------------
   3. MENU RENDER + TABS
   -------------------------------------------------------------------------- */
const menuGrid = $("#menuGrid");
let currentTab = "alfaham";

function renderMenu(key, animate = true) {
  const note = MENU_NOTES[key] ? `<p class="menu-note">${MENU_NOTES[key]}</p>` : "";
  menuGrid.innerHTML = note + MENU[key].map((it, i) => {
    const opts = it.options || [{ size: "", price: it.price ?? null }];
    const o = opts[0];
    return `
    <article class="mitem" data-tab="${key}" data-i="${i}">
      <div class="mitem__top"><span>${it.tag}</span><b class="mitem__price">${o.price ? "₹" + o.price : ""}</b></div>
      <h3>${it.name}</h3>
      ${it.desc ? `<p>${it.desc}</p>` : ""}
      ${opts.length > 1 ? `<div class="sizes" role="radiogroup" aria-label="Portion size">${opts.map((x, j) =>
        `<button type="button" class="size${j ? "" : " is-on"}" role="radio" aria-checked="${!j}" data-j="${j}">${x.size}${x.price ? ` <small>₹${x.price}</small>` : ""}</button>`).join("")}</div>` : ""}
      <div class="mitem__foot">
        <span class="mitem__sel">${optLabel(o)}</span>
        <button class="mitem__add" data-add="${addKey(it, o)}">Add to order +</button>
      </div>
    </article>`;
  }).join("");

  const cards = $$(".mitem", menuGrid);
  cards.forEach((c) => {
    c.addEventListener("pointermove", (e) => {
      const r = c.getBoundingClientRect();
      c.style.setProperty("--mx", e.clientX - r.left + "px");
      c.style.setProperty("--my", e.clientY - r.top + "px");
    });
  });

  if (animate) {
    gsap.fromTo(cards, { y: 50, opacity: 0, scale: 0.96 }, { y: 0, opacity: 1, scale: 1, duration: 0.9, ease: "power4.out", stagger: { each: 0.05, from: "start" }, clearProps: "transform" });
  }
  bindCursorTargets();
  ScrollTrigger.refresh();
}

/* portion selector (Quarter / Half / Full ...) */
menuGrid.addEventListener("click", (e) => {
  const b = e.target.closest(".size");
  if (!b) return;
  const card = b.closest(".mitem"), it = MENU[card.dataset.tab][card.dataset.i], o = it.options[b.dataset.j];
  $$(".size", card).forEach((s) => { s.classList.toggle("is-on", s === b); s.setAttribute("aria-checked", s === b); });
  $(".mitem__price", card).textContent = o.price ? "₹" + o.price : "";
  $(".mitem__sel", card).textContent = optLabel(o);
  $(".mitem__add", card).dataset.add = addKey(it, o);
});

/* sliding pill behind the active tab */
const tabsEl = $(".tabs");
const pill = document.createElement("i");
pill.className = "tabs__pill";
tabsEl.prepend(pill);
function movePill(animate = true) {
  const tab = $(".tab.is-active");
  const p = { x: tab.offsetLeft, y: tab.offsetTop, width: tab.offsetWidth, height: tab.offsetHeight };
  animate ? gsap.to(pill, { ...p, duration: 0.8, ease: "expo.out" }) : gsap.set(pill, p);
}
movePill(false);
window.addEventListener("resize", () => movePill(false));
document.fonts?.ready.then(() => movePill(false));

$$(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    const key = tab.dataset.tab;
    if (key === currentTab) return;
    currentTab = key;
    $$(".tab").forEach((t) => { t.classList.toggle("is-active", t === tab); t.setAttribute("aria-selected", t === tab); });
    movePill();
    const old = $$(".mitem", menuGrid);
    gsap.to(old, { y: -24, opacity: 0, duration: 0.35, ease: "power2.in", stagger: 0.02, onComplete: () => renderMenu(key) });
  });
});

/* --------------------------------------------------------------------------
   4. ORDER CART -> WhatsApp
   -------------------------------------------------------------------------- */
const cart = [];
const bar = $("#orderbar"), panel = $("#ocart");
const inr = (n) => "₹" + n.toLocaleString("en-IN");
const cartTotal = () => cart.reduce((s, i) => s + (i.price || 0) * i.qty, 0);

function openCart(open) {
  panel.hidden = !open;
  $("#orderToggle").setAttribute("aria-expanded", open);
}
function closeCart() { openCart(false); }

function updateCart() {
  const total = cartTotal();
  const count = cart.reduce((s, i) => s + i.qty, 0);
  $("#orderCount").textContent = count;
  $("#orderTotal").textContent = total ? `· ${inr(total)}` : "";
  $("#ocartList").innerHTML = cart.map((i, n) => `
    <li class="oi">
      <div class="oi__info"><b>${i.name}</b><small>${i.price ? inr(i.price) + " each" : "Price on request"}</small></div>
      <div class="oi__qty" role="group" aria-label="Quantity for ${i.name}">
        <button type="button" data-act="dec" data-n="${n}" aria-label="Decrease quantity">−</button>
        <output>${i.qty}</output>
        <button type="button" data-act="inc" data-n="${n}" aria-label="Increase quantity">+</button>
      </div>
      <button type="button" class="oi__rm" data-act="rm" data-n="${n}" aria-label="Remove ${i.name} from order">Remove</button>
    </li>`).join("");
  if (!count) closeCart();
  gsap.to(bar, { yPercent: count ? 0 : 160, duration: 0.7, ease: "expo.out", overwrite: "auto" });
}
gsap.set(bar, { xPercent: -50, yPercent: 160 });

document.addEventListener("click", (e) => {
  const add = e.target.closest("[data-add]");
  if (!add) return;
  const [name, price] = add.dataset.add.split("|");
  const found = cart.find((i) => i.name === name);
  if (found) found.qty++; else cart.push({ name, price: price ? +price : null, qty: 1 });
  updateCart();
  toast(`${name} added`);
  gsap.fromTo(add, { scale: 0.8 }, { scale: 1, duration: 0.6, ease: "elastic.out(1,0.4)", clearProps: "transform" });
});

$("#orderToggle").addEventListener("click", () => openCart(panel.hidden));
$("#ocartClose").addEventListener("click", closeCart);
$("#ocartList").addEventListener("click", (e) => {
  const b = e.target.closest("[data-act]");
  if (!b) return;
  const n = +b.dataset.n, item = cart[n];
  if (!item) return;
  if (b.dataset.act === "inc") item.qty++;
  else if (b.dataset.act === "dec") item.qty--;
  else item.qty = 0;                       /* "Remove" */
  if (item.qty < 1) cart.splice(n, 1);
  updateCart();
});

/* Order type: Dining / Parcel (Takeaway) / Delivery */
const orderType = () => $('input[name="otype"]:checked').value;
$$('input[name="otype"]').forEach((r) => r.addEventListener("change", () => { $("#oAddr").hidden = orderType() !== "Delivery"; }));

$("#orderClear").addEventListener("click", () => { cart.length = 0; updateCart(); });
$("#orderSend").addEventListener("click", () => {
  if (!cart.length) return;
  const type = orderType(), addr = $("#oAddr").value.trim();
  if (type === "Delivery" && !addr) { openCart(true); $("#oAddr").focus(); toast("Please add your delivery address"); return; }
  const lines = cart.map((i) => `• ${i.qty} × ${i.name}${i.price ? " — " + inr(i.price * i.qty) : " (price on request)"}`).join("\n");
  const total = cartTotal();
  const msg = `Hello UrbanDine! I'd like to place an order.\nOrder type: ${type}${type === "Delivery" ? "\nAddress: " + addr : ""}\n\n${lines}${total ? "\n\nApprox. total: " + inr(total) : ""}`;
  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
});

/* --------------------------------------------------------------------------
   5. BOOKING FORM
   -------------------------------------------------------------------------- */
const fDate = $("#fDate"), fTime = $("#fTime");
fDate.min = new Date(Date.now() - new Date().getTimezoneOffset() * 6e4).toISOString().split("T")[0];

const SLOT_TIME = { "Lunch (12 - 4 PM)": "13:00", "Evening (4 - 8 PM)": "19:30", "Late Night (8 - 11:55 PM)": "21:30" };
const toMin = (v) => { const [h, m] = v.split(":").map(Number); return h * 60 + m; };
const to12  = (v) => { const [h, m] = v.split(":").map(Number); return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`; };

let slot = "Evening (4 - 8 PM)";
function setSlot(label) {
  slot = label;
  $$(".slot").forEach((s) => s.classList.toggle("is-active", s.dataset.slot === label));
}
/* the time picker and the slot buttons stay in sync */
$$(".slot").forEach((b) => b.addEventListener("click", () => { setSlot(b.dataset.slot); fTime.value = SLOT_TIME[b.dataset.slot]; }));
fTime.addEventListener("input", () => {
  if (!fTime.value) return;
  const t = toMin(fTime.value);
  setSlot(t >= 1200 ? "Late Night (8 - 11:55 PM)" : t >= 960 ? "Evening (4 - 8 PM)" : "Lunch (12 - 4 PM)");
});

$("#bookingForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = $("#fName"), phone = $("#fPhone");
  const t = fTime.value ? toMin(fTime.value) : -1;
  let ok = true;
  [name, phone, fDate, fTime].forEach((f) => {
    const bad = !f.value.trim() || (f === fTime && (t < 720 || t > 1435));   /* open 12:00 PM - 11:55 PM */
    f.closest(".field").classList.toggle("is-error", bad);
    if (bad) { ok = false; gsap.fromTo(f, { x: -8 }, { x: 0, duration: 0.6, ease: "elastic.out(1,0.3)" }); }
  });
  const msgEl = $("#formMsg");
  if (!ok) { msgEl.textContent = "Please fill in your name, phone, date and a time between 12:00 PM and 11:55 PM."; return; }

  const msg = [
    "Hello UrbanDine! I'd like to reserve a table:",
    `Name: ${name.value}`, `Phone: ${phone.value}`, `Date: ${fDate.value}`,
    `Time: ${to12(fTime.value)} (${slot})`, `Guests: ${$("#fGuests").value}`, `Preference: ${$("#fMeal").value}`,
    $("#fNotes").value ? `Notes: ${$("#fNotes").value}` : ""
  ].filter(Boolean).join("\n");

  msgEl.textContent = "Opening WhatsApp to confirm your request…";
  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
});

/* --------------------------------------------------------------------------
   5b. EVENT INQUIRY -> WhatsApp
   -------------------------------------------------------------------------- */
const eDate = $("#eDate");
eDate.min = fDate.min;
$("#eventForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = $("#eName"), phone = $("#ePhone"), guests = $("#eGuests");
  let ok = true;
  [name, phone, guests, eDate].forEach((f) => {
    const bad = !f.value.trim() || (f === guests && +f.value < 1);
    f.closest(".field").classList.toggle("is-error", bad);
    if (bad) { ok = false; gsap.fromTo(f, { x: -8 }, { x: 0, duration: 0.6, ease: "elastic.out(1,0.3)" }); }
  });
  const msgEl = $("#eventMsg");
  if (!ok) { msgEl.textContent = "Please fill in your name, phone, estimated guest count and preferred date."; return; }

  const msg = [
    "Hello UrbanDine! I'd like to enquire about hosting an event:",
    `Name: ${name.value}`, `Phone: ${phone.value}`, `Event type: ${$("#eType").value}`,
    `Estimated guests: ${guests.value}`, `Preferred date: ${eDate.value}`,
    $("#eNotes").value ? `Notes: ${$("#eNotes").value}` : ""
  ].filter(Boolean).join("\n");

  msgEl.textContent = "Opening WhatsApp to send your inquiry…";
  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
});

/* --------------------------------------------------------------------------
   6. FAQ ACCORDION
   -------------------------------------------------------------------------- */
$$(".faq__item").forEach((item) => {
  const q = $(".faq__q", item), a = $(".faq__a", item), icon = $(".faq__icon", item);
  q.addEventListener("click", () => {
    const open = !item.classList.contains("is-open");
    $$(".faq__item.is-open").forEach((o) => {
      if (o === item) return;
      o.classList.remove("is-open");
      $(".faq__q", o).setAttribute("aria-expanded", "false");
      gsap.to($(".faq__a", o), { height: 0, duration: 0.6, ease: "power3.inOut" });
      gsap.to($(".faq__icon", o), { rotation: 0, duration: 0.5 });
    });
    item.classList.toggle("is-open", open);
    q.setAttribute("aria-expanded", open);
    gsap.to(a, { height: open ? "auto" : 0, duration: 0.6, ease: "power3.inOut", onComplete: () => ScrollTrigger.refresh() });
    gsap.to(icon, { rotation: open ? 45 : 0, duration: 0.5, ease: "back.out(2)" });
  });
});

/* --------------------------------------------------------------------------
   7. NAV (hide on scroll down, show on up, mobile menu, anchors, active link)
   -------------------------------------------------------------------------- */
const nav = $("#nav");
const burger = $("#burger");
const navLinks = $("#navLinks");

function closeMobile() {
  burger.classList.remove("is-open");
  navLinks.classList.remove("is-open");
  burger.setAttribute("aria-expanded", "false");
  lenis.start();
}
burger.addEventListener("click", () => {
  const open = burger.classList.toggle("is-open");
  navLinks.classList.toggle("is-open", open);
  burger.setAttribute("aria-expanded", open);
  open ? lenis.stop() : lenis.start();
  if (open) gsap.fromTo($$("a", navLinks), { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: "expo.out", stagger: 0.07, delay: 0.25 });
});

lenis.on("scroll", ({ scroll, direction }) => {
  nav.classList.toggle("is-scrolled", scroll > 40);
  nav.classList.toggle("is-hidden", scroll > 260 && direction === 1 && !navLinks.classList.contains("is-open"));
});

$$('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const id = a.getAttribute("href");
    if (id.length < 2) return;
    const target = $(id);
    if (!target) return;
    e.preventDefault();
    closeMobile();
    lenis.scrollTo(id === "#home" ? 0 : target, { offset: id === "#home" ? 0 : -70, duration: 1.8, easing: easeOutQuart });
  });
});

["menu", "about", "gallery", "reviews", "contact", "events"].forEach((id) => {
  ScrollTrigger.create({
    trigger: "#" + id, start: "top 55%", end: "bottom 55%",
    onToggle: (self) => $(`.nav__links a[href="#${id}"]`)?.classList.toggle("is-active", self.isActive)
  });
});

/* --------------------------------------------------------------------------
   8. CURSOR, MAGNETIC BUTTONS, CARD TILT
   -------------------------------------------------------------------------- */
function bindCursorTargets() {
  if (!finePointer) return;
  $$("a, button, .tab, .slot, input, select, textarea, [data-tilt]").forEach((el) => {
    if (el.dataset.cur) return;
    el.dataset.cur = "1";
    el.addEventListener("pointerenter", () => $(".cursor").classList.add("is-hover"));
    el.addEventListener("pointerleave", () => $(".cursor").classList.remove("is-hover"));
  });
}

function initPointerFX() {
  if (!finePointer || reduceMotion) return;

  const dot = $(".cursor__dot"), ring = $(".cursor__ring");
  const dx = gsap.quickTo(dot, "x", { duration: 0.1, ease: "power3" });
  const dy = gsap.quickTo(dot, "y", { duration: 0.1, ease: "power3" });
  const rx = gsap.quickTo(ring, "x", { duration: 0.5, ease: "power3" });
  const ry = gsap.quickTo(ring, "y", { duration: 0.5, ease: "power3" });
  window.addEventListener("pointermove", (e) => { dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY); });

  $$("[data-magnetic]").forEach((el) => {
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      gsap.to(el, { x: (e.clientX - r.left - r.width / 2) * 0.28, y: (e.clientY - r.top - r.height / 2) * 0.4, duration: 0.5, ease: "power3.out" });
    });
    el.addEventListener("pointerleave", () => gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1,0.35)" }));
  });

  $$("[data-tilt]").forEach((el) => {
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      gsap.to(el, { rotationY: px * 8, rotationX: -py * 8, y: -6, transformPerspective: 900, duration: 0.6, ease: "power3.out" });
    });
    el.addEventListener("pointerleave", () => gsap.to(el, { rotationY: 0, rotationX: 0, y: 0, duration: 0.9, ease: "elastic.out(1,0.5)" }));
  });
}

/* --------------------------------------------------------------------------
   9. PRELOADER
   -------------------------------------------------------------------------- */
/* Resolves when the curtain starts lifting (so the hero intro can overlap it).
   `done` resolves when the preloader is fully gone. */
function runPreloader() {
  let reveal, done;
  const revealP = new Promise((r) => (reveal = r));
  const doneP = new Promise((r) => (done = r));
  const num = $(".pre__num"), bar = $(".pre__bar i"), o = { v: 0 };

  gsap.timeline({ onComplete: done })
    .to(o, { v: 100, duration: reduceMotion ? 0.3 : 2, ease: "power2.inOut", onUpdate: () => { num.textContent = Math.round(o.v); bar.style.transform = `scaleX(${o.v / 100})`; } })
    .to(".pre__flame", { scale: 1.6, opacity: 0, duration: 0.5, ease: "power3.in" })
    .to(".pre__inner > :not(.pre__flame)", { y: -30, opacity: 0, duration: 0.5, ease: "power2.in", stagger: 0.05 }, "<")
    .add(reveal, "-=0.1")
    .to(".pre", { yPercent: -100, duration: 1.2, ease: "expo.inOut" }, "<")
    .set(".pre", { display: "none" });

  return { reveal: revealP, done: doneP };
}

/* --------------------------------------------------------------------------
   10. HERO INTRO  (prepared before the preloader, played as it lifts)
   -------------------------------------------------------------------------- */
let heroWords = [];
function prepareHero() {
  heroWords = splitWords($(".hero__title"));
  gsap.set(heroWords, { yPercent: 115, rotate: 4 });
  gsap.set("[data-hero-in]", { y: 30, opacity: 0 });
  gsap.set(".nav", { yPercent: -100 });
  gsap.set(".scrollcue", { opacity: 0, y: 20 });
}

function heroIntro() {
  gsap.timeline({ defaults: { ease: "expo.out" } })
    .fromTo(".hero__img", { scale: 1.4 }, { scale: 1.15, duration: 2.4, ease: "power3.out" }, 0)
    .to(heroWords, { yPercent: 0, rotate: 0, duration: 1.4, stagger: 0.09 }, 0.15)
    .to("[data-hero-in]", { y: 0, opacity: 1, duration: 1, stagger: 0.12 }, 0.5)
    .to(".nav", { yPercent: 0, duration: 1.1, clearProps: "transform" }, 0.6) /* clearProps so .is-hidden works */
    .to(".scrollcue", { opacity: 1, y: 0, duration: 1 }, 1.3);
}

/* --------------------------------------------------------------------------
   10b. HERO EMBERS — drifting sparks on a canvas (pauses off-screen)
   -------------------------------------------------------------------------- */
function initEmbers() {
  const c = $(".embers");
  if (!c || reduceMotion) return;
  const ctx = c.getContext("2d");
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let w = 0, h = 0, on = true;
  const N = innerWidth < 700 ? 20 : 44;

  const resize = () => {
    w = c.clientWidth; h = c.clientHeight;
    c.width = w * dpr; c.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  const spawn = (initial) => ({
    x: Math.random() * w, y: initial ? Math.random() * h : h + 12,
    r: Math.random() * 2 + 0.6, vy: -(Math.random() * 0.6 + 0.25), vx: (Math.random() - 0.5) * 0.3,
    t: Math.random() * 6.28, a: Math.random() * 0.5 + 0.35
  });
  resize();
  let parts = Array.from({ length: N }, () => spawn(true));
  window.addEventListener("resize", resize);

  gsap.ticker.add(() => {
    if (!on) return;
    ctx.clearRect(0, 0, w, h);
    ctx.globalCompositeOperation = "lighter";
    parts.forEach((p, i) => {
      p.t += 0.02; p.x += p.vx + Math.sin(p.t) * 0.3; p.y += p.vy;
      if (p.y < -20) { parts[i] = spawn(false); return; }
      const fade = Math.min(1, (p.y / h) * 1.6 + 0.2);
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 6);
      g.addColorStop(0, `rgba(233,112,63,${p.a * fade})`);
      g.addColorStop(1, "rgba(230,81,0,0)");
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 6, 0, 6.283); ctx.fill();
    });
  });
  ScrollTrigger.create({ trigger: ".hero", start: "top top", end: "+=220%", onToggle: (s) => { on = s.isActive; if (!on) ctx.clearRect(0, 0, w, h); } });
}

/* --------------------------------------------------------------------------
   10c. GALLERY LIGHTBOX
   -------------------------------------------------------------------------- */
function initLightbox() {
  const box = $("#lightbox"), big = $("img", box);
  const close = () => {
    gsap.to(box, { opacity: 0, duration: 0.4, onComplete: () => { box.classList.remove("is-open"); lenis.start(); } });
  };
  $$(".g").forEach((g) => g.addEventListener("click", () => {
    const img = $("img", g);
    if (!img || !img.naturalWidth) return;
    big.src = img.currentSrc || img.src; big.alt = img.alt;
    box.classList.add("is-open"); lenis.stop();
    gsap.fromTo(box, { opacity: 0 }, { opacity: 1, duration: 0.5 });
    gsap.fromTo(big, { scale: 0.88, y: 30 }, { scale: 1, y: 0, duration: 0.9, ease: "expo.out" });
  }));
  box.addEventListener("click", close);
  window.addEventListener("keydown", (e) => { if (e.key === "Escape" && box.classList.contains("is-open")) close(); });
}

function splitChars(el) {
  const text = el.textContent.trim();
  el.innerHTML = [...text].map((ch) => `<span class="w"><span class="w-in">${ch}</span></span>`).join("");
  return $$(".w-in", el);
}

/* --------------------------------------------------------------------------
   11. SCROLL ANIMATIONS
   -------------------------------------------------------------------------- */
function initScroll() {
  const mm = gsap.matchMedia();

  /* progress bar */
  gsap.to(".progress", { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.3 } });

  mm.add("(prefers-reduced-motion: no-preference)", () => {

    /* ---- HERO: Apple-style pinned reveal ---- */
    gsap.timeline({
      scrollTrigger: { trigger: ".hero", start: "top top", end: "+=170%", pin: true, scrub: 1, anticipatePin: 1 }
    })
      .fromTo(".hero__media", { clipPath: "inset(11% 7% 11% 7% round 36px)" }, { clipPath: "inset(0% 0% 0% 0% round 0px)", ease: "none", duration: 1 }, 0)
      .fromTo(".hero__img", { scale: 1.15 }, { scale: 1, ease: "none", duration: 1 }, 0)
      .fromTo(".hero__overlay", { opacity: 1 }, { opacity: 0.85, ease: "none", duration: 1 }, 0)
      .to(".hero__content", { scale: 0.9, y: -80, opacity: 0, ease: "power1.in", duration: 0.55 }, 0.3)
      .to(".embers", { opacity: 0.4, duration: 1, ease: "none" }, 0)
      .to(".scrollcue", { opacity: 0, duration: 0.2 }, 0)
      .fromTo(".hero__reveal", { opacity: 0, y: 70, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, ease: "power2.out", duration: 0.5 }, 0.75)
      .to({}, { duration: 0.35 }); // hold

    /* ---- Marquee speeds up with scroll velocity ---- */
    const mq = $(".marquee__track");
    const loop = gsap.to(mq, { xPercent: -50, duration: 28, ease: "none", repeat: -1 });
    ScrollTrigger.create({
      onUpdate: (self) => {
        const v = Math.min(Math.abs(self.getVelocity()) / 400, 6);
        gsap.to(loop, { timeScale: (self.direction === 1 ? 1 : -1) * (1 + v), duration: 0.3, overwrite: true });
        gsap.to(loop, { timeScale: self.direction === 1 ? 1 : -1, duration: 1.2, delay: 0.3 });
      }
    });

    /* ---- Generic reveals ---- */
    $$("[data-split]").forEach((el) => {
      const words = splitWords(el);
      gsap.from(words, { yPercent: 115, rotate: 3, duration: 1.2, ease: "expo.out", stagger: 0.06, scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none reverse" } });
    });
    $$("[data-fade]").forEach((el) => {
      gsap.from(el, { y: 40, opacity: 0, duration: 1.1, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 92%", toggleActions: "play none none reverse" } });
    });

    /* ---- Cards (staggered batches) ---- */
    ["#platters .pcard", ".rcard", ".ccard", ".evcard"].forEach((sel) => {
      gsap.set(sel, { y: 80, opacity: 0 });
      ScrollTrigger.batch(sel, {
        start: "top 90%",
        onEnter: (els) => gsap.to(els, { y: 0, opacity: 1, duration: 1.1, ease: "power4.out", stagger: 0.12, overwrite: true }),
        onLeaveBack: (els) => gsap.to(els, { y: 80, opacity: 0, duration: 0.5, overwrite: true })
      });
    });

    /* ---- Menu tilt-in ---- */
    gsap.from("#menu .tabs .tab", { y: 30, opacity: 0, stagger: 0.08, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: "#menu .tabs", start: "top 90%" } });
    gsap.from(".mitem", { y: 70, opacity: 0, duration: 1, ease: "power4.out", stagger: 0.06, scrollTrigger: { trigger: "#menuGrid", start: "top 88%" }, clearProps: "transform" });

    /* ---- Scrubbed word-by-word text (about copy) ---- */
    $$("[data-scrub]").forEach((el) => {
      const words = splitWords(el);
      gsap.fromTo(words, { opacity: 0.14 }, { opacity: 1, ease: "none", stagger: 0.06, scrollTrigger: { trigger: el, start: "top 85%", end: "bottom 55%", scrub: true } });
    });

    /* ---- Footer wordmark ---- */
    const mark = $(".footer__mark");
    if (mark) {
      const chars = splitChars(mark);
      gsap.from(chars, { yPercent: 110, duration: 1.4, ease: "expo.out", stagger: 0.06, scrollTrigger: { trigger: mark, start: "top 100%" } });
    }

    /* ---- About: image mask reveal + parallax, counters ---- */
    gsap.fromTo(".reveal-img", { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: 1.6, ease: "expo.inOut", scrollTrigger: { trigger: ".reveal-img", start: "top 85%" } });
    gsap.fromTo(".parallax-img", { yPercent: -6 }, { yPercent: 6, ease: "none", scrollTrigger: { trigger: ".reveal-img", start: "top bottom", end: "bottom top", scrub: true } });
    gsap.from(".about__cap", { y: 30, opacity: 0, duration: 1, delay: 0.6, scrollTrigger: { trigger: ".reveal-img", start: "top 70%" } });

    $$("[data-count]").forEach((el) => {
      const end = +el.dataset.count, o = { v: 0 };
      gsap.to(o, { v: end, duration: 2, ease: "power2.out", onUpdate: () => (el.textContent = Math.round(o.v)), scrollTrigger: { trigger: el, start: "top 92%", once: true } });
    });

    /* ---- Gallery: clip reveal + per-tile parallax ---- */
    gsap.set(".g", { clipPath: "inset(100% 0 0 0 round 14px)" });
    ScrollTrigger.batch(".g", {
      start: "top 92%",
      onEnter: (els) => gsap.to(els, { clipPath: "inset(0% 0 0 0 round 14px)", duration: 1.3, ease: "expo.out", stagger: 0.1 })
    });
    $$(".g").forEach((g) => {
      const s = parseFloat(g.dataset.speed || 0);
      gsap.to(g, { y: () => -s * 600, ease: "none", scrollTrigger: { trigger: ".gallery", start: "top bottom", end: "bottom top", scrub: true } });
    });

    /* ---- CTA band ---- */
    gsap.from(".cta > *", { y: 50, opacity: 0, stagger: 0.15, duration: 1.1, ease: "power3.out", scrollTrigger: { trigger: ".cta", start: "top 85%" } });

    /* ---- Event booking ---- */
    gsap.from([".evinfo", ".evform"], { y: 80, opacity: 0, stagger: 0.14, duration: 1.2, ease: "power4.out", scrollTrigger: { trigger: ".evbook", start: "top 85%" } });

    /* ---- Booking + side boxes ---- */
    gsap.from([".form", ".side > *"], { y: 80, opacity: 0, stagger: 0.14, duration: 1.2, ease: "power4.out", scrollTrigger: { trigger: ".book", start: "top 85%" } });
    gsap.from(".slot", { scale: 0.9, opacity: 0, stagger: 0.08, duration: 0.8, ease: "back.out(1.6)", scrollTrigger: { trigger: ".slots", start: "top 90%" } });

    /* ---- FAQ + footer ---- */
    gsap.from(".faq__item", { x: 60, opacity: 0, stagger: 0.1, duration: 1, ease: "power3.out", scrollTrigger: { trigger: ".faq__list", start: "top 85%" } });
    gsap.from(".footer__grid > div", { y: 50, opacity: 0, stagger: 0.12, duration: 1, ease: "power3.out", scrollTrigger: { trigger: ".footer", start: "top 85%" } });
  });

  /* ---- FEATURES: horizontal scroll panel showcase (desktop) ---- */
  mm.add("(min-width: 900px) and (prefers-reduced-motion: no-preference)", () => {
    const track = $(".hs__track");
    const dist = () => track.scrollWidth - window.innerWidth;

    const tween = gsap.to(track, {
      x: () => -dist(),
      ease: "none",
      scrollTrigger: {
        trigger: ".hs", start: "top top", end: () => "+=" + dist(),
        pin: true, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1,
        onUpdate: (self) => gsap.set(".hs__bar", { scaleX: self.progress })
      }
    });

    gsap.from(".hs__intro > *", { y: 60, opacity: 0, stagger: 0.12, duration: 1.1, ease: "power3.out", scrollTrigger: { trigger: ".hs", start: "top 60%" } });

    $$(".hs__panel").forEach((panel) => {
      gsap.fromTo($(".hs__img", panel), { xPercent: -8 }, { xPercent: 8, ease: "none", scrollTrigger: { trigger: panel, containerAnimation: tween, start: "left right", end: "right left", scrub: true } });
      gsap.fromTo(panel, { scale: 0.92, opacity: 0.35 }, { scale: 1, opacity: 1, ease: "none", scrollTrigger: { trigger: panel, containerAnimation: tween, start: "left 90%", end: "left 45%", scrub: true } });
      gsap.from($$(".hs__txt > *", panel), { y: 50, opacity: 0, stagger: 0.09, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: panel, containerAnimation: tween, start: "left 70%", toggleActions: "play none none reverse" } });
    });
  });

  /* ---- FEATURES: stacked reveals on mobile ---- */
  mm.add("(max-width: 899px) and (prefers-reduced-motion: no-preference)", () => {
    $$(".hs__panel, .hs__intro, .hs__end").forEach((el) => {
      gsap.from(el, { y: 60, opacity: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 88%" } });
    });
  });
}

/* --------------------------------------------------------------------------
   12. BOOT
   -------------------------------------------------------------------------- */
async function boot() {
  $("#year").textContent = new Date().getFullYear();

  enhanceButtons();
  await loadSheetMenu(); // uses the Google Sheet when MENU_SHEET_URL is set
  renderMenu("alfaham", false);
  bindCursorTargets();
  initPointerFX();
  initLightbox();
  if (!reduceMotion) prepareHero();
  initScroll();
  initEmbers();

  const pre = runPreloader();
  await pre.reveal;
  if (!reduceMotion) heroIntro();
  await pre.done;
  lenis.start();

  window.addEventListener("load", () => ScrollTrigger.refresh());
  setTimeout(() => ScrollTrigger.refresh(), 600);
  if (document.readyState === "complete") ScrollTrigger.refresh();
}

/* works whether the script runs before or after DOMContentLoaded (CodePen, JSFiddle, etc.) */
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
else boot();
