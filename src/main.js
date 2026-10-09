const AUTOPLAY_MS = 5500;

function initCarousel() {
  const root = document.querySelector("[data-carousel]");
  if (!root) return;

  const slides = [...root.querySelectorAll(".carousel__slide")];
  const dotsWrap = root.querySelector("[data-carousel-dots]");
  const prevBtn = root.querySelector("[data-carousel-prev]");
  const nextBtn = root.querySelector("[data-carousel-next]");
  if (!slides.length || !dotsWrap) return;

  let index = slides.findIndex((s) => s.classList.contains("is-active"));
  if (index < 0) index = 0;
  let timer = null;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  slides.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "carousel__dot";
    dot.setAttribute("role", "tab");
    dot.setAttribute("aria-label", `Show photo ${i + 1}`);
    dot.addEventListener("click", () => goTo(i));
    dotsWrap.appendChild(dot);
  });

  const dots = [...dotsWrap.querySelectorAll(".carousel__dot")];

  function goTo(next) {
    index = (next + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      slide.classList.toggle("is-active", i === index);
    });
    dots.forEach((dot, i) => {
      dot.setAttribute("aria-selected", i === index ? "true" : "false");
    });
    restartAutoplay();
  }

  function restartAutoplay() {
    if (reduceMotion) return;
    clearInterval(timer);
    timer = setInterval(() => goTo(index + 1), AUTOPLAY_MS);
  }

  prevBtn?.addEventListener("click", () => goTo(index - 1));
  nextBtn?.addEventListener("click", () => goTo(index + 1));

  root.addEventListener("pointerenter", () => clearInterval(timer));
  root.addEventListener("pointerleave", restartAutoplay);

  goTo(index);
}

function initReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18, rootMargin: "0px 0px -8% 0px" },
  );

  items.forEach((el) => observer.observe(el));
}

function initHeader() {
  const header = document.querySelector(".site-header");
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  };

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

function initYear() {
  const el = document.querySelector("[data-year]");
  if (el) el.textContent = String(new Date().getFullYear());
}

initCarousel();
initReveal();
initHeader();
initYear();
