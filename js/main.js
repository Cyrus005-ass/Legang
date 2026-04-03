/**
 * VANO BABY — 10 ANS DU GANG
 * JS allégé — amateur friendly
 */

(function () {
  'use strict';

  var AUDIO_SRC = 'vanosong.mp4';
  var AUDIO_VOL = 0.22;
  var HERO_SLIDE_MS = 5500;
  var resumeAfterVideo = false;

  // Éléments
  var splash   = document.getElementById('splash');
  var site     = document.getElementById('site');
  var enterBtn = document.getElementById('enter-btn');
  var snd      = document.getElementById('snd');
  var sndBtn   = document.getElementById('snd-btn');
  var navEl    = document.getElementById('nav');
  var burger   = document.getElementById('burger');
  var navLinks = document.getElementById('nav-links');
  var cur      = document.getElementById('cur');
  var cur2     = document.getElementById('cur2');
  var yrEl     = document.getElementById('yr');
  var modal    = document.getElementById('music-modal');
  var musicYes = document.getElementById('music-yes');
  var musicNo  = document.getElementById('music-no');

  // ── AUDIO ──
  function loadAudio() {
    if (snd && !snd.src) snd.src = AUDIO_SRC;
  }

  function playAudio() {
    if (!snd) return;
    snd.volume = AUDIO_VOL;
    snd.play().then(function () {
      sndUI(true);
      if (sndBtn) sndBtn.classList.add('on');
    }).catch(function () { sndUI(false); });
  }

  function pauseAudio(fromVideo) {
    if (!snd || snd.paused) return;
    resumeAfterVideo = !!fromVideo;
    snd.pause();
    sndUI(false);
  }

  function resumeAudio() {
    if (!snd || !resumeAfterVideo) return;
    resumeAfterVideo = false;
    snd.play().then(function () { sndUI(true); }).catch(function () {});
  }

  function sndUI(playing) {
    if (!sndBtn) return;
    sndBtn.classList.toggle('paused', !playing);
    sndBtn.title = playing ? 'Pause musique' : 'Lire musique';
  }

  // ── MODAL MUSIQUE ──
  function showMusicModal(cb) {
    if (!modal) { cb(false); return; }
    modal.showModal();
    musicYes.onclick = function () { modal.close(); cb(true); };
    musicNo.onclick  = function () { modal.close(); cb(false); };
  }

  // ── SPLASH → SITE ──
  function enterSite(withMusic) {
    if (withMusic) playAudio();
    splash.classList.add('out');
    setTimeout(function () {
      splash.style.display = 'none';
      site.classList.remove('site--hidden');
      site.classList.add('show');
      if (navEl) navEl.classList.remove('nav--splash');
      if (sndBtn) sndBtn.classList.add('on');
      if (!withMusic) sndUI(false);
      window.scrollTo(0, 0);
      initReveal();
      initVideos();
      initHeroSlideshow();
      updateCursorTargets();
    }, 900);
  }

  function initSplash() {
    if (!enterBtn || !splash || !site) return;
    enterBtn.addEventListener('click', function () {
      loadAudio();
      showMusicModal(function (yes) { enterSite(yes); });
    });
  }

  // ── BOUTON SON ──
  function initSndBtn() {
    if (!sndBtn || !snd) return;
    sndBtn.addEventListener('click', function () {
      if (snd.paused) {
        resumeAfterVideo = false;
        snd.play().then(function () { sndUI(true); }).catch(function () {});
      } else {
        resumeAfterVideo = false;
        snd.pause();
        sndUI(false);
      }
    });
  }

  // ── VIDÉOS YOUTUBE ──
  function stopOtherVideos(except) {
    document.querySelectorAll('.vid').forEach(function (card) {
      var embed  = card.querySelector('.vid__embed');
      var iframe = embed && embed.querySelector('iframe');
      var thumb  = card.querySelector('.vid__thumb');
      if (!iframe || iframe === except || embed.hidden) return;
      iframe.src = '';
      embed.hidden = true;
      if (thumb) thumb.style.display = '';
    });
  }

  function listenVideoState(iframe) {
    window.addEventListener('message', function (e) {
      var data;
      try { data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data; } catch (x) { return; }
      if (!data || !data.info) return;
      var s = data.info.playerState;
      if (s === 1) pauseAudio(true);
      else if (s === 2 || s === 0) resumeAudio();
    });
  }

  function initVideos() {
    document.querySelectorAll('.vid').forEach(function (card) {
      var thumb  = card.querySelector('.vid__thumb');
      var embed  = card.querySelector('.vid__embed');
      var iframe = embed && embed.querySelector('iframe');
      var btn    = card.querySelector('.vid__play');
      if (!thumb || !embed || !iframe) return;
      function activate() {
        stopOtherVideos(iframe);
        pauseAudio(true);
        if (!iframe.src) iframe.src = iframe.getAttribute('data-src') || '';
        thumb.style.display = 'none';
        embed.hidden = false;
        listenVideoState(iframe);
      }
      thumb.addEventListener('click', activate);
      if (btn) btn.addEventListener('click', function (e) { e.stopPropagation(); activate(); });
    });
  }

  // ── NAV ──
  function setNav(open) {
    if (!burger || !navLinks) return;
    burger.classList.toggle('open', open);
    navLinks.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }

  function initNav() {
    window.addEventListener('scroll', function () {
      if (navEl) navEl.classList.toggle('bg', window.scrollY > 50);
    }, { passive: true });

    if (burger) burger.addEventListener('click', function () { setNav(!burger.classList.contains('open')); });
    if (navLinks) navLinks.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { setNav(false); }); });
    window.addEventListener('resize', function () { if (window.innerWidth > 768) setNav(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setNav(false); });

    document.addEventListener('click', function (e) {
      var a = e.target.closest('a[href^="#"]');
      if (!a) return;
      var id = a.getAttribute('href');
      var target = id && id !== '#' && document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var nh = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nh')) || 60;
      window.scrollTo({ top: Math.max(0, target.getBoundingClientRect().top + scrollY - nh - 12), behavior: 'smooth' });
    });
  }

  // ── CURSEUR ──
  function initCursor() {
    if (!cur || !cur2 || window.matchMedia('(hover:none)').matches) return;
    var mx = 0, my = 0, fx = 0, fy = 0;
    document.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
      cur.style.transform = 'translate(' + mx + 'px,' + my + 'px)';
    });
    (function loop() {
      fx += (mx - fx) * .12; fy += (my - fy) * .12;
      cur2.style.transform = 'translate(' + fx + 'px,' + fy + 'px)';
      requestAnimationFrame(loop);
    })();
  }

  function updateCursorTargets() {
    if (!cur2 || window.matchMedia('(hover:none)').matches) return;
    document.querySelectorAll('a,button,.sch__frame,.duo__img,.gi,.vid__thumb,.famille__card').forEach(function (el) {
      el.addEventListener('mouseenter', function () { cur2.classList.add('big'); });
      el.addEventListener('mouseleave', function () { cur2.classList.remove('big'); });
    });
  }

  // ── REVEAL ──
  function initReveal() {
    var items = document.querySelectorAll('.reveal:not(.vis)');
    if (!items.length) return;
    if (!('IntersectionObserver' in window)) { items.forEach(function (el) { el.classList.add('vis'); }); return; }
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        setTimeout(function () { el.classList.add('vis'); }, parseInt(el.getAttribute('data-delay') || '0', 10));
        obs.unobserve(el);
      });
    }, { rootMargin: '0px 0px -5% 0px', threshold: .06 });
    items.forEach(function (el) { obs.observe(el); });
  }

  // ── HERO SLIDESHOW ──
  function initHeroSlideshow() {
    if (window.__heroOk) return;
    var slides = document.querySelectorAll('.hero__slide');
    var dots   = document.querySelectorAll('.hero__dot');
    if (!slides.length) return;
    window.__heroOk = true;
    var i = 0;
    function goTo(n) {
      i = (n + slides.length) % slides.length;
      slides.forEach(function (el, j) { el.classList.toggle('is-active', j === i); });
      dots.forEach(function (d, j)   { d.classList.toggle('is-active',  j === i); });
    }
    goTo(0);
    setInterval(function () { goTo(i + 1); }, HERO_SLIDE_MS);
  }

  // ── INIT ──
  if (yrEl) yrEl.textContent = new Date().getFullYear();
  initCursor();
  initSplash();
  initSndBtn();
  initNav();

  if (site && !site.classList.contains('site--hidden')) {
    if (navEl) navEl.classList.remove('nav--splash');
    initReveal(); initVideos(); initHeroSlideshow(); updateCursorTargets();
  }
})();
