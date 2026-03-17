/**
 * Lumiar - Salão de Beleza
 * Script principal da landing page
 */

(function () {
  'use strict';

  // ===== Menu mobile (drawer pela esquerda) =====
  const navToggle = document.querySelector('.nav-toggle');
  const navDrawer = document.getElementById('nav-drawer');
  const navDrawerBackdrop = document.getElementById('nav-drawer-backdrop');
  const navDrawerClose = document.querySelector('.nav-drawer-close');
  const navDrawerLinks = document.querySelectorAll('.nav-drawer-links a');

  function abrirDrawer() {
    if (!navDrawer) return;
    navToggle.classList.add('ativo');
    navDrawer.classList.add('ativo');
    if (navDrawerBackdrop) navDrawerBackdrop.classList.add('ativo');
    navDrawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function fecharDrawer() {
    if (!navDrawer) return;
    navToggle.classList.remove('ativo');
    navDrawer.classList.remove('ativo');
    if (navDrawerBackdrop) navDrawerBackdrop.classList.remove('ativo');
    navDrawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (navToggle && navDrawer) {
    navToggle.addEventListener('click', function () {
      if (navDrawer.classList.contains('ativo')) {
        fecharDrawer();
      } else {
        abrirDrawer();
      }
    });
  }

  if (navDrawerClose) {
    navDrawerClose.addEventListener('click', fecharDrawer);
  }

  if (navDrawerBackdrop) {
    navDrawerBackdrop.addEventListener('click', fecharDrawer);
  }

  navDrawerLinks.forEach(function (link) {
    link.addEventListener('click', fecharDrawer);
  });

  // ===== Header ao rolar =====
  const header = document.querySelector('.header');
  if (header) {
    let ultimoScroll = 0;

    window.addEventListener('scroll', function () {
      const scrollAtual = window.scrollY;
      if (scrollAtual > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
      ultimoScroll = scrollAtual;
    });
  }

  // ===== Painéis de serviços (accordion horizontal) =====
  const paineis = document.querySelectorAll('.servico-panel');
  if (paineis.length) {
    paineis.forEach(function (panel) {
      panel.addEventListener('click', function () {
        if (this.classList.contains('expandido')) return;
        paineis.forEach(function (p) {
          p.classList.remove('expandido');
          p.setAttribute('aria-selected', 'false');
        });
        this.classList.add('expandido');
        this.setAttribute('aria-selected', 'true');
      });
      panel.addEventListener('keydown', function (e) {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        e.preventDefault();
        this.click();
      });
    });
  }

  // ===== Slider de depoimentos =====
  const slider = document.querySelector('.depoimentos-slider');
  if (slider) {
    const track = slider.querySelector('.depoimentos-track');
    const cards = slider.querySelectorAll('.depoimento-card');
    const btnPrev = slider.querySelector('.depoimentos-prev');
    const btnNext = slider.querySelector('.depoimentos-next');
    const dotsContainer = slider.querySelector('.depoimentos-dots');

    let currentIndex = 0;
    let cardsPerView = 2;
    let gap = 24;

    function getCardsPerView() {
      return window.innerWidth <= 768 ? 1 : 2;
    }

    function getMaxIndex() {
      return Math.max(0, cards.length - getCardsPerView());
    }

    function updateSlider() {
      if (!track || !cards.length) return;
      cardsPerView = getCardsPerView();
      const maxIndex = getMaxIndex();
      currentIndex = Math.min(currentIndex, maxIndex);
      var trackStyle = getComputedStyle(track);
      gap = parseInt(trackStyle.gap, 10) || 24;
      var cardWidth = cards[0].offsetWidth;
      var move = currentIndex * (cardWidth + gap);
      track.style.transform = 'translateX(-' + move + 'px)';
      var dots = dotsContainer ? dotsContainer.querySelectorAll('.dot') : [];
      dots.forEach(function (dot, i) { dot.classList.toggle('ativo', i === currentIndex); });
    }

    function buildDots() {
      if (!dotsContainer) return;
      const maxIndex = getMaxIndex();
      dotsContainer.innerHTML = '';
      for (let i = 0; i <= maxIndex; i++) {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'dot' + (i === 0 ? ' ativo' : '');
        dot.setAttribute('aria-label', 'Slide ' + (i + 1));
        dot.addEventListener('click', function () {
          currentIndex = i;
          updateSlider();
        });
        dotsContainer.appendChild(dot);
      }
    }

    if (btnPrev) {
      btnPrev.addEventListener('click', function () {
        currentIndex = Math.max(0, currentIndex - 1);
        updateSlider();
      });
    }
    if (btnNext) {
      btnNext.addEventListener('click', function () {
        const maxIndex = getMaxIndex();
        currentIndex = Math.min(maxIndex, currentIndex + 1);
        updateSlider();
      });
    }

    buildDots();
    updateSlider();
    window.addEventListener('resize', function () {
      buildDots();
      updateSlider();
    });
  }

  // ===== Formulário de contato =====
  const formContato = document.getElementById('form-contato');
  if (formContato) {
    const nomeInput = document.getElementById('nome');
    const emailInput = document.getElementById('email');
    const telefoneInput = document.getElementById('telefone');
    const mensagemInput = document.getElementById('mensagem');
    const feedback = document.getElementById('form-feedback');
    const btnEnviar = document.getElementById('btn-enviar');
    const contadorMsg = document.getElementById('contador-msg');

    function mostrarErro(campoId, mensagem) {
      var el = document.getElementById('erro-' + campoId);
      var input = document.getElementById(campoId);
      if (el && input) {
        el.textContent = mensagem || '';
        input.classList.toggle('erro', !!mensagem);
      }
    }

    function limparErros() {
      ['nome', 'email', 'telefone', 'assunto', 'mensagem'].forEach(function (id) {
        mostrarErro(id, '');
      });
      if (feedback) {
        feedback.hidden = true;
        feedback.className = 'form-feedback';
        feedback.textContent = '';
      }
    }

    function validarEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function validarTelefone(tel) {
      if (!tel) return true;
      var numeros = tel.replace(/\D/g, '');
      return numeros.length >= 10 && numeros.length <= 11;
    }

    function validar() {
      var ok = true;
      var nome = nomeInput ? nomeInput.value.trim() : '';
      var email = emailInput ? emailInput.value.trim() : '';
      var telefone = telefoneInput ? telefoneInput.value.trim() : '';
      var mensagem = mensagemInput ? mensagemInput.value.trim() : '';

      if (!nome) {
        mostrarErro('nome', 'Digite seu nome.');
        ok = false;
      } else {
        mostrarErro('nome', '');
      }

      if (!email) {
        mostrarErro('email', 'Digite seu e-mail.');
        ok = false;
      } else if (!validarEmail(email)) {
        mostrarErro('email', 'Digite um e-mail válido.');
        ok = false;
      } else {
        mostrarErro('email', '');
      }

      if (telefone && !validarTelefone(telefone)) {
        mostrarErro('telefone', 'Digite um telefone válido.');
        ok = false;
      } else {
        mostrarErro('telefone', '');
      }

      if (!mensagem) {
        mostrarErro('mensagem', 'Digite sua mensagem.');
        ok = false;
      } else if (mensagem.length < 10) {
        mostrarErro('mensagem', 'A mensagem deve ter pelo menos 10 caracteres.');
        ok = false;
      } else {
        mostrarErro('mensagem', '');
      }

      return ok;
    }

    if (contadorMsg && mensagemInput) {
      function atualizarContador() {
        contadorMsg.textContent = (mensagemInput.value || '').length;
      }
      mensagemInput.addEventListener('input', atualizarContador);
      mensagemInput.addEventListener('paste', function () { setTimeout(atualizarContador, 0); });
      atualizarContador();
    }

    formContato.addEventListener('submit', function (e) {
      e.preventDefault();
      limparErros();

      if (!validar()) {
        formContato.classList.add('validado');
        if (feedback) {
          feedback.hidden = false;
          feedback.className = 'form-feedback erro';
          feedback.textContent = 'Verifique os campos marcados e tente novamente.';
        }
        var primeiroErro = formContato.querySelector('input.erro, textarea.erro, select.erro');
        if (primeiroErro) primeiroErro.focus();
        return;
      }

      if (btnEnviar) {
        btnEnviar.disabled = true;
        btnEnviar.classList.add('enviando');
      }

      // Simulação de envio (em produção: fetch para API)
      setTimeout(function () {
        if (btnEnviar) {
          btnEnviar.disabled = false;
          btnEnviar.classList.remove('enviando');
        }
        if (feedback) {
          feedback.hidden = false;
          feedback.className = 'form-feedback sucesso';
          feedback.textContent = 'Mensagem enviada com sucesso! Entraremos em contato em breve.';
        }
        formContato.reset();
        if (contadorMsg) contadorMsg.textContent = '0';
        limparErros();
        feedback.focus();
      }, 1200);
    });

    formContato.querySelectorAll('input, textarea, select').forEach(function (input) {
      input.addEventListener('input', function () {
        var id = input.id;
        if (id) mostrarErro(id, '');
      });
      input.addEventListener('blur', function () {
        if (formContato.classList.contains('validado')) validar();
      });
    });
  }

  // ===== Scroll suave para âncoras (fallback para navegadores antigos) =====
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const alvo = document.querySelector(href);
      if (alvo) {
        e.preventDefault();
        alvo.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();
