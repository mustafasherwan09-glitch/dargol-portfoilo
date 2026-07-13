/**
 * DARGOL LOGISTICS — Main JavaScript
 * Handles: Navbar scroll, Side menu, Animations, Counter, Testimonials, Tracking, Particles
 */

'use strict';

/* ═══════════════════════════════════════════════
   NAVBAR SCROLL BEHAVIOR
   ═══════════════════════════════════════════════ */
const navbar = document.getElementById('mainNavbar');

function handleNavbarScroll() {
  if (window.scrollY > 60) {
    navbar?.classList.add('scrolled');
  } else {
    navbar?.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', handleNavbarScroll, { passive: true });
handleNavbarScroll();

/* ═══════════════════════════════════════════════
   SIDE MENU
   ═══════════════════════════════════════════════ */
const sideMenu = document.getElementById('sideMenu');
const sideOverlay = document.getElementById('sideOverlay');

function openSideMenu() {
  sideMenu?.classList.add('is-open');
  sideOverlay?.classList.add('is-active');
  document.body.style.overflow = 'hidden';
}

function closeSideMenu() {
  sideMenu?.classList.remove('is-open');
  sideOverlay?.classList.remove('is-active');
  document.body.style.overflow = '';
}

// Close on Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeSideMenu();
});

/* ═══════════════════════════════════════════════
   BACK TO TOP
   ═══════════════════════════════════════════════ */
const backToTopBtn = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  if (backToTopBtn) {
    backToTopBtn.classList.toggle('is-visible', window.scrollY > 400);
  }
}, { passive: true });

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ═══════════════════════════════════════════════
   TOAST NOTIFICATION
   ═══════════════════════════════════════════════ */
let toastEl = null;
let toastTimer = null;

function showToast(message, icon = 'fa-circle-check') {
  if (!toastEl) {
    toastEl = document.createElement('div');
    toastEl.className = 'toast';
    document.body.appendChild(toastEl);
  }
  toastEl.innerHTML = `<i class="fa-solid ${icon}"></i> ${message}`;
  toastEl.classList.add('is-visible');

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('is-visible'), 3500);
}

/* ═══════════════════════════════════════════════
   ANIMATED COUNTER
   ═══════════════════════════════════════════════ */
function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-target'), 10);
  const duration = 2000;
  const step = target / (duration / 16);
  let current = 0;

  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = Math.floor(current).toLocaleString() + (target === 98 ? '%' : target === 7 ? '+' : '+');
    if (current >= target) clearInterval(timer);
  }, 16);
}

/* ═══════════════════════════════════════════════
   SCROLL REVEAL (Intersection Observer)
   ═══════════════════════════════════════════════ */
function initScrollReveal() {
  // Reveal elements
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

  // Counter elements
  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const numEl = entry.target.querySelector('[data-target]');
        if (numEl) animateCounter(numEl);
        counterObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat-card').forEach(el => counterObs.observe(el));
}

/* ═══════════════════════════════════════════════
   TESTIMONIAL CAROUSEL
   ═══════════════════════════════════════════════ */
let currentTestimonial = 0;
const testimonialCards = document.querySelectorAll('.testimonial-card');
const dotsContainer = document.getElementById('testDots');

function initTestimonials() {
  if (!testimonialCards.length || !dotsContainer) return;

  // On mobile, show only one at a time
  const isMobile = () => window.innerWidth < 768;
  const isTablet = () => window.innerWidth < 1024;

  function getVisible() {
    if (isMobile()) return 1;
    if (isTablet()) return 2;
    return 4;
  }

  // Create dots
  const totalDots = Math.ceil(testimonialCards.length / getVisible());
  dotsContainer.innerHTML = '';
  for (let i = 0; i < totalDots; i++) {
    const dot = document.createElement('span');
    dot.className = 'test-dot' + (i === 0 ? ' active' : '');
    dot.onclick = () => goToTestimonial(i);
    dotsContainer.appendChild(dot);
  }

  // On larger screens, show all cards in grid — carousel only on mobile
  if (!isMobile() && !isTablet()) return;

  // Hide all except visible set
  function showTestimonials() {
    const visible = getVisible();
    testimonialCards.forEach((card, idx) => {
      const show = idx >= currentTestimonial * visible && idx < (currentTestimonial + 1) * visible;
      card.style.display = show ? 'flex' : 'none';
    });
    document.querySelectorAll('.test-dot').forEach((d, i) => {
      d.classList.toggle('active', i === currentTestimonial);
    });
  }

  showTestimonials();
}

function goToTestimonial(index) {
  const isMobile = window.innerWidth < 768;
  const isTablet = window.innerWidth < 1024;
  if (!isMobile && !isTablet) return;

  const visible = isMobile ? 1 : 2;
  const max = Math.ceil(testimonialCards.length / visible) - 1;
  currentTestimonial = Math.max(0, Math.min(index, max));

  testimonialCards.forEach((card, idx) => {
    const show = idx >= currentTestimonial * visible && idx < (currentTestimonial + 1) * visible;
    card.style.display = show ? 'flex' : 'none';
  });
  document.querySelectorAll('.test-dot').forEach((d, i) => {
    d.classList.toggle('active', i === currentTestimonial);
  });
}

function prevTestimonial() {
  goToTestimonial(currentTestimonial - 1);
}
function nextTestimonial() {
  goToTestimonial(currentTestimonial + 1);
}

// Auto-play testimonials
let testimonialAutoplay = setInterval(() => nextTestimonial(), 5000);

document.querySelector('.testimonials-track')?.addEventListener('mouseenter', () => {
  clearInterval(testimonialAutoplay);
});
document.querySelector('.testimonials-track')?.addEventListener('mouseleave', () => {
  testimonialAutoplay = setInterval(() => nextTestimonial(), 5000);
});

/* ═══════════════════════════════════════════════
   QUICK TRACK
   ═══════════════════════════════════════════════ */
function quickTrack() {
  const input = document.getElementById('quickTrackId');
  if (!input) return;

  const id = input.value.trim();
  if (!id) {
    showToast('Please enter a tracking ID first', 'fa-triangle-exclamation');
    input.focus();
    return;
  }

  // Redirect to tracking page with query
  window.location.href = `tracking.html?id=${encodeURIComponent(id)}`;
}

// Allow Enter key in track input
document.getElementById('quickTrackId')?.addEventListener('keydown', e => {
  if (e.key === 'Enter') quickTrack();
});

/* ═══════════════════════════════════════════════
   HERO PARTICLES
   ═══════════════════════════════════════════════ */
function createParticles() {
  const container = document.getElementById('heroParticles');
  if (!container) return;

  const count = window.innerWidth < 768 ? 15 : 30;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 6 + 2;
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const duration = Math.random() * 6 + 4;
    const delay = Math.random() * 4;
    const opacity = Math.random() * 0.4 + 0.1;
    const color = Math.random() > 0.6 ? 'rgba(6,182,212,' : 'rgba(255,255,255,';

    Object.assign(p.style, {
      width: size + 'px',
      height: size + 'px',
      left: x + '%',
      top: y + '%',
      background: color + opacity + ')',
      animationDuration: duration + 's',
      animationDelay: delay + 's',
    });
    container.appendChild(p);
  }
}

/* ═══════════════════════════════════════════════
   ACTIVE NAV LINK
   ═══════════════════════════════════════════════ */
function setActiveNavLinks() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link, .side-nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href && (href === path || (path === '' && href === 'index.html'))) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/* ═══════════════════════════════════════════════
   SERVICE CARDS HOVER PARALLAX (subtle)
   ═══════════════════════════════════════════════ */
function initCardTilt() {
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `translateY(-4px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* ═══════════════════════════════════════════════
   SMOOTH SECTION ANCHORS
   ═══════════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 90;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ═══════════════════════════════════════════════
   SURVEY MULTI-STEP FORM
   ═══════════════════════════════════════════════ */
let surveyStep = 1;
const totalSurveySteps = 4;

function goToStep(step) {
  if (step < 1 || step > totalSurveySteps) return;

  // Hide current panel
  document.querySelectorAll('.survey-panel').forEach(p => p.classList.remove('is-active'));
  const nextPanel = document.getElementById(`surveyStep${step}`);
  if (nextPanel) nextPanel.classList.add('is-active');

  // Update progress indicators
  document.querySelectorAll('.step-bubble').forEach((bubble, idx) => {
    bubble.classList.remove('active', 'done');
    if (idx + 1 < step) bubble.classList.add('done');
    if (idx + 1 === step) bubble.classList.add('active');
  });

  document.querySelectorAll('.step-line').forEach((line, idx) => {
    line.classList.toggle('done', idx + 1 < step);
  });

  surveyStep = step;
}

function nextStep() {
  if (surveyStep < totalSurveySteps) goToStep(surveyStep + 1);
}
function prevStep() {
  if (surveyStep > 1) goToStep(surveyStep - 1);
}

function submitSurvey() {
  const successEl = document.getElementById('surveySuccess');
  const containerEl = document.querySelector('.survey-container');
  if (successEl && containerEl) {
    containerEl.innerHTML = '';
    containerEl.appendChild(successEl);
    successEl.style.display = 'block';
    successEl.classList.add('animate-fadeInUp');
  }
}

/* ═══════════════════════════════════════════════
   TRACKING PORTAL
   ═══════════════════════════════════════════════ */
function trackShipment() {
  const input = document.getElementById('trackingInput');
  const result = document.getElementById('trackingResult');
  if (!input || !result) return;

  const id = input.value.trim();
  if (!id) {
    showToast('Please enter a tracking number', 'fa-triangle-exclamation');
    return;
  }

  // Simulate tracking result
  result.classList.add('is-visible');
  result.querySelector('.tracking-result__id').textContent = 'DGL-' + id.toUpperCase().replace(/[^A-Z0-9]/g, '');

  showToast('Shipment found! Showing live status below.', 'fa-satellite-dish');

  // Scroll to result
  setTimeout(() => {
    result.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 200);
}

/* ═══════════════════════════════════════════════
   CONTACT FORM SUBMISSION
   ═══════════════════════════════════════════════ */
function submitContactForm(e) {
  e?.preventDefault();
  showToast('Message sent successfully! We will contact you within 24 hours. ✅');
  e?.target?.reset();
  return false;
}

/* ═══════════════════════════════════════════════
   RATING BUTTONS (Survey)
   ═══════════════════════════════════════════════ */
function selectRating(btn) {
  const group = btn.closest('.rating-group');
  if (!group) return;
  group.querySelectorAll('.rating-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
}

/* ═══════════════════════════════════════════════
   URL PARAMS — Auto-track on tracking page
   ═══════════════════════════════════════════════ */
function checkUrlTrackingParam() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  if (id) {
    const input = document.getElementById('trackingInput');
    if (input) {
      input.value = id;
      setTimeout(trackShipment, 500);
    }
  }
}

/* ═══════════════════════════════════════════════
   INITIALIZE ALL
   ═══════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  createParticles();
  initScrollReveal();
  initTestimonials();
  setActiveNavLinks();
  initCardTilt();
  checkUrlTrackingParam();

  // Add reveal classes to elements
  const revealTargets = [
    '.service-card',
    '.why-feature',
    '.offer-card',
    '.testimonial-card',
    '.stat-card',
    '.blog-card',
    '.team-card',
    '.timeline-item',
  ];
  revealTargets.forEach(selector => {
    document.querySelectorAll(selector).forEach((el, i) => {
      if (!el.classList.contains('reveal')) {
        el.classList.add('reveal', `reveal--delay-${Math.min(i % 5 + 1, 5)}`);
      }
    });
  });

  // Re-run observer for newly added reveal classes
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
});

// Handle window resize for testimonials
window.addEventListener('resize', () => {
  initTestimonials();
}, { passive: true });

/* ═══════════════════════════════════════════════
   CONTACT FORM → WHATSAPP
   Builds a pre-filled WhatsApp message from the
   contact form and opens it in a new tab.
   ═══════════════════════════════════════════════ */
function sendToWhatsApp(event) {
  event.preventDefault();

  const name    = (document.getElementById('contactName')?.value    || '').trim();
  const email   = (document.getElementById('contactEmail')?.value   || '').trim();
  const phone   = (document.getElementById('contactPhone')?.value   || '').trim();
  const service = (document.getElementById('contactService')?.value || '').trim();
  const message = (document.getElementById('contactMsg')?.value     || '').trim();

  if (!name || !message) {
    showToast('Please fill in your name and message before sending.', 'error');
    return;
  }

  // Map service value to readable label
  const serviceLabels = {
    air:       'Air Freight – Dubai to Erbil',
    land:      'Land Freight – $1.25/kg Route',
    sea:       'Sea Freight / Container Shipping',
    shein:     'Shein Package Delivery',
    autoparts: 'Auto Parts Transport',
    general:   'General Inquiry',
  };
  const serviceLabel = serviceLabels[service] || service || 'Not specified';

  // Build the WhatsApp template message
  const lines = [
    '🚚 *New Message — Dargol Logistics Website*',
    '',
    `👤 *Name:* ${name}`,
    email   ? `📧 *Email:* ${email}`        : null,
    phone   ? `📞 *Phone:* ${phone}`         : null,
    service ? `📦 *Service:* ${serviceLabel}` : null,
    '',
    `📝 *Message:*`,
    message,
    '',
    '─────────────────────',
    '_Sent via dargollogistics.com_',
  ].filter(l => l !== null).join('\n');

  const encoded = encodeURIComponent(lines);
  const waURL   = `https://api.whatsapp.com/send/?phone=9647513077900&text=${encoded}&type=phone_number&app_absent=0`;

  window.open(waURL, '_blank', 'noopener,noreferrer');

  // Show success toast
  showToast('Opening WhatsApp… we\'ll reply in minutes! 🎉', 'success');
}
