(function () {
  const C = window.CMS_CONFIG || {};
  const CACHE = "urbandine_sanity_v1";
  const configured = C.projectId && !/YOUR_/.test(C.projectId);

  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
  const safe = (s) => String(s ?? "").replace(/</g, "&lt;");
  const safeName = (s) => safe(String(s ?? "").replace(/["|]/g, "")).trim();

  const IMAGE_NAMES = ["hero", "platter-1", "platter-2", "platter-3", "platter-4", "about", "feature-1", "feature-2", "feature-3", "feature-4",
    "gallery-1", "gallery-2", "gallery-3", "gallery-4", "gallery-5", "gallery-6", "gallery-7", "gallery-8"];
  const field = (n) => "img_" + n.replace(/-/g, "_");

  const QUERY = `{
    "settings": *[_id == "siteSettings"][0]{ ..., ${IMAGE_NAMES.map((n) => `"${field(n)}": ${field(n)}.asset->url`).join(", ")} },
    "menu": *[_type == "menuItem"] | order(sortOrder asc),
    "reviews": *[_type == "review"] | order(sortOrder asc),
    "faqs": *[_type == "faq"] | order(sortOrder asc)
  }`;

  async function fetchAll() {
    const url = `https://${C.projectId}.apicdn.sanity.io/v2025-01-01/data/query/${C.dataset || "production"}?query=${encodeURIComponent(QUERY)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Sanity HTTP " + res.status);
    const r = (await res.json()).result || {};
    const s = r.settings || {};
    const content = Object.keys(s).filter((k) => !k.startsWith("_") && s[k]).map((k) => {
      if (k.startsWith("img_")) return { key: "img_" + k.slice(4).replace(/_/g, "-"), value: s[k] + "?w=1800&auto=format" };
      return { key: k, value: s[k] };
    });
    return { content, menu: r.menu || [], reviews: r.reviews || [], faqs: r.faqs || [] };
  }

  function applyContent(rows) {
    const map = {};
    rows.forEach((r) => { map[r.key] = r.value; });

    document.querySelectorAll("[data-key]").forEach((el) => {
      const v = map[el.dataset.key];
      if (v) el.textContent = v;
    });

    const imgs = {};
    document.querySelectorAll("img[src^='assets/']").forEach((img) => {
      imgs[img.getAttribute("src").replace(/^assets\//, "").replace(/\.\w+$/, "")] = img;
    });
    Object.keys(map).forEach((k) => {
      const img = k.startsWith("img_") && map[k] ? imgs[k.slice(4)] : null;
      if (img) { img.src = map[k]; img.style.display = ""; }
    });

    if (map.phone_display) document.querySelectorAll("[data-phone]").forEach((el) => { el.textContent = map.phone_display; });
    const intl = String(map.phone_intl || "").replace(/\D/g, "");
    if (intl) {
      document.querySelectorAll('a[href^="tel:"]').forEach((a) => a.setAttribute("href", "tel:+" + intl));
      document.querySelectorAll('a[href*="wa.me/"]').forEach((a) => a.setAttribute("href", a.getAttribute("href").replace(/wa\.me\/\d+/, "wa.me/" + intl)));
      const pretty = intl.length === 12 && intl.startsWith("91") ? `+91 ${intl.slice(2, 7)} ${intl.slice(7)}` : "+" + intl;
      document.querySelectorAll("[data-phone-wa]").forEach((el) => { el.textContent = pretty; });
    }
    return intl;
  }

  function applyMenu(MENU, rows) {
    if (!rows.length) return;
    const next = { alfaham: [], mandhi: [], specials: [], breads: [] };
    rows.filter((r) => r.available !== false).forEach((r) => {
      const bucket = next[r.category];
      if (!bucket) return;
      const it = { tag: safe(r.tag) || "Menu", name: safeName(r.name) };
      if (!it.name) return;
      if (r.description) it.desc = safe(r.description);
      const opts = [["Quarter", r.quarter], ["Half", r.half], ["Full", r.full]]
        .filter((o) => o[1] > 0).map(([size, price]) => ({ size, price }));
      if (opts.length) it.options = opts; else it.price = r.price > 0 ? r.price : null;
      bucket.push(it);
    });
    Object.keys(next).forEach((k) => { MENU[k] = next[k]; });
  }

  function applyReviews(rows) {
    const el = document.getElementById("reviewsGrid");
    if (!el || !rows.length) return;
    el.innerHTML = rows.map((r) => {
      const n = Math.min(5, Math.max(1, parseInt(r.stars, 10) || 5));
      return `<blockquote class="rcard" data-tilt><div class="stars" aria-label="${n} stars">${"★".repeat(n)}${"☆".repeat(5 - n)}</div><p>“${esc(r.body)}”</p><cite>${esc(r.author)}</cite></blockquote>`;
    }).join("");
  }

  function applyFaqs(rows) {
    const el = document.getElementById("faqList");
    if (!el || !rows.length) return;
    el.innerHTML = rows.map((r) =>
      `<div class="faq__item"><button class="faq__q" aria-expanded="false">${esc(r.question)}<span class="faq__icon">+</span></button><div class="faq__a"><p>${esc(r.answer)}</p></div></div>`
    ).join("");
  }

  window.loadCMS = async function (MENU) {
    if (!configured) return {};
    let data;
    try {
      data = await Promise.race([fetchAll(), new Promise((_, no) => setTimeout(() => no(new Error("timeout")), 2500))]);
      try { localStorage.setItem(CACHE, JSON.stringify(data)); } catch (e) {}
    } catch (err) {
      console.warn("CMS unreachable, using saved copy:", err);
      try { data = JSON.parse(localStorage.getItem(CACHE)); } catch (e) { data = null; }
    }
    if (!data) return {};
    const whatsapp = applyContent(data.content);
    applyMenu(MENU, data.menu);
    applyReviews(data.reviews);
    applyFaqs(data.faqs);
    return { whatsapp };
  };
})();