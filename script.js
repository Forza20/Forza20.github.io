(function () {
  "use strict";

  document.documentElement.classList.add("js");

  /* ------------------------------------------------------------------
     E-mail: the address is assembled here so it never appears as plain
     text in the HTML source. Change it via data-user / data-domain in
     index.html.
     ------------------------------------------------------------------ */
  document.querySelectorAll(".js-email").forEach(function (link) {
    var address = link.dataset.user + "@" + link.dataset.domain;
    link.href = "mailto:" + address;
    link.setAttribute("aria-label", "Send an e-mail to " + address);
    link.title = address;
  });

  /* ------------------------------------------------------------------
     Footer year
     ------------------------------------------------------------------ */
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  /* ------------------------------------------------------------------
     Header border once the page is scrolled
     ------------------------------------------------------------------ */
  var header = document.querySelector(".site-header");
  function onScroll() {
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ------------------------------------------------------------------
     Fade-in on scroll
     ------------------------------------------------------------------ */
  var reveals = document.querySelectorAll(".reveal");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduceMotion || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.1 });
    reveals.forEach(function (el) { observer.observe(el); });
  }

  /* ------------------------------------------------------------------
     Game embed: loading state, availability check and fallback
     ------------------------------------------------------------------ */
  var game = document.getElementById("game");
  if (game) {
    var src = game.dataset.src;
    var iframe = game.querySelector("iframe");
    var fallback = game.querySelector(".game__fallback");
    var loaded = false;

    function showError() {
      if (loaded) return;
      game.classList.add("is-error");
      fallback.hidden = false;
    }
    function showLoaded() {
      loaded = true;
      game.classList.remove("is-error");
      game.classList.add("is-loaded");
      fallback.hidden = true;
    }

    // A cross-origin iframe fires "load" even for a 404 page, so check
    // that the game URL actually responds before trusting the load event.
    // The timeout only shows the fallback; a slow load still replaces it.
    var timeout = setTimeout(showError, 15000);
    var reachable = window.fetch
      ? fetch(src, { method: "HEAD", cache: "no-store" })
          .then(function (res) { return res.ok; })
          .catch(function () { return false; })
      : Promise.resolve(true);

    reachable.then(function (ok) {
      if (!ok) { clearTimeout(timeout); iframe.hidden = true; showError(); return; }
      iframe.addEventListener("load", function () {
        clearTimeout(timeout);
        showLoaded();
      });
      iframe.addEventListener("error", function () {
        clearTimeout(timeout);
        showError();
      });
      iframe.src = src;
    });
  }

  /* ------------------------------------------------------------------
     Full screen: use the Fullscreen API on the iframe, otherwise open
     the game in a new tab (e.g. iPhone Safari).
     ------------------------------------------------------------------ */
  var fsButton = document.getElementById("fullscreen-btn");
  if (fsButton && game) {
    fsButton.addEventListener("click", function () {
      var frame = game.querySelector("iframe");
      var request = frame.requestFullscreen || frame.webkitRequestFullscreen;
      var canFullscreen = request && game.classList.contains("is-loaded") &&
        (document.fullscreenEnabled || document.webkitFullscreenEnabled);

      if (canFullscreen) {
        var result = request.call(frame);
        if (result && result.catch) {
          result.catch(function () { window.open(game.dataset.src, "_blank", "noopener"); });
        }
      } else {
        window.open(game.dataset.src, "_blank", "noopener");
      }
    });
  }
})();
