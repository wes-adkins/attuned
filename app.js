/* Attuned Homepage interactions
   - Scroll reveal
   - Active nav highlighting on scroll
   - Subtle logo behavior + compare-logo fade
   - Mobile nav collapse on link click
   - Footer year
*/

(function () {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Elements
  const navbar = document.querySelector(".navbar");
  const compareSection = document.querySelector(".attuned-compare");
  const revealEls = Array.from(document.querySelectorAll(".reveal"));
  const navLinks = Array.from(document.querySelectorAll("[data-nav]"));
  const sectionIds = navLinks.map(l => l.getAttribute("data-nav")).filter(Boolean);

  // --- Navbar scroll state ---
  function updateNavbar() {
    if (!navbar) return;
    const scrolled = window.scrollY > 12;
    navbar.classList.toggle("is-scrolled", scrolled);
  }
  updateNavbar();
  window.addEventListener("scroll", updateNavbar, { passive: true });

  // --- Active nav state ---
  function setActive(id) {
    navLinks.forEach(a => {
      a.classList.toggle("active", a.getAttribute("data-nav") === id);
    });
  }

  // --- Scroll reveal + active-state observer ---
  if (!prefersReduced && "IntersectionObserver" in window) {
    const revealObs = new IntersectionObserver(
      entries => {
        for (const e of entries) {
          if (e.isIntersecting) e.target.classList.add("is-visible");
        }
      },
      { threshold: 0.18 }
    );

    revealEls.forEach(el => revealObs.observe(el));

    // Compare logos fade: toggle class on section itself
    if (compareSection) {
      const compareObs = new IntersectionObserver(
        entries => {
          for (const e of entries) {
            if (e.target !== compareSection) continue;
            compareSection.classList.toggle("is-visible", e.isIntersecting);
          }
        },
        { threshold: 0.25 }
      );
      compareObs.observe(compareSection);
    }

    // Active nav highlighting
    const sectionObs = new IntersectionObserver(
      entries => {
        // choose the most visible intersecting section
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visible) return;
        setActive(visible.target.id);
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0.08, 0.15, 0.22, 0.35] }
    );

    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (el) sectionObs.observe(el);
    }
  } else {
    // Reduced-motion fallback: reveal immediately
    revealEls.forEach(el => el.classList.add("is-visible"));
  }

  // Ensure a sane active state on load
  for (const id of sectionIds) {
    const el = document.getElementById(id);
    if (el) {
      setActive(id);
      break;
    }
  }

  // --- Close mobile nav after clicking a link ---
  const navCollapseEl = document.getElementById("attunedNav");
  const bsCollapse = navCollapseEl
    ? bootstrap.Collapse.getOrCreateInstance(navCollapseEl, { toggle: false })
    : null;

  document.querySelectorAll("#attunedNav a").forEach(a => {
    a.addEventListener("click", () => {
      if (!navCollapseEl || !bsCollapse) return;
      const isShown = navCollapseEl.classList.contains("show");
      if (isShown) bsCollapse.hide();
    });
  });
})();

// Footer year
(function () {
  const y = document.getElementById("year");
  if (y) y.textContent = String(new Date().getFullYear());
})();

// Lightweight "tests" (console assertions)
(function () {
  try {
    console.assert(document.querySelector(".navbar"), "Test failed: navbar missing");
    console.assert(document.getElementById("attunedNav"), "Test failed: #attunedNav missing");
    console.assert(document.getElementById("how"), "Test failed: #how section missing");
    console.assert(document.getElementById("snapshot"), "Test failed: #snapshot section missing");
    console.assert(document.getElementById("features"), "Test failed: #features section missing");
    console.assert(document.getElementById("demo"), "Test failed: #demo section missing");
  } catch (e) {
    // fail silently
  }
})();
