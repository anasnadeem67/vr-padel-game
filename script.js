/* =====================================================================
   Paddle Game - script.js
   CONFIG: edit ONLY this block. Every place on the site that shows these
   values is filled from here (single source of truth).
   ===================================================================== */
const GITHUB_RELEASE_ASSET_URL = "PASTE_GITHUB_RELEASE_ASSET_URL_HERE";
// Example: https://github.com/<user>/<repo>/releases/download/<tag>/PaddleGameApk.apk
const RELEASES_PAGE_URL = "PASTE_GITHUB_RELEASES_PAGE_URL_HERE";
// Example: https://github.com/<user>/<repo>/releases
const VERSION = "1.0.0";
const FILE_NAME = "PaddleGameApk.apk";
const FILE_SIZE = "86.6 MB";          // check the real file properties before publishing
const SHA256 = "";                    // paste the real SHA-256 once the APK is final
const RELEASE_DATE = "";              // e.g. "2026-12-01"; empty shows "To be confirmed"
const CONTACT_EMAIL = "";             // empty shows "To be confirmed"
const CONTACT_LINK = "";              // optional GitHub/contact URL
/* ===================================================================== */

(function () {
  "use strict";
  document.documentElement.classList.remove("no-js");

  const isRealUrl = (u) => /^https:\/\/[^\s]+$/i.test(u) && !/PASTE_|<|>/.test(u);
  const TBC = "To be confirmed";

  /* ---- Fill config values ---- */
  const values = {
    version: VERSION, filename: FILE_NAME, filesize: FILE_SIZE,
    date: RELEASE_DATE || null, sha: SHA256 || null
  };
  document.querySelectorAll("[data-cfg]").forEach((el) => {
    const v = values[el.dataset.cfg];
    if (v) el.textContent = v;
    else { el.textContent = TBC; el.classList.add("tbc"); }
  });

  /* ---- Download buttons ---- */
  const dlOk = isRealUrl(GITHUB_RELEASE_ASSET_URL);
  const relOk = isRealUrl(RELEASES_PAGE_URL);
  const dlBtn = document.getElementById("dl-btn");
  const relBtn = document.getElementById("rel-btn");
  const status = document.getElementById("dl-status");

  function disable(btn, text) {
    btn.removeAttribute("href");
    btn.removeAttribute("download");
    btn.setAttribute("aria-disabled", "true");
    btn.setAttribute("role", "link");
    btn.textContent = text;
    btn.addEventListener("click", (e) => e.preventDefault());
  }
  if (dlBtn) {
    if (dlOk) {
      // Normal link: the browser only downloads when the visitor clicks. Nothing starts automatically.
      dlBtn.href = GITHUB_RELEASE_ASSET_URL;
      dlBtn.setAttribute("rel", "noopener");
    } else {
      disable(dlBtn, "Download coming soon");
      if (status) status.textContent = "The download link has not been configured yet.";
    }
  }
  if (relBtn) {
    if (relOk) { relBtn.href = RELEASES_PAGE_URL; relBtn.target = "_blank"; relBtn.rel = "noopener noreferrer"; }
    else disable(relBtn, "Releases coming soon");
  }
  // Hero button just scrolls to the download section (never downloads)

  /* ---- Contact ---- */
  document.querySelectorAll("[data-contact]").forEach((el) => {
    if (CONTACT_EMAIL) { el.href = "mailto:" + CONTACT_EMAIL; el.textContent = CONTACT_EMAIL; }
    else if (isRealUrl(CONTACT_LINK)) { el.href = CONTACT_LINK; el.textContent = "Contact"; el.target = "_blank"; el.rel = "noopener noreferrer"; }
    else { el.removeAttribute("href"); el.textContent = "Contact: " + TBC; el.classList.add("tbc"); }
  });

  /* ---- SHA-256 copy ---- */
  const copyBtn = document.getElementById("copy-sha");
  if (copyBtn) {
    if (!SHA256) copyBtn.disabled = true;
    copyBtn.addEventListener("click", async () => {
      if (!SHA256) return;
      try { await navigator.clipboard.writeText(SHA256); copyBtn.textContent = "Copied"; }
      catch (e) {
        const t = document.createElement("textarea"); t.value = SHA256; document.body.appendChild(t);
        t.select(); try { document.execCommand("copy"); copyBtn.textContent = "Copied"; } catch (_) { copyBtn.textContent = "Copy failed"; }
        t.remove();
      }
      setTimeout(() => (copyBtn.textContent = "Copy"), 1800);
    });
  }

  /* ---- Year ---- */
  const y = document.getElementById("year"); if (y) y.textContent = new Date().getFullYear();

  /* ---- Mobile menu ---- */
  const mb = document.getElementById("menu-btn");
  const menu = document.getElementById("menu");
  if (mb && menu) {
    const close = () => { menu.classList.remove("open"); mb.setAttribute("aria-expanded", "false"); };
    mb.addEventListener("click", () => {
      const open = menu.classList.toggle("open");
      mb.setAttribute("aria-expanded", String(open));
    });
    menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", close));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
  }

  /* ---- Active nav link on scroll ---- */
  const links = [...document.querySelectorAll("#menu a[href^='#']")];
  if ("IntersectionObserver" in window && links.length) {
    const map = new Map(links.map((a) => [a.getAttribute("href").slice(1), a]));
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          links.forEach((l) => l.removeAttribute("aria-current"));
          const a = map.get(en.target.id); if (a) a.setAttribute("aria-current", "true");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    map.forEach((_, id) => { const s = document.getElementById(id); if (s) spy.observe(s); });
  }

  /* ---- Scroll reveal ---- */
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const items = document.querySelectorAll(".reveal");
  if (reduce || !("IntersectionObserver" in window)) items.forEach((i) => i.classList.add("in"));
  else {
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    }), { threshold: 0.12 });
    items.forEach((i) => io.observe(i));
  }

  /* ---- Lightbox (Esc, arrows, focus trap) ---- */
  const lb = document.getElementById("lightbox");
  if (lb) {
    const thumbs = [...document.querySelectorAll(".gal button")];
    const img = lb.querySelector("img");
    const cap = lb.querySelector("p");
    const btnClose = lb.querySelector(".close");
    const btnPrev = lb.querySelector(".prev");
    const btnNext = lb.querySelector(".next");
    let idx = 0, opener = null;

    const show = (i) => {
      idx = (i + thumbs.length) % thumbs.length;
      const t = thumbs[idx];
      img.src = t.dataset.full; img.alt = t.dataset.alt || "";
      cap.textContent = t.dataset.cap || "";
    };
    const open = (i, from) => {
      opener = from; show(i); lb.classList.add("open");
      document.body.style.overflow = "hidden"; btnClose.focus();
    };
    const close = () => {
      lb.classList.remove("open"); document.body.style.overflow = "";
      if (opener) opener.focus();
    };
    thumbs.forEach((t, i) => t.addEventListener("click", () => open(i, t)));
    btnClose.addEventListener("click", close);
    btnPrev.addEventListener("click", () => show(idx - 1));
    btnNext.addEventListener("click", () => show(idx + 1));
    lb.addEventListener("click", (e) => { if (e.target === lb) close(); });
    document.addEventListener("keydown", (e) => {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") show(idx - 1);
      else if (e.key === "ArrowRight") show(idx + 1);
      else if (e.key === "Tab") {
        const f = [btnClose, btnPrev, btnNext];
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        else if (!f.includes(document.activeElement)) { e.preventDefault(); first.focus(); }
      }
    });
  }
})();
