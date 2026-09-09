const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const menuIcon = menuToggle?.querySelector("img");
const mainNav = document.querySelector(".main-nav");
const hero = document.querySelector(".hero");
const route = document.querySelector(".process-list");
const contact = document.querySelector(".floating-contact");
const footer = document.querySelector(".site-footer");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
const desktopNav = window.matchMedia("(min-width: 961px)");

function closeMenu(returnFocus = false) {
  if (!header || !menuToggle || !menuIcon) return;
  header.classList.remove("nav-open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Abrir menu");
  menuIcon.src = "/assets/icons/menu.svg";
  if (returnFocus) menuToggle.focus();
}

menuToggle?.addEventListener("click", () => {
  if (!header || !menuIcon) return;
  const isOpen = header.classList.toggle("nav-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
  menuIcon.src = isOpen ? "/assets/icons/x.svg" : "/assets/icons/menu.svg";
});

mainNav?.addEventListener("click", (event) => {
  const link = event.target.closest("a");
  if (!link) return;
  const wasOpen = header.classList.contains("nav-open");
  closeMenu();
  if (wasOpen) {
    const destination = document.querySelector(link.hash);
    destination?.setAttribute("tabindex", "-1");
    destination?.focus({ preventScroll: true });
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && header?.classList.contains("nav-open")) closeMenu(true);
});
document.addEventListener("click", (event) => {
  if (header && !header.contains(event.target)) closeMenu();
});
desktopNav.addEventListener("change", () => closeMenu());

// Native form navigation preserves popup handling and keeps sending under the visitor's control.
const finderForm = document.querySelector("#finder-form");
finderForm?.addEventListener("submit", () => {
  const use = document.querySelector("#car-use").value;
  const budget = document.querySelector("#car-budget").value;
  const payment = document.querySelector("#car-payment").value;
  finderForm.elements.text.value = [
    "Olá, TP Veículos! Quero que encontrem meu próximo carro.",
    "",
    "Meu objetivo: " + use,
    "Faixa de investimento: " + budget,
    "Forma de pagamento: " + payment,
    "",
    "Podemos conversar sobre as opções para esse perfil?"
  ].join("\n");
});

const year = document.querySelector("#year");
if (year) year.textContent = String(new Date().getFullYear());

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -36px 0px" });

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle("section-visible", entry.isIntersecting);
    });
  }, { threshold: 0.22, rootMargin: "-8% 0px -28% 0px" });

  document.querySelectorAll(".stagger-group").forEach((group) => {
    [...group.children].forEach((item, index) => {
      item.style.setProperty("--reveal-delay", Math.min(index % 6 * 95, 475) + "ms");
    });
  });
  document.querySelectorAll(".reveal").forEach((item) => revealObserver.observe(item));
  document.querySelectorAll(".section, .finder-section, .final-cta").forEach((section) => sectionObserver.observe(section));
  document.body.classList.add("enhanced");
}

let scrollFrame = 0;
const navLinks = mainNav ? [...mainNav.querySelectorAll("a")] : [];
const navSections = navLinks.map((link) => document.querySelector(link.hash));

function updateScroll() {
  scrollFrame = 0;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  header?.style.setProperty("--scroll", maxScroll > 0 ? window.scrollY / maxScroll : 0);
  header?.classList.toggle("scrolled", window.scrollY > 24);

  if (hero && footer && contact) {
    const heroRect = hero.getBoundingClientRect();
    const footerRect = footer.getBoundingClientRect();
    contact.classList.toggle("shown", heroRect.bottom < 90 && footerRect.top > window.innerHeight - 80);
  }

  if (route) {
    const routeRect = route.getBoundingClientRect();
    const routeProgress = Math.min(1, Math.max(0, (window.innerHeight * 0.8 - routeRect.top) / (routeRect.height * 0.75)));
    route.style.setProperty("--route-progress", reducedMotion.matches ? 1 : routeProgress);
  }

  let activeSection = -1;
  navSections.forEach((section, index) => {
    if (section && section.getBoundingClientRect().top <= 180) activeSection = index;
  });
  navLinks.forEach((link, index) => {
    if (index === activeSection) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  });
}

function requestScrollUpdate() {
  if (!scrollFrame) scrollFrame = window.requestAnimationFrame(updateScroll);
}
window.addEventListener("scroll", requestScrollUpdate, { passive: true });
window.addEventListener("resize", requestScrollUpdate, { passive: true });
window.addEventListener("load", requestScrollUpdate);
updateScroll();

let pointerFrame = 0;
let pointerX = 0;
let pointerY = 0;
hero?.addEventListener("pointermove", (event) => {
  if (reducedMotion.matches || !finePointer.matches) return;
  const rect = hero.getBoundingClientRect();
  pointerX = (event.clientX - rect.left) / rect.width - 0.5;
  pointerY = (event.clientY - rect.top) / rect.height - 0.5;
  if (pointerFrame) return;
  pointerFrame = window.requestAnimationFrame(() => {
    hero.style.setProperty("--mx", pointerX * -12 + "px");
    hero.style.setProperty("--my", pointerY * -8 + "px");
    pointerFrame = 0;
  });
}, { passive: true });

function resetHeroMotion() {
  window.cancelAnimationFrame(pointerFrame);
  pointerFrame = 0;
  hero?.style.setProperty("--mx", "0px");
  hero?.style.setProperty("--my", "0px");
}
hero?.addEventListener("pointerleave", resetHeroMotion);
reducedMotion.addEventListener("change", () => {
  resetHeroMotion();
  requestScrollUpdate();
});

document.querySelectorAll(".faq-list details").forEach((detail) => {
  detail.addEventListener("toggle", () => {
    if (!detail.open || reducedMotion.matches) return;
    detail.querySelector(".faq-answer").animate(
      [{ opacity: 0, transform: "translateY(-5px)" }, { opacity: 1, transform: "translateY(0)" }],
      { duration: 280, easing: "cubic-bezier(.22,1,.36,1)" }
    );
  });
});
