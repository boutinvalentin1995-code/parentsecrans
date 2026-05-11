/* ============================================================
   MAIN.JS — ParentEcrans.fr
   Nav, Quiz, FAQ, Formulaires
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  const nav = document.querySelector('.nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 20);
    });
  }

  const burger   = document.querySelector('.nav__burger');
  const navLinks = document.querySelector('.nav__links');
  if (burger && navLinks) {
    burger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const isOpen = navLinks.classList.contains('open');
      burger.querySelectorAll('span')[0].style.transform = isOpen ? 'rotate(45deg) translate(5px, 5px)' : '';
      burger.querySelectorAll('span')[1].style.opacity   = isOpen ? '0' : '1';
      burger.querySelectorAll('span')[2].style.transform = isOpen ? 'rotate(-45deg) translate(5px, -5px)' : '';
    });
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => navLinks.classList.remove('open'));
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
    });
  });

  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href && (href === currentPage || href.includes(currentPage))) {
      a.classList.add('active');
    }
  });

  initQuiz();

  document.querySelectorAll('.faq-item').forEach(item => {
    const btn = item.querySelector('.faq-question');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('faq-item--open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('faq-item--open'));
      if (!isOpen) item.classList.add('faq-item--open');
    });
  });

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('filter-btn--active'));
      btn.classList.add('filter-btn--active');
    });
  });

  document.querySelectorAll('.cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('cat-btn--active'));
      btn.classList.add('cat-btn--active');
    });
  });

  document.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.chip').forEach(c => c.classList.remove('chip--active'));
      chip.classList.add('chip--active');
    });
  });

});

function initQuiz() {
  const steps    = document.querySelectorAll('.quiz-step');
  const progBars = document.querySelectorAll('.quiz-progress__bar');
  const emailStep = document.getElementById('quiz-email-step');

  if (!steps.length) return;

  let currentStep = 0;

  function updateProgress() {
    progBars.forEach((bar, i) => {
      bar.classList.remove('quiz-progress__bar--active', 'quiz-progress__bar--done');
      if (i < currentStep)   bar.classList.add('quiz-progress__bar--done');
      if (i === currentStep) bar.classList.add('quiz-progress__bar--active');
    });
  }

  function goTo(n) {
    steps[currentStep].classList.remove('quiz-step--active');
    currentStep = n;
    steps[currentStep].classList.add('quiz-step--active');
    updateProgress();
  }

  document.querySelectorAll('.quiz-option').forEach(opt => {
    opt.addEventListener('click', () => {
      const step = opt.closest('.quiz-step');
      step.querySelectorAll('.quiz-option').forEach(o => o.classList.remove('quiz-option--selected'));
      opt.classList.add('quiz-option--selected');
      step.querySelector('.quiz-btn-next').disabled = false;
    });
  });

  document.querySelectorAll('.quiz-btn-next').forEach(btn => {
    btn.addEventListener('click', () => {
      if (currentStep < steps.length - 1) {
        goTo(currentStep + 1);
      } else {
        // Email AVANT le résultat
        document.getElementById('quiz-steps-wrap').style.display = 'none';
        if (emailStep) emailStep.classList.add('quiz-email--active');
      }
    });
  });

  document.querySelectorAll('.quiz-btn-prev').forEach(btn => {
    btn.addEventListener('click', () => {
      if (currentStep > 0) goTo(currentStep - 1);
    });
  });

  updateProgress();
}

function getScore() {
  let total = 0;
  document.querySelectorAll('.quiz-step').forEach(step => {
    const sel = step.querySelector('.quiz-option--selected');
    if (sel) total += parseInt(sel.dataset.score || 0);
  });
  return total;
}

function getQuizResult(total) {
  if (total <= 8) return {
    color: '#6B8F71',
    label: 'Usage modere',
    desc:  'Votre enfant a un rapport globalement sain aux ecrans. Quelques ajustements simples suffiront a maintenir cet equilibre.'
  };
  if (total <= 18) return {
    color: '#F5A623',
    label: 'Dependance legere a moderee',
    desc:  'Des signaux d alerte sont presents. Des strategies concretes peuvent aider rapidement avant que la situation ne s aggrave.'
  };
  return {
    color: '#C8614A',
    label: 'Dependance forte',
    desc:  'Votre enfant montre des signes clairs d addiction aux ecrans. Une approche structuree et bienveillante est necessaire des maintenant.'
  };
}

function showResult() {
  const total  = getScore();
  const result = getQuizResult(total);
  const dot    = document.getElementById('result-dot');
  const label  = document.getElementById('result-label');
  const desc   = document.getElementById('result-desc');
  if (dot)   dot.style.background = result.color;
  if (label) label.textContent    = result.label;
  if (desc)  desc.textContent     = result.desc;
}

async function submitQuizEmail() {
  const input = document.getElementById('quiz-email-input');
  if (!input || !input.value || !input.value.includes('@')) {
    if (input) input.style.borderColor = 'var(--terracotta)';
    return;
  }

  const total     = getScore();
  const btnSubmit = document.querySelector('.quiz-btn-submit');
  if (btnSubmit) { btnSubmit.disabled = true; btnSubmit.textContent = 'Envoi en cours...'; }

  try {
    const response = await fetch('/brevo.php', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ email: input.value.trim(), score: total })
    });

    const json = await response.json();

    if (json.success) {
      showResult();
      const emailStep   = document.getElementById('quiz-email-step');
      const successStep = document.getElementById('quiz-success');
      if (emailStep)   emailStep.classList.remove('quiz-email--active');
      if (successStep) successStep.classList.add('quiz-success--active');
    } else {
      console.error('Brevo error:', json);
      if (btnSubmit) { btnSubmit.disabled = false; btnSubmit.textContent = 'Recevoir mon resultat gratuit'; }
      alert('Une erreur est survenue. Veuillez reessayer.');
    }
  } catch (e) {
    console.error('Erreur reseau:', e);
    if (btnSubmit) { btnSubmit.disabled = false; btnSubmit.textContent = 'Recevoir mon resultat gratuit'; }
    alert('Une erreur est survenue. Veuillez reessayer.');
  }
}

function submitContactForm() {
  const email = document.getElementById('contact-email') ? document.getElementById('contact-email').value : '';
  if (!email || !email.includes('@')) {
    if (document.getElementById('contact-email')) document.getElementById('contact-email').style.borderColor = 'var(--terracotta)';
    return;
  }
  document.getElementById('contact-form-inner').style.display = 'none';
  if (document.getElementById('contact-success')) document.getElementById('contact-success').classList.add('form-success--active');
}
