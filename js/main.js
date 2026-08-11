/* ==========================================================================
   BIVENRA RESORT — main.js
   Small, dependency-free behaviours. Each block is self-contained and exits
   quietly if its markup is not on the page.
   ========================================================================== */

(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* ----------------------------------------------------------------------
     1. Current year in the footer
     ---------------------------------------------------------------------- */
  (function year() {
    var slot = document.querySelector("[data-year]");
    if (slot) slot.textContent = String(new Date().getFullYear());
  })();

  /* ----------------------------------------------------------------------
     2. Header: swap to the solid state once the hero has scrolled past
     ---------------------------------------------------------------------- */
  (function header() {
    var el = document.querySelector("[data-header]");
    if (!el) return;

    var threshold = window.innerHeight * 0.7;

    function update() {
      // While the dark full-screen menu is open the header sits on top of it,
      // so it has to stay light-on-dark whatever the scroll position is.
      if (document.body.getAttribute("data-menu-open") === "true") {
        el.classList.remove("is-stuck");
        el.classList.add("is-inverse");
        return;
      }
      var stuck = window.scrollY > threshold;
      el.classList.toggle("is-stuck", stuck);
      el.classList.toggle("is-inverse", !stuck);
    }

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", function () {
      threshold = window.innerHeight * 0.7;
      update();
    });
    update();
  })();

  /* ----------------------------------------------------------------------
     3. Full-screen menu on small screens
     ---------------------------------------------------------------------- */
  (function menu() {
    var toggle = document.querySelector("[data-menu-toggle]");
    var panel = document.querySelector("[data-menu]");
    if (!toggle || !panel) return;

    var label = toggle.querySelector("[data-menu-label]");
    panel.removeAttribute("hidden");

    function setOpen(open) {
      panel.setAttribute("data-open", String(open));
      toggle.setAttribute("aria-expanded", String(open));
      document.body.setAttribute("data-menu-open", String(open));
      if (label) label.textContent = open ? "Close" : "Menu";

      // Let the header module re-evaluate its own light/dark state.
      window.dispatchEvent(new Event("scroll"));

      if (open) {
        var first = panel.querySelector("a");
        if (first) first.focus();
      }
    }

    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });

    panel.addEventListener("click", function (event) {
      if (event.target.closest("a")) setOpen(false);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && panel.getAttribute("data-open") === "true") {
        setOpen(false);
        toggle.focus();
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth >= 992) setOpen(false);
    });
  })();

  /* ----------------------------------------------------------------------
     4. Tabs — "What we offer"
     ---------------------------------------------------------------------- */
  (function tabs() {
    document.querySelectorAll("[data-tabs]").forEach(function (root) {
      var tabList = root.querySelector('[role="tablist"]');
      if (!tabList) return;

      var tabButtons = Array.prototype.slice.call(
        tabList.querySelectorAll('[role="tab"]')
      );

      function select(index, moveFocus) {
        tabButtons.forEach(function (tab, i) {
          var selected = i === index;
          var panel = document.getElementById(tab.getAttribute("aria-controls"));
          tab.setAttribute("aria-selected", String(selected));
          tab.setAttribute("tabindex", selected ? "0" : "-1");
          if (panel) panel.hidden = !selected;
        });
        if (moveFocus) tabButtons[index].focus();
      }

      tabButtons.forEach(function (tab, index) {
        tab.addEventListener("click", function () {
          select(index, false);
        });

        tab.addEventListener("keydown", function (event) {
          var last = tabButtons.length - 1;
          var next = null;

          if (event.key === "ArrowDown" || event.key === "ArrowRight") next = index === last ? 0 : index + 1;
          else if (event.key === "ArrowUp" || event.key === "ArrowLeft") next = index === 0 ? last : index - 1;
          else if (event.key === "Home") next = 0;
          else if (event.key === "End") next = last;

          if (next !== null) {
            event.preventDefault();
            select(next, true);
          }
        });
      });
    });
  })();

  /* ----------------------------------------------------------------------
     5. Accordion — FAQ
     ---------------------------------------------------------------------- */
  (function accordion() {
    document.querySelectorAll("[data-accordion]").forEach(function (root) {
      root.querySelectorAll(".accordion__trigger").forEach(function (trigger) {
        trigger.addEventListener("click", function () {
          var panel = document.getElementById(
            trigger.getAttribute("aria-controls")
          );
          var open = trigger.getAttribute("aria-expanded") === "true";
          trigger.setAttribute("aria-expanded", String(!open));
          if (panel) panel.setAttribute("data-open", String(!open));
        });
      });
    });
  })();

  /* ----------------------------------------------------------------------
     6. Carousel — guest reviews
     ---------------------------------------------------------------------- */
  (function carousel() {
    document.querySelectorAll("[data-carousel]").forEach(function (root) {
      var track = root.querySelector("[data-carousel-track]");
      if (!track) return;

      var viewport = root.querySelector(".carousel__viewport");
      var slides = Array.prototype.slice.call(track.children);
      var dotsHost = root.querySelector("[data-carousel-dots]");
      var prev = root.querySelector("[data-carousel-prev]");
      var next = root.querySelector("[data-carousel-next]");
      var index = 0;
      var dots = [];

      if (dotsHost) {
        slides.forEach(function (slide, i) {
          var dot = document.createElement("button");
          dot.type = "button";
          dot.className = "carousel__dot";
          dot.setAttribute("aria-label", "Review " + (i + 1));
          dot.addEventListener("click", function () {
            go(i);
          });
          dotsHost.appendChild(dot);
          dots.push(dot);
        });
      }

      // The viewport follows the height of the review on show, so a short
      // quote does not leave a hole where a long one used to be.
      function fitHeight() {
        if (viewport) viewport.style.height = slides[index].offsetHeight + "px";
      }

      function go(to) {
        index = (to + slides.length) % slides.length;
        track.style.transform = "translateX(" + -index * 100 + "%)";
        fitHeight();

        slides.forEach(function (slide, i) {
          var current = i === index;
          slide.setAttribute("aria-hidden", String(!current));
          if ("inert" in HTMLElement.prototype) slide.inert = !current;
        });

        dots.forEach(function (dot, i) {
          if (i === index) dot.setAttribute("aria-current", "true");
          else dot.removeAttribute("aria-current");
        });
      }

      if (prev) prev.addEventListener("click", function () { go(index - 1); });
      if (next) next.addEventListener("click", function () { go(index + 1); });

      root.addEventListener("keydown", function (event) {
        if (event.key === "ArrowLeft") { event.preventDefault(); go(index - 1); }
        if (event.key === "ArrowRight") { event.preventDefault(); go(index + 1); }
      });

      // Touch / pointer swipe
      var startX = null;
      root.addEventListener("pointerdown", function (event) {
        startX = event.clientX;
      });
      root.addEventListener("pointerup", function (event) {
        if (startX === null) return;
        var delta = event.clientX - startX;
        if (Math.abs(delta) > 48) go(delta < 0 ? index + 1 : index - 1);
        startX = null;
      });

      window.addEventListener("resize", fitHeight);
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(fitHeight);
      }

      go(0);
    });
  })();

  /* ----------------------------------------------------------------------
     7. Lightbox — gallery
     ---------------------------------------------------------------------- */
  (function lightbox() {
    var box = document.querySelector("[data-lightbox]");
    var gallery = document.querySelector("[data-gallery]");
    if (!box || !gallery) return;

    var image = box.querySelector("[data-lightbox-image]");
    var caption = box.querySelector("[data-lightbox-caption]");
    var closeBtn = box.querySelector("[data-lightbox-close]");
    var prevBtn = box.querySelector("[data-lightbox-prev]");
    var nextBtn = box.querySelector("[data-lightbox-next]");
    var buttons = Array.prototype.slice.call(
      gallery.querySelectorAll(".gallery__button")
    );
    var index = 0;
    var lastFocused = null;

    box.removeAttribute("hidden");

    function show(i) {
      index = (i + buttons.length) % buttons.length;
      var button = buttons[index];
      var img = button.querySelector("img");
      image.src = button.getAttribute("data-src");
      image.alt = img ? img.alt : "";
      caption.textContent =
        (button.getAttribute("data-caption") || "") +
        "  (" + (index + 1) + " of " + buttons.length + ")";
    }

    function open(i) {
      lastFocused = document.activeElement;
      show(i);
      box.setAttribute("data-open", "true");
      document.body.style.overflow = "hidden";
      closeBtn.focus();
    }

    function close() {
      box.setAttribute("data-open", "false");
      document.body.style.overflow = "";
      if (lastFocused) lastFocused.focus();
    }

    buttons.forEach(function (button, i) {
      button.addEventListener("click", function () {
        open(i);
      });
    });

    closeBtn.addEventListener("click", close);
    prevBtn.addEventListener("click", function () { show(index - 1); });
    nextBtn.addEventListener("click", function () { show(index + 1); });

    box.addEventListener("click", function (event) {
      if (event.target === box) close();
    });

    document.addEventListener("keydown", function (event) {
      if (box.getAttribute("data-open") !== "true") return;
      if (event.key === "Escape") close();
      if (event.key === "ArrowLeft") show(index - 1);
      if (event.key === "ArrowRight") show(index + 1);
      if (event.key === "Tab") {
        // Keep focus inside the dialog.
        var focusables = [closeBtn, prevBtn, nextBtn];
        var pos = focusables.indexOf(document.activeElement);
        event.preventDefault();
        var step = event.shiftKey ? -1 : 1;
        focusables[(pos + step + focusables.length) % focusables.length].focus();
      }
    });
  })();

  /* ----------------------------------------------------------------------
     8. Reveal on scroll
     ---------------------------------------------------------------------- */
  (function reveal() {
    var items = document.querySelectorAll(".reveal");
    if (!items.length) return;

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      items.forEach(function (item) { item.classList.add("is-visible"); });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 }
    );

    items.forEach(function (item) { observer.observe(item); });
  })();

  /* ----------------------------------------------------------------------
     9. Mark the nav link for the section in view
     ---------------------------------------------------------------------- */
  (function scrollspy() {
    var links = Array.prototype.slice.call(
      document.querySelectorAll(".nav__link")
    );
    if (!links.length || !("IntersectionObserver" in window)) return;

    var map = {};
    var sections = [];

    links.forEach(function (link) {
      var id = link.getAttribute("href").slice(1);
      var section = document.getElementById(id);
      if (!section) return;
      map[id] = link;
      sections.push(section);
    });

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          links.forEach(function (link) { link.removeAttribute("aria-current"); });
          var link = map[entry.target.id];
          if (link) link.setAttribute("aria-current", "true");
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );

    sections.forEach(function (section) { observer.observe(section); });
  })();
})();
