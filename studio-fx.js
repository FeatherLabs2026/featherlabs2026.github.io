/* =========================================================
   KageCrest Studio — Comportements futuristes (studio-fx)
   Vanilla, autonome, défensif. N'interfère pas avec i18n.js
   ni les interactions roadmap de about.html.
   Juillet 2026
   ========================================================= */

(function () {
  "use strict";

  var reduceMotion = window.matchMedia
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

  var finePointer = window.matchMedia
    ? window.matchMedia("(pointer: fine)").matches
    : true;

  /* --------------------------------------------------------
     1. Reveal au scroll — auto-ciblage, zéro edit HTML.
     -------------------------------------------------------- */
  function setupReveal() {
    var selector = [
      ".section",
      ".featured-game",
      ".next-game-teaser",
      ".home-brand-showcase",
      ".cta-panel",
      ".roadmap-category",
      ".roadmap-item",
      ".feature-card",
      ".value-card",
      ".preset-card",
      ".progress-cards article",
      ".person-card",
      ".access-box",
      ".rm-node",
      ".rm-lane"
    ].join(",");

    var nodes = Array.prototype.slice.call(document.querySelectorAll(selector));
    if (!nodes.length) return;

    // Index d'escalier par groupe de frères directs.
    nodes.forEach(function (el) {
      if (el.hasAttribute("data-fx-reveal")) return;
      el.setAttribute("data-fx-reveal", "");
      var parent = el.parentElement;
      var i = 0;
      if (parent) {
        var sibs = parent.querySelectorAll(":scope > [data-fx-reveal]");
        i = Array.prototype.indexOf.call(sibs, el);
      }
      el.style.setProperty("--fx-i", Math.max(0, i % 6));
    });

    if (reduceMotion || !("IntersectionObserver" in window)) {
      nodes.forEach(function (el) { el.classList.add("is-revealed"); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-revealed");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });

    nodes.forEach(function (el) { io.observe(el); });
  }

  /* --------------------------------------------------------
     2. Barre de progression de scroll.
     -------------------------------------------------------- */
  function setupScrollProgress() {
    if (reduceMotion) return;
    var bar = document.createElement("div");
    bar.className = "fx-scroll-progress";
    document.body.appendChild(bar);

    var ticking = false;
    function update() {
      var doc = document.documentElement;
      var max = doc.scrollHeight - doc.clientHeight;
      var pct = max > 0 ? (doc.scrollTop || document.body.scrollTop) / max : 0;
      bar.style.width = (pct * 100).toFixed(2) + "%";
      ticking = false;
    }
    window.addEventListener("scroll", function () {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });
    update();
  }

  /* --------------------------------------------------------
     3. Boutons magnétiques (survol curseur, pointeur fin).
     -------------------------------------------------------- */
  function setupMagnetic() {
    if (reduceMotion || !finePointer) return;
    var buttons = document.querySelectorAll(".button-primary");
    Array.prototype.forEach.call(buttons, function (btn) {
      btn.classList.add("fx-magnetic");
      btn.addEventListener("mousemove", function (e) {
        var r = btn.getBoundingClientRect();
        var dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
        var dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
        btn.style.transform = "translate(" + (dx * 6).toFixed(1) + "px," + (dy * 6).toFixed(1) + "px)";
      });
      btn.addEventListener("mouseleave", function () {
        btn.style.transform = "";
      });
    });
  }

  /* --------------------------------------------------------
     4. Parallaxe douce du hero (selon la souris).
     -------------------------------------------------------- */
  function setupHeroParallax() {
    if (reduceMotion || !finePointer) return;
    var hero = document.querySelector(".page-hero");
    if (!hero) return;
    var raf = null;
    hero.addEventListener("mousemove", function (e) {
      if (raf) return;
      raf = window.requestAnimationFrame(function () {
        var r = hero.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        hero.style.backgroundPosition =
          (50 + x * 4).toFixed(2) + "% " + (35 + y * 4).toFixed(2) + "%";
        raf = null;
      });
    });
    hero.addEventListener("mouseleave", function () {
      hero.style.backgroundPosition = "";
    });
  }

  /* --------------------------------------------------------
     Init
     -------------------------------------------------------- */
  function init() {
    setupReveal();
    setupScrollProgress();
    setupMagnetic();
    setupHeroParallax();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
