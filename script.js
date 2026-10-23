/* =====================================================
   ELISA COUTURE — 3D PORTFOLIO SCRIPT
   Vanilla JavaScript + Three.js
   ===================================================== */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const isTouchDevice =
    window.matchMedia("(hover: none)").matches;

  /* ---------- 1. Mobile Navigation ---------- */

  const menuToggle = document.querySelector(
    "[data-menu-toggle], .menu-toggle, .nav-toggle"
  );

  const navigation = document.querySelector(
    "[data-navigation], .nav-links, .main-nav"
  );

  if (menuToggle && navigation) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navigation.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navigation.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navigation.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- 2. Scroll Reveal ---------- */

  const revealElements = document.querySelectorAll(
    ".reveal, .reveal-up, .gallery-card, .collection-card, [data-reveal]"
  );

  if ("IntersectionObserver" in window && !prefersReducedMotion) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -35px 0px"
      }
    );

    revealElements.forEach((element, index) => {
      element.style.setProperty(
        "--reveal-delay",
        `${(index % 6) * 70}ms`
      );
      revealObserver.observe(element);
    });
  } else {
    revealElements.forEach((element) => {
      element.classList.add("is-visible");
    });
  }

  /* ---------- 3. 3D Gallery Cards ---------- */

  const galleryCards = document.querySelectorAll(
    ".gallery-card, .collection-card, [data-tilt]"
  );

  galleryCards.forEach((card) => {
    if (!card.hasAttribute("data-tilt")) {
      card.setAttribute("data-tilt", "");
    }

    card.style.transformStyle = "preserve-3d";

    const image = card.querySelector("img");

    if (image) {
      image.style.transition =
        "transform 500ms cubic-bezier(.2,.8,.2,1)";
    }

    if (prefersReducedMotion || isTouchDevice) return;

    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();

      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;

      const rotateY = (x - 0.5) * 14;
      const rotateX = (0.5 - y) * 14;

      card.style.setProperty("--pointer-x", `${x * 100}%`);
      card.style.setProperty("--pointer-y", `${y * 100}%`);

      card.style.transform =
        `perspective(1000px) rotateX(${rotateX}deg) ` +
        `rotateY(${rotateY}deg) translateY(-5px)`;

      if (image) {
        image.style.transform =
          `translateZ(22px) scale(1.045)`;
      }
    });

    card.addEventListener("pointerleave", () => {
      card.style.transform = "";

      if (image) {
        image.style.transform = "";
      }
    });
  });

  /* ---------- 4. Gallery Image Filters ---------- */

  const filterButtons = document.querySelectorAll(
    "[data-filter]"
  );

  const filterableCards = document.querySelectorAll(
    "[data-category]"
  );

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;

      filterButtons.forEach((item) => {
        const active = item === button;
        item.classList.toggle("active", active);
        item.setAttribute("aria-pressed", String(active));
      });

      filterableCards.forEach((card) => {
        const category = card.dataset.category;

        const show =
          filter === "all" ||
          filter === "*" ||
          category === filter;

        card.hidden = !show;
      });
    });
  });

  /* ---------- 5. Image Lightbox ---------- */

  let lightbox = document.querySelector("#elisa-lightbox");

  if (!lightbox) {
    lightbox = document.createElement("div");
    lightbox.id = "elisa-lightbox";
    lightbox.className = "elisa-lightbox";
    lightbox.setAttribute("role", "dialog");
    lightbox.setAttribute("aria-modal", "true");
    lightbox.setAttribute("aria-label", "Fashion image preview");
    lightbox.hidden = true;

    lightbox.innerHTML = `
      <button class="lightbox-close" type="button"
        aria-label="Close image preview">&times;</button>
      <button class="lightbox-prev" type="button"
        aria-label="Previous image">&#10094;</button>
      <figure class="lightbox-figure">
        <img class="lightbox-image" alt="">
        <figcaption class="lightbox-caption"></figcaption>
      </figure>
      <button class="lightbox-next" type="button"
        aria-label="Next image">&#10095;</button>
    `;

    document.body.appendChild(lightbox);
  }

  const lightboxImage = lightbox.querySelector(".lightbox-image");
  const lightboxCaption = lightbox.querySelector(".lightbox-caption");
  const closeButton = lightbox.querySelector(".lightbox-close");
  const previousButton = lightbox.querySelector(".lightbox-prev");
  const nextButton = lightbox.querySelector(".lightbox-next");

  let currentImageIndex = 0;
  let previousFocus = null;

  function getGalleryImages() {
    return Array.from(
      document.querySelectorAll(
        ".gallery-card img, .collection-card img, [data-lightbox] img"
      )
    ).filter((img) => {
      const card = img.closest("[data-category]");
      return !card || !card.hidden;
    });
  }

  function showLightboxImage(index) {
    const images = getGalleryImages();
    if (!images.length) return;

    currentImageIndex =
      (index + images.length) % images.length;

    const image = images[currentImageIndex];

    lightboxImage.src = image.currentSrc || image.src;
    lightboxImage.alt = image.alt || "ELISA fashion design";

    const card = image.closest(
      ".gallery-card, .collection-card, [data-lightbox]"
    );

    const title = card
      ? card.querySelector("h2, h3, .card-title")
      : null;

    lightboxCaption.textContent =
      title?.textContent?.trim() || image.alt || "ELISA Collection";
  }

  function openLightbox(image) {
    const images = getGalleryImages();
    const index = images.indexOf(image);

    if (index < 0) return;

    previousFocus = document.activeElement;
    showLightboxImage(index);

    lightbox.hidden = false;
    document.body.classList.add("lightbox-open");
    closeButton.focus();
  }

  function closeLightbox() {
    lightbox.hidden = true;
    document.body.classList.remove("lightbox-open");

    if (previousFocus && typeof previousFocus.focus === "function") {
      previousFocus.focus();
    }
  }

  document.querySelectorAll(
    ".gallery-card img, .collection-card img, [data-lightbox] img"
  ).forEach((image) => {
    image.style.cursor = "zoom-in";
    image.addEventListener("click", () => openLightbox(image));
  });

  closeButton.addEventListener("click", closeLightbox);

  previousButton.addEventListener("click", () => {
    showLightboxImage(currentImageIndex - 1);
  });

  nextButton.addEventListener("click", () => {
    showLightboxImage(currentImageIndex + 1);
  });

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (event) => {
    if (lightbox.hidden) return;

    if (event.key === "Escape") closeLightbox();
    if (event.key === "ArrowLeft") {
      showLightboxImage(currentImageIndex - 1);
    }
    if (event.key === "ArrowRight") {
      showLightboxImage(currentImageIndex + 1);
    }
  });

  /* ---------- 6. Floating Motion ---------- */

  if (!prefersReducedMotion) {
    document.querySelectorAll(
      ".floating, [data-float]"
    ).forEach((element, index) => {
      element.animate(
        [
          { translate: "0 0" },
          { translate: `0 ${index % 2 ? -10 : 10}px` },
          { translate: "0 0" }
        ],
        {
          duration: 3200 + (index % 4) * 500,
          iterations: Infinity,
          easing: "ease-in-out",
          delay: index * 120
        }
      );
    });
  }

  /* ---------- 7. Three.js 3D Background ---------- */

  const canvas = document.querySelector(
    "#three-canvas, #webgl-background, canvas[data-three]"
  );

  async function initThreeScene() {
    if (!canvas || prefersReducedMotion) return;

    try {
      const THREE = await import(
        "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js"
      );

      const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true
      });

      renderer.setPixelRatio(
        Math.min(window.devicePixelRatio || 1, 1.7)
      );

      renderer.setSize(
        canvas.clientWidth || window.innerWidth,
        canvas.clientHeight || window.innerHeight,
        false
      );

      renderer.outputColorSpace = THREE.SRGBColorSpace;

      const scene = new THREE.Scene();

      const camera = new THREE.PerspectiveCamera(
        48,
        (canvas.clientWidth || window.innerWidth) /
          Math.max(1, canvas.clientHeight || window.innerHeight),
        0.1,
        100
      );

      camera.position.z = 8;

      scene.add(new THREE.AmbientLight(0xffffff, 1.6));

      const pinkLight = new THREE.PointLight(0xff4fa3, 45, 30);
      pinkLight.position.set(-3, 2, 4);
      scene.add(pinkLight);

      const blueLight = new THREE.PointLight(0x55eaff, 35, 30);
      blueLight.position.set(3, -2, 3);
      scene.add(blueLight);

      const group = new THREE.Group();
      scene.add(group);

      const knot = new THREE.Mesh(
        new THREE.TorusKnotGeometry(1.1, 0.28, 150, 18),
        new THREE.MeshPhysicalMaterial({
          color: 0xf16ba8,
          metalness: 0.72,
          roughness: 0.19,
          clearcoat: 1,
          transparent: true,
          opacity: 0.72
        })
      );

      knot.position.set(2.3, 0.3, -1.5);
      group.add(knot);

      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(1.8, 0.018, 12, 160),
        new THREE.MeshBasicMaterial({
          color: 0x70eaff,
          transparent: true,
          opacity: 0.75
        })
      );

      ring.position.set(2.3, 0.3, -1.6);
      ring.rotation.x = 0.8;
      group.add(ring);

      const particleCount = 550;
      const positions = new Float32Array(particleCount * 3);

      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 15;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 9;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 9;
      }

      const particleGeometry = new THREE.BufferGeometry();
      particleGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
      );

      const particles = new THREE.Points(
        particleGeometry,
        new THREE.PointsMaterial({
          color: 0xffc7e5,
          size: 0.035,
          transparent: true,
          opacity: 0.8,
          sizeAttenuation: true
        })
      );

      scene.add(particles);

      let pointerX = 0;
      let pointerY = 0;
      let targetX = 0;
      let targetY = 0;
      let frameId = 0;
      let stopped = false;

      function onPointerMove(event) {
        targetX = (event.clientX / window.innerWidth - 0.5) * 0.5;
        targetY = (event.clientY / window.innerHeight - 0.5) * 0.35;
      }

      window.addEventListener("pointermove", onPointerMove, {
        passive: true
      });

      function resize() {
        const width = canvas.clientWidth || window.innerWidth;
        const height = canvas.clientHeight || window.innerHeight;

        camera.aspect = width / Math.max(1, height);
        camera.updateProjectionMatrix();
        renderer.setSize(width, height, false);
      }

      window.addEventListener("resize", resize);

      function animate() {
        if (stopped) return;

        frameId = requestAnimationFrame(animate);

        pointerX += (targetX - pointerX) * 0.035;
        pointerY += (targetY - pointerY) * 0.035;

        knot.rotation.x += 0.003;
        knot.rotation.y += 0.005;

        ring.rotation.z -= 0.0018;
        particles.rotation.y += 0.00025;

        camera.position.x +=
          (pointerX - camera.position.x) * 0.025;

        camera.position.y +=
          (-pointerY - camera.position.y) * 0.025;

        camera.lookAt(0, 0, 0);
        renderer.render(scene, camera);
      }

      animate();

      document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
          cancelAnimationFrame(frameId);
        } else if (!stopped) {
          animate();
        }
      });

      window.addEventListener("pagehide", () => {
        stopped = true;
        cancelAnimationFrame(frameId);
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("resize", resize);
        renderer.dispose();
        particleGeometry.dispose();
        particleGeometry.dispose();
        knot.geometry.dispose();
        knot.material.dispose();
        ring.geometry.dispose();
        ring.material.dispose();
      }, { once: true });

    } catch (error) {
      console.warn(
        "3D background unavailable; the rest of the portfolio will still work.",
        error
      );
      canvas.classList.add("three-fallback");
    }
  }

  initThreeScene();

  /* ---------- 8. Current Year ---------- */

  document.querySelectorAll("[data-current-year]").forEach((element) => {
    element.textContent = new Date().getFullYear();
  });

});
