(function () {
  "use strict";

  document.documentElement.classList.add("js");

  /* ------------------------------------------------------------------
     E-mail: the address is assembled here so it never appears as plain
     text in the HTML source. Change it via data-user / data-domain in
     index.html.
     ------------------------------------------------------------------ */
  var emailLinks = document.querySelectorAll(".js-email");
  emailLinks.forEach(function (link) {
    var address = link.dataset.user + "@" + link.dataset.domain;
    link.href = "mailto:" + address;
    // Webmail handlers (Outlook.com, Gmail) open in a new tab instead of replacing the site
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.setAttribute("aria-label", "Send an e-mail to " + address);
    link.title = address;
    link.hidden = false;
  });

  /* ------------------------------------------------------------------
     Contact section: show the address and a "Copy e-mail" button
     ------------------------------------------------------------------ */
  var contactAddress = emailLinks.length
    ? emailLinks[0].dataset.user + "@" + emailLinks[0].dataset.domain
    : "";
  var addressText = document.querySelector(".js-email-text");
  if (addressText && contactAddress) {
    addressText.textContent = contactAddress;
    addressText.hidden = false;
  }

  var copyButton = document.getElementById("copy-email");
  var copyStatus = document.getElementById("copy-status");
  if (copyButton && contactAddress) {
    var copyLabel = copyButton.querySelector(".js-copy-label");
    var resetTimer;

    function copyFallback(text) {
      var field = document.createElement("textarea");
      field.value = text;
      field.setAttribute("readonly", "");
      field.style.position = "absolute";
      field.style.left = "-9999px";
      document.body.append(field);
      field.select();
      var ok = false;
      try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
      field.remove();
      return ok ? Promise.resolve() : Promise.reject();
    }

    copyButton.addEventListener("click", function () {
      var copy = navigator.clipboard && window.isSecureContext
        ? navigator.clipboard.writeText(contactAddress)
        : copyFallback(contactAddress);

      copy
        .then(function () {
          copyLabel.textContent = "Copied!";
          copyStatus.textContent = "E-mail address copied to the clipboard.";
        })
        .catch(function () {
          copyLabel.textContent = "Copy e-mail";
          copyStatus.textContent = "Couldn't copy automatically. The address is " + contactAddress + ".";
        });

      clearTimeout(resetTimer);
      resetTimer = setTimeout(function () {
        copyLabel.textContent = "Copy e-mail";
        copyStatus.textContent = "";
      }, 4000);
    });
    copyButton.hidden = false;
  }

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
     Visitor split (percentages only), updated daily by the
     "Update visitor stats" GitHub Action. Stays hidden if missing.
     ------------------------------------------------------------------ */
  var visitors = document.getElementById("visitors");
  if (visitors && window.fetch) {
    fetch("assets/visitor-stats.json", { cache: "no-cache" })
      .then(function (res) { if (!res.ok) throw new Error(res.status); return res.json(); })
      .then(function (data) {
        if (!data.enough) {
          visitors.querySelector(".visitors__grid").hidden = true;
          visitors.querySelector(".visitors__empty").hidden = false;
        } else {
          visitors.querySelectorAll("[data-stat]").forEach(function (list) {
            (data[list.dataset.stat] || []).forEach(function (item) {
              var li = document.createElement("li");
              var row = document.createElement("div");
              var name = document.createElement("span");
              var value = document.createElement("span");
              var bar = document.createElement("div");
              var fill = document.createElement("span");
              row.className = "stat__row";
              name.className = "stat__name";
              value.className = "stat__value";
              bar.className = "stat__bar";
              bar.setAttribute("aria-hidden", "true");
              name.textContent = item.name;
              name.title = item.name;
              value.textContent = item.percent + "%";
              fill.style.width = Math.min(100, item.percent) + "%";
              row.append(name, value);
              bar.append(fill);
              li.append(row, bar);
              list.append(li);
            });
          });
        }
        visitors.hidden = false;
      })
      .catch(function () { /* no stats file: keep the section hidden */ });
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
