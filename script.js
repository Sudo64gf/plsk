/* ═══════════════════════════════════════════
   HAMZA ROOT — script.js
   Author: HAMZA ROOT
   Description: Main JavaScript
═══════════════════════════════════════════ */

/* ──────────────────────────────────────────
   1. CUSTOM CURSOR
────────────────────────────────────────── */
(function initCursor() {
  const cursor = document.getElementById('cursor');
  const ring   = document.getElementById('cursorRing');
  if (!cursor || !ring) return;

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;

  // Update cursor dot position instantly
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  // Animate ring with lag
  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Hover effect on interactive elements
  const hoverTargets = document.querySelectorAll(
    'button, a, .project-card, .service-card, .stat-item, .footer-back-top'
  );

  hoverTargets.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hover');
      ring.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hover');
      ring.classList.remove('hover');
    });
  });

  // Hide cursor when it leaves the window
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    ring.style.opacity   = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    ring.style.opacity   = '0.5';
  });
})();


/* ──────────────────────────────────────────
   2. NAVBAR — SCROLL SHRINK + ACTIVE LINK
────────────────────────────────────────── */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  // Shrink navbar on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  // Highlight active nav link based on scroll position
  const sections = document.querySelectorAll('section[id], div[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  function updateActiveLink() {
    let current = '';
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.style.color = '';
      if (link.getAttribute('href') === '#' + current) {
        link.style.color = 'var(--text)';
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });
})();


/* ──────────────────────────────────────────
   3. MOBILE HAMBURGER MENU
────────────────────────────────────────── */
(function initMobileMenu() {
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('open');
  });

  // Close menu when a link is clicked
  document.querySelectorAll('.mobile-link').forEach((link) => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('open');
    });
  });
})();


/* ──────────────────────────────────────────
   4. SMOOTH SCROLL — DATA-SCROLL BUTTONS
────────────────────────────────────────── */
(function initSmoothScroll() {
  document.querySelectorAll('[data-scroll]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = document.getElementById(btn.dataset.scroll);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Back to top button
  const backTop = document.getElementById('backToTop');
  if (backTop) {
    backTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
})();


/* ──────────────────────────────────────────
   5. SCROLL REVEAL — INTERSECTION OBSERVER
────────────────────────────────────────── */
(function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger sibling elements
          const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal'));
          const index    = siblings.indexOf(entry.target);
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, index * 80);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  reveals.forEach((el) => observer.observe(el));
})();


/* ──────────────────────────────────────────
   6. COUNT-UP ANIMATION FOR STATS
────────────────────────────────────────── */
(function initCountUp() {
  const statItems = document.querySelectorAll('.stat-item');
  if (!statItems.length) return;

  function countUp(el, target, suffix) {
    let current  = 0;
    const steps  = 60;
    const step   = target / steps;
    const timer  = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(current) + suffix;
    }, 30);
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const numEl  = entry.target.querySelector('.stat-num');
          const target = parseInt(numEl.dataset.target, 10);
          const suffix = target === 100 ? '%' : '+';
          countUp(numEl, target, suffix);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );

  statItems.forEach((el) => observer.observe(el));
})();


/* ──────────────────────────────────────────
   7. CONTACT FORM — BASIC VALIDATION
────────────────────────────────────────── */
(function initContactForm() {
  const submitBtn  = document.getElementById('submitBtn');
  const formSuccess = document.getElementById('formSuccess');
  if (!submitBtn) return;

  submitBtn.addEventListener('click', () => {
    const name  = document.getElementById('nameInput')?.value.trim();
    const email = document.getElementById('emailInput')?.value.trim();
    const msg   = document.getElementById('msgInput')?.value.trim();

    // Simple validation
    if (!name || !email || !msg) {
      // Shake empty fields
      [nameInput, emailInput, msgInput].forEach((input) => {
        if (input && !input.value.trim()) {
          input.style.borderColor = 'var(--accent2)';
          setTimeout(() => {
            input.style.borderColor = '';
          }, 1200);
        }
      });
      return;
    }

    // Simulate send (replace with real API call if needed)
    submitBtn.innerHTML = '<span>Sending...</span>';
    submitBtn.disabled  = true;

    setTimeout(() => {
      submitBtn.style.display = 'none';
      if (formSuccess) formSuccess.classList.add('visible');

      // Reset after 4 seconds
      setTimeout(() => {
        submitBtn.style.display = '';
        submitBtn.innerHTML     = '<span>Send Message →</span>';
        submitBtn.disabled      = false;
        formSuccess.classList.remove('visible');
        document.getElementById('nameInput').value  = '';
        document.getElementById('emailInput').value = '';
        document.getElementById('msgInput').value   = '';
      }, 4000);
    }, 1200);
  });
})();


/* ──────────────────────────────────────────
   8. TICKER — PAUSE ON HOVER (CSS handles
      animation, JS ensures the track is
      duplicated if needed dynamically)
────────────────────────────────────────── */
(function initTicker() {
  const track = document.getElementById('tickerTrack');
  if (!track) return;
  // CSS animation handles the loop via duplication in HTML.
  // Nothing extra needed here — extensible for dynamic items.
})();


/* ──────────────────────────────────────────
   9. KEYBOARD ACCESSIBILITY
      (allow Enter/Space on custom buttons)
────────────────────────────────────────── */
(function initKeyboardA11y() {
  document.querySelectorAll('.btn-primary, .btn-secondary').forEach((btn) => {
    btn.setAttribute('role', 'button');
    btn.setAttribute('tabindex', '0');
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        btn.click();
      }
    });
  });
})();


/* ──────────────────────────────────────────
   10. CONSOLE EASTER EGG
────────────────────────────────────────── */
console.log(
  '%c HAMZA ROOT ',
  'background: #00ff88; color: #050508; font-size: 18px; font-weight: bold; padding: 8px 16px;'
);
console.log(
  '%c Developer • Bot Builder • AI Enthusiast',
  'color: #7b2fff; font-size: 13px; padding: 4px 0;'
);
console.log('%c Built with pure HTML, CSS & JS — no frameworks needed.', 'color: #555570;');
