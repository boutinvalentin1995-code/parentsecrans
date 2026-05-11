/* ============================================================
   MAIN.JS — ParentEcrans.fr
   Nav, Quiz, FAQ, Formulaires, Utilitaires
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── NAV SCROLL ──────────────────────────────────────────────
  const nav = document.querySelector('.nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 20);
    });
  }

  // ── BURGER MENU ─────────────────────────────────────────────
  const burger = document.querySelector('.nav__burger');
  const navLinks = document.querySelector('.nav__links');
  if (burger && navLinks) {
    burger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const isOpen = navLinks.classList.contains('open');
      burger.querySelectorAll('span')[0].style.transform = isOpen ? 'rotate(45deg) translate(5px, 5px)' : '';
      burger.querySelectorAll('span')[1].style.opacity   = isOpen ? '0' : '1';
      burger.querySelectorAll('span')[2].style.transform = isOpen ? 'rotate(-45deg) translate(5px, -5px)' : '';
    });
    // Fermer au clic sur un lien
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => navLinks.classList.remove('open'));
    });
  }

  // ── SMOOTH SCROLL ───────────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ── ACTIVE NAV LINK ─────────────────────────────────────────
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href && (href === currentPage || href.includes(currentPage))) {
      a.classList.add('active');
    }
  });

  // ── QUIZ ────────────────────────────────────────────────────
  initQuiz();

  // ── FAQ ACCORDION ───────────────────────────────────────────
  document.querySelectorAll('.faq-item').forEach(item => {
    const btn = item.querySelector('.faq-question');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('faq-item--open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('faq-item--open'));
      if (!isOpen) item.classList.add('faq-item--open');
    });
  });

  // ── FILTRES BOUTIQUE ────────────────────────────────────────
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('filter-btn--active'));
      btn.classList.add('filter-btn--active');
    });
  });

  // ── FILTRES BLOG ────────────────────────────────────────────
  document.querySelectorAll('.cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('cat-btn--active'));
      btn.classList.add('cat-btn--active');
      // ⚠️ WordPress : déclencher WP_Query ici via fetch ou rechargement avec ?cat=slug
    });
  });

  // ── CHIPS CONTACT ───────────────────────────────────────────
  document.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.chip').forEach(c => c.classList.remove('chip--active'));
      chip.classList.add('chip--active');
    });
  });

  // ── FORMULAIRE CONTACT ──────────────────────────────────────
  const contactForm = document.getElementById('contact-form-inner');
  if (contactForm) {
    document.getElementById('btn-contact-submit')?.addEventListener('click', () => {
      const email = document.getElementById('contact-email')?.value;
      if (!email || !email.includes('@')) {
        document.getElementById('contact-email').style.borderColor = 'var(--terracotta)';
        return;
      }
      // ⚠️ WordPress : remplacer par wp_mail() ou WPForms
      contactForm.style.display = 'none';
      document.getElementById('contact-success')?.classList.add('form-success--active');
    });
  }

});

// ── QUIZ ENGINE ─────────────────────────────────────────────
function initQuiz() {
  const steps   = document.querySelectorAll('.quiz-step');
  const progBars = document.querySelectorAll('.quiz-progress__bar');
  const emailStep   = document.getElementById('quiz-email-step');
  const successStep = document.getElementById('quiz-success');

  if (!steps.length) return;

  let currentStep = 0;
  let scores = new Array(steps.length).fill(null);

  function updateProgress() {
    progBars.forEach((bar, i) => {
      bar.classList.remove('quiz-progress__bar--active', 'quiz-progress__bar--done');
      if (i < currentStep)  bar.classList.add('quiz-progress__bar--done');
      if (i === currentStep) bar.classList.add('quiz-progress__bar--active');
    });
  }

  function goTo(n) {
    steps[currentStep].classList.remove('quiz-step--active');
    currentStep = n;
    steps[currentStep].classList.add('quiz-step--active');
    updateProgress();
  }

  // Sélection d'option
  document.querySelectorAll('.quiz-option').forEach(opt => {
    opt.addEventListener('click', () => {
      const step = opt.closest('.quiz-step');
      step.querySelectorAll('.quiz-option').forEach(o => o.classList.remove('quiz-option--selected'));
      opt.classList.add('quiz-option--selected');
      step.querySelector('.quiz-btn-next').disabled = false;
    });
  });

  // Bouton suivant
  document.querySelectorAll('.quiz-btn-next').forEach(btn => {
    btn.addEventListener('click', () => {
      const step    = btn.closest('.quiz-step');
      const selected = step.querySelector('.quiz-option--selected');
      if (selected) scores[currentStep] = parseInt(selected.dataset.score || 0);

      if (currentStep < steps.length - 1) {
        goTo(currentStep + 1);
      } else {
        // Fin du quiz → email
        document.getElementById('quiz-steps-wrap').style.display = 'none';
        showResult();
        emailStep?.classList.add('quiz-email--active');
      }
    });
  });

  // Bouton précédent
  document.querySelectorAll('.quiz-btn-prev').forEach(btn => {
    btn.addEventListener('click', () => {
      if (currentStep > 0) goTo(currentStep - 1);
    });
  });

  updateProgress();
}

function getQuizResult(total) {
  if (total <= 8)  return {
    color: '#6B8F71',
    label: '🟢 Usage modéré',
    desc:  'Votre enfant a un rapport globalement sain aux écrans. Quelques ajustements simples suffiront.'
  };
  if (total <= 18) return {
    color: '#F5A623',
    label: '🟡 Dépendance légère à modérée',
    desc:  'Des signaux d\'alerte sont présents. Des stratégies concrètes peuvent aider rapidement.'
  };
  return {
    color: '#C8614A',
    label: '🔴 Dépendance forte',
    desc:  'Votre enfant montre des signes clairs d\'addiction. Une approche structurée est nécessaire.'
  };
}

function showResult() {
  const steps  = document.querySelectorAll('.quiz-step');
  const scores = [];
  steps.forEach((step, i) => {
    const sel = step.querySelector('.quiz-option--selected');
    scores[i] = sel ? parseInt(sel.dataset.score || 0) : 0;
  });
  const total  = scores.reduce((a, b) => a + b, 0);
  const result = getQuizResult(total);

  const dot   = document.getElementById('result-dot');
  const label = document.getElementById('result-label');
  const desc  = document.getElementById('result-desc');
  if (dot)   dot.style.background  = result.color;
  if (label) label.textContent     = result.label;
  if (desc)  desc.textContent      = result.desc;
}

function submitQuizEmail() {
  const input = document.getElementById('quiz-email-input');
  if (!input) return;
  if (!input.value || !input.value.includes('@')) {
    input.style.borderColor = 'var(--terracotta)';
    return;
  }
  // ⚠️ Brevo : remplacer par l'appel API Brevo ici
  // fetch('https://api.brevo.com/v3/contacts', { ... })
  const emailStep   = document.getElementById('quiz-email-step');
  const successStep = document.getElementById('quiz-success');
  if (emailStep)   emailStep.classList.remove('quiz-email--active');
  if (successStep) successStep.classList.add('quiz-success--active');
}

function submitContactForm() {
  const email = document.getElementById('contact-email')?.value;
  if (!email || !email.includes('@')) {
    document.getElementById('contact-email').style.borderColor = 'var(--terracotta)';
    return;
  }
  // ⚠️ WordPress : remplacer par wp_mail() ou WPForms
  document.getElementById('contact-form-inner').style.display = 'none';
  document.getElementById('contact-success')?.classList.add('form-success--active');
}
