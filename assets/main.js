(function () {
  "use strict";

  var reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  /* ---- 1. Sticky navbar: add .scrolled past 40px ---- */
  var navbar = document.querySelector(".navbar");
  if (navbar) {
    var onScroll = function () {
      navbar.classList.toggle("scrolled", window.scrollY > 40);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---- 2. Animated counters ---- */
  var counters = document.querySelectorAll("[data-count]");

  function animateCounter(el) {
    var target = parseFloat(el.getAttribute("data-count")) || 0;
    var suffix = el.getAttribute("data-suffix") || "";
    var duration = 1600;

    if (reduceMotion) {
      el.textContent = target + suffix;
      return;
    }

    var start = null;
    function step(timestamp) {
      if (start === null) start = timestamp;
      var progress = Math.min((timestamp - start) / duration, 1);
      // easeOutCubic
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target + suffix;
      }
    }
    requestAnimationFrame(step);
  }

  if (counters.length) {
    if ("IntersectionObserver" in window) {
      var observer = new IntersectionObserver(
        function (entries, obs) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              animateCounter(entry.target);
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.4 },
      );
      counters.forEach(function (c) {
        observer.observe(c);
      });
    } else {
      counters.forEach(animateCounter);
    }
  }

  /* ---- 3. Contact form validation (Bootstrap-style) ---- */
  var forms = document.querySelectorAll(".needs-validation");
  forms.forEach(function (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var success = form.querySelector("#formSuccess");
      if (!form.checkValidity()) {
        form.classList.add("was-validated");
        if (success) success.classList.add("d-none");
        return;
      }
      form.classList.remove("was-validated");
      form.reset();
      if (success) {
        success.classList.remove("d-none");
        success.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
  });

  /* ---- 4. Footer live date ---- */
  var now = new Date();
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = now.getFullYear();
  var dateEl = document.getElementById("currentDate");
  if (dateEl) {
    dateEl.textContent = now.toLocaleDateString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
})();
