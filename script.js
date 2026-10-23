const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];
const preloader = $("#preloader");
window.addEventListener("load", () => setTimeout(() => preloader.classList.add("done"), 700));

const header = $(".site-header");
const menuToggle = $("#menuToggle");
const nav = $("#siteNav");
menuToggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
});
$$("a", nav).forEach(link => link.addEventListener("click", () => {
  nav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
}));

const heroVideo = $("#heroVideo");
const heroMedia = $("#heroMedia");
const revealVideo = () => {
  heroVideo.classList.add("ready");
  heroMedia.classList.add("has-video");
};
heroVideo.addEventListener("playing", revealVideo);
heroVideo.addEventListener("error", () => {
  heroVideo.classList.remove("ready");
  heroMedia.classList.remove("has-video");
});
heroVideo.play().catch(() => { /* Poster remains visible if autoplay is blocked. */ });

const modal = $("#filmModal");
const modalVideo = $("#modalVideo");
const modalFallback = $("#modalFallback");
function openFilm() {
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  if (modalVideo.readyState >= 2) {
    modalVideo.play().catch(() => {});
  } else {
    modalFallback.classList.add("show");
  }
}
function closeFilm() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  modalVideo.pause();
}
$("#openFilm").addEventListener("click", openFilm);
$("#closeFilm").addEventListener("click", closeFilm);
modal.addEventListener("click", e => { if (e.target === modal) closeFilm(); });
document.addEventListener("keydown", e => { if (e.key === "Escape") closeFilm(); });
modalVideo.addEventListener("loadeddata", () => modalFallback.classList.remove("show"));
modalVideo.addEventListener("error", () => modalFallback.classList.add("show"));

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: .13 });
$$(".reveal").forEach(el => revealObserver.observe(el));

const sectionLinks = $$(".site-nav a");
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      sectionLinks.forEach(link => link.classList.toggle("active", link.hash === "#" + entry.target.id));
    }
  });
}, { rootMargin: "-40% 0px -50% 0px" });
["home", "about", "collections", "process", "journal"].forEach(id => {
  const section = document.getElementById(id);
  if (section) sectionObserver.observe(section);
});

let lastScroll = 0;
window.addEventListener("scroll", () => {
  const y = window.scrollY;
  header.classList.toggle("scrolled", y > 45);
  if (heroMedia && y < window.innerHeight) {
    heroMedia.style.setProperty("--scroll-shift", `${y * .16}px`);
  }
  lastScroll = y;
}, { passive: true });
document.getElementById("year").textContent = new Date().getFullYear();
