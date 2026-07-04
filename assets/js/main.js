// Goodland Blue Mist Resorts — site interactions
(function () {
  "use strict";

  const WA_NUMBER = "918848358030";

  /* ---------- Preloader ---------- */
  window.addEventListener("load", () => {
    const pre = document.getElementById("preloader");
    if (pre) setTimeout(() => pre.classList.add("hide"), 350);
  });

  /* ---------- Header scroll state ---------- */
  const header = document.querySelector("header");
  const onScroll = () => {
    if (!header) return;
    if (window.scrollY > 40) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  };
  document.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile nav ---------- */
  const burger = document.querySelector(".burger");
  const mobileNav = document.querySelector(".mobile-nav");
  const toggleMobileNav = (force) => {
    if (!burger || !mobileNav) return;
    const open = force !== undefined ? force : !mobileNav.classList.contains("open");
    burger.classList.toggle("open", open);
    mobileNav.classList.toggle("open", open);
    document.body.style.overflow = open ? "hidden" : "";
  };
  if (burger && mobileNav) {
    burger.addEventListener("click", () => toggleMobileNav());
    mobileNav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => toggleMobileNav(false)));
  }

  /* ---------- Bottom app tab bar: "Menu" opens the same mobile nav overlay ---------- */
  document.querySelectorAll(".tab-menu-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      toggleMobileNav();
    });
  });

  /* ---------- Active nav link on scroll ---------- */
  const navLinks = document.querySelectorAll("nav.primary-nav a[href^='#'], .app-tabbar a.tab-link[href^='#']");
  const sections = Array.from(navLinks)
    .map((l) => {
      const href = l.getAttribute("href");
      return href.length > 1 ? document.querySelector(href) : null;
    })
    .filter(Boolean);
  if (sections.length) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = "#" + entry.target.id;
            navLinks.forEach((l) => l.classList.toggle("active", l.getAttribute("href") === id));
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => navObserver.observe(s));
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll(".reveal, .reveal-scale, .stagger");
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          if (entry.target.classList.contains("stagger")) {
            Array.from(entry.target.children).forEach((child, i) => {
              child.style.setProperty("--i", i);
              child.classList.add("reveal", "in");
            });
          }
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  revealEls.forEach((el) => revealObserver.observe(el));

  /* ---------- Hero slideshow (Ken Burns crossfade) ---------- */
  const slides = document.querySelectorAll(".hero-slide");
  if (slides.length > 1) {
    let idx = 0;
    setInterval(() => {
      slides[idx].classList.remove("active");
      idx = (idx + 1) % slides.length;
      slides[idx].classList.add("active");
    }, 6000);
  }

  /* ---------- Animated counters ---------- */
  const counters = document.querySelectorAll("[data-count]");
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || "";
        const duration = 1600;
        const start = performance.now();
        const step = (now) => {
          const p = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          const val = target < 10 && target % 1 !== 0 ? (target * eased).toFixed(1) : Math.floor(target * eased);
          el.textContent = val + suffix;
          if (p < 1) requestAnimationFrame(step);
          else el.textContent = target + suffix;
        };
        requestAnimationFrame(step);
        counterObserver.unobserve(el);
      });
    },
    { threshold: 0.6 }
  );
  counters.forEach((c) => counterObserver.observe(c));

  /* ---------- Room tabs ---------- */
  const tabs = document.querySelectorAll(".room-tab");
  const panels = document.querySelectorAll(".room-panel");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      panels.forEach((p) => p.classList.remove("active"));
      tab.classList.add("active");
      document.getElementById(tab.dataset.target)?.classList.add("active");
    });
  });

  /* ---------- Lightbox ---------- */
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const galleryImgs = Array.from(document.querySelectorAll("[data-lightbox] img"));
  let currentIndex = 0;

  function openLightbox(i) {
    if (!lightbox || !lightboxImg || !galleryImgs[i]) return;
    currentIndex = i;
    lightboxImg.src = galleryImgs[i].src;
    lightboxImg.alt = galleryImgs[i].alt || "";
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  function closeLightbox() {
    lightbox?.classList.remove("open");
    document.body.style.overflow = "";
  }
  function showRelative(delta) {
    currentIndex = (currentIndex + delta + galleryImgs.length) % galleryImgs.length;
    lightboxImg.src = galleryImgs[currentIndex].src;
    lightboxImg.alt = galleryImgs[currentIndex].alt || "";
  }

  galleryImgs.forEach((img, i) => {
    img.closest("figure")?.addEventListener("click", () => openLightbox(i));
  });
  document.querySelector(".lightbox-close")?.addEventListener("click", closeLightbox);
  document.querySelector(".lightbox-nav.prev")?.addEventListener("click", () => showRelative(-1));
  document.querySelector(".lightbox-nav.next")?.addEventListener("click", () => showRelative(1));
  lightbox?.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (!lightbox?.classList.contains("open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") showRelative(1);
    if (e.key === "ArrowLeft") showRelative(-1);
  });

  /* ---------- Checkbox visual state ---------- */
  document.querySelectorAll(".checkbox-item").forEach((item) => {
    const input = item.querySelector("input");
    if (!input) return;
    const sync = () => item.classList.toggle("checked", input.checked);
    input.addEventListener("change", sync);
    sync();
  });

  /* ---------- Set date minimums ---------- */
  const checkinInput = document.getElementById("checkin");
  const checkoutInput = document.getElementById("checkout");
  if (checkinInput && checkoutInput) {
    const today = new Date().toISOString().split("T")[0];
    checkinInput.min = today;
    checkoutInput.min = today;
    checkinInput.addEventListener("change", () => {
      checkoutInput.min = checkinInput.value;
      if (checkoutInput.value && checkoutInput.value < checkinInput.value) {
        checkoutInput.value = checkinInput.value;
      }
    });
  }

  /* ---------- Booking form -> WhatsApp ---------- */
  const bookingForm = document.getElementById("booking-form");
  if (bookingForm) {
    bookingForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = bookingForm.querySelector("#name")?.value.trim();
      const phone = bookingForm.querySelector("#phone")?.value.trim();
      const checkin = bookingForm.querySelector("#checkin")?.value;
      const checkout = bookingForm.querySelector("#checkout")?.value;
      const guests = bookingForm.querySelector("#guests")?.value;
      const roomType = bookingForm.querySelector("#roomType")?.value;
      const message = bookingForm.querySelector("#message")?.value.trim();
      const addons = Array.from(bookingForm.querySelectorAll("input[name='addon']:checked")).map(
        (el) => el.value
      );

      if (!name || !phone || !checkin || !checkout) {
        bookingForm.reportValidity?.();
        return;
      }

      const lines = [
        "*New Booking Enquiry — Goodland Blue Mist Resorts*",
        "",
        `*Name:* ${name}`,
        `*Phone:* ${phone}`,
        `*Check-in:* ${formatDate(checkin)}`,
        `*Check-out:* ${formatDate(checkout)}`,
        `*Guests:* ${guests || "-"}`,
        `*Room Type:* ${roomType || "-"}`,
      ];
      if (addons.length) lines.push(`*Add-ons:* ${addons.join(", ")}`);
      if (message) {
        lines.push("");
        lines.push(`*Message:* ${message}`);
      }

      const text = encodeURIComponent(lines.join("\n"));
      const url = `https://wa.me/${WA_NUMBER}?text=${text}`;

      const successBox = document.getElementById("form-success");
      if (successBox) successBox.classList.add("show");

      window.open(url, "_blank", "noopener");
    });
  }

  function formatDate(iso) {
    if (!iso) return "-";
    const d = new Date(iso + "T00:00:00");
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  }

  /* ---------- Quick WhatsApp CTA buttons with preset text ---------- */
  document.querySelectorAll("[data-wa-cta]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const preset = btn.dataset.waCta || "Hi Goodland Blue Mist Resorts, I'd like to know more about your packages.";
      window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(preset)}`, "_blank", "noopener");
    });
  });

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
