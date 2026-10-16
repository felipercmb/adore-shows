(() => {
  'use strict';
  const hero = document.querySelector('.live-hero');
  const ribbon = document.querySelector('.live-ribbon');
  const municipal = document.querySelector('.municipal-feature');
  const municipalPhoto = municipal?.querySelector('.municipal-photo-frame');
  const toggles = [...document.querySelectorAll('.motion-toggle')];
  const soundButtons = [...document.querySelectorAll('.sound-cta')];
  if (!hero && !ribbon && !municipal && !toggles.length && !soundButtons.length) return;

  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const inView = (node) => {
    if (!node) return false;
    const rect = node.getBoundingClientRect();
    return rect.bottom > 0 && rect.top < innerHeight;
  };
  const listenMedia = (media, callback) => {
    if (media.addEventListener) media.addEventListener('change', callback);
    else media.addListener?.(callback);
  };
  let preference = null;
  let disabled = reduced.matches;
  let heroVisible = inView(hero);
  let ribbonVisible = inView(ribbon);
  let municipalVisible = inView(municipal);
  const soundVisible = new Map(soundButtons.map(button => [button, inView(button)]));
  let frame = 0;
  let pointer = null;
  let scrollListening = false;
  let pointerListening = false;
  let entrancePlayed = false;
  let municipalEntrancePlayed = false;
  const animations = new Set();
  const municipalAnimations = new Set();
  const hasObserver = typeof IntersectionObserver === 'function';

  function resetHero() {
    pointer = null;
    hero?.style.setProperty('--pointer-x', '50%');
    hero?.style.setProperty('--pointer-y', '50%');
    hero?.style.setProperty('--scene-shift', '0px');
  }

  function resetMunicipal() {
    municipalPhoto?.style.setProperty('--municipal-shift', '0px');
  }

  function cancelFrame() {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
  }

  function queueFrame() {
    if (!frame && !disabled && !document.hidden) frame = requestAnimationFrame(updateScene);
  }

  function updateScene() {
    frame = 0;
    if (disabled || document.hidden) return;
    if (!hasObserver) {
      heroVisible = inView(hero);
      ribbonVisible = inView(ribbon);
      municipalVisible = inView(municipal);
      soundButtons.forEach(button => soundVisible.set(button, inView(button)));
      syncActivity();
    }
    if (heroVisible && finePointer.matches) {
      const rect = hero.getBoundingClientRect();
      const shift = clamp(-rect.top / Math.max(1, rect.height), -1, 1) * 28;
      hero.style.setProperty('--scene-shift', `${shift.toFixed(2)}px`);
      if (pointer) {
        const x = 20 + clamp((pointer.x - rect.left) / Math.max(1, rect.width), 0, 1) * 60;
        const y = 20 + clamp((pointer.y - rect.top) / Math.max(1, rect.height), 0, 1) * 60;
        hero.style.setProperty('--pointer-x', `${x.toFixed(2)}%`);
        hero.style.setProperty('--pointer-y', `${y.toFixed(2)}%`);
      }
    }
    if (ribbonVisible) {
      const rect = ribbon.getBoundingClientRect();
      const progress = clamp((innerHeight - rect.top) / Math.max(1, innerHeight + rect.height), 0, 1);
      ribbon.style.setProperty('--ribbon-shift', `${((.5 - progress) * 140).toFixed(2)}px`);
    }
    if (municipalVisible && municipalPhoto && finePointer.matches) {
      const rect = municipal.getBoundingClientRect();
      const progress = clamp((innerHeight - rect.top) / Math.max(1, innerHeight + rect.height), 0, 1);
      municipalPhoto.style.setProperty('--municipal-shift', `${((.5 - progress) * 24).toFixed(2)}px`);
    }
  }

  function movePointer(event) {
    if (event.pointerType === 'touch') return;
    pointer = { x: event.clientX, y: event.clientY };
    queueFrame();
  }

  function leavePointer() {
    pointer = null;
    hero.style.setProperty('--pointer-x', '50%');
    hero.style.setProperty('--pointer-y', '50%');
  }

  function enterHero() {
    if (entrancePlayed || !heroVisible || disabled || document.hidden) return;
    entrancePlayed = true;
    const lines = [...hero.querySelectorAll('.live-title .title-line')];
    const bottom = hero.querySelector('.hero-bottom');
    [...lines, ...(bottom ? [bottom] : [])].forEach((node, index) => {
      if (!node.animate) return;
      const animation = node.animate([
        { opacity: .4, transform: `translateY(${node === bottom ? 18 : 35}px)` },
        { opacity: 1, transform: 'translateY(0)' }
      ], { duration: 740, delay: index * 65, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'backwards' });
      animations.add(animation);
      animation.finished.then(() => animations.delete(animation), () => animations.delete(animation));
    });
  }

  function enterMunicipal() {
    if (municipalEntrancePlayed || !municipalVisible || disabled || document.hidden) return;
    municipalEntrancePlayed = true;
    const stage = municipal.querySelector('.municipal-stage');
    const copy = municipal.querySelector('.municipal-copy');
    [stage, copy].filter(Boolean).forEach(node => {
      if (!node.animate) return;
      const keyframes = node === stage
        ? [{ opacity: .3, transform: 'scale(.93) rotate(2deg)' }, { opacity: 1, transform: 'none' }]
        : [{ opacity: .5 }, { opacity: 1 }];
      const animation = node.animate(keyframes, {
        duration: node === stage ? 950 : 650,
        easing: 'cubic-bezier(.16,1,.3,1)',
        fill: 'backwards'
      });
      municipalAnimations.add(animation);
      animation.finished.then(() => municipalAnimations.delete(animation), () => municipalAnimations.delete(animation));
    });
  }

  function syncActivity() {
    const awake = !disabled && !document.hidden;
    if (hero) hero.dataset.motionRunning = awake && heroVisible ? 'true' : 'false';
    if (municipal) municipal.dataset.motionRunning = awake && municipalVisible ? 'true' : 'false';
    soundButtons.forEach(button => {
      button.dataset.motionRunning = awake && soundVisible.get(button) ? 'true' : 'false';
    });
    const pointerActive = awake && heroVisible && finePointer.matches;
    const scrollActive = awake && (((heroVisible || municipalVisible) && finePointer.matches) || ribbonVisible || (!hasObserver && (hero || ribbon || municipal || soundButtons.length)));
    if (Boolean(scrollActive) !== scrollListening) {
      scrollListening = Boolean(scrollActive);
      const method = scrollListening ? 'addEventListener' : 'removeEventListener';
      window[method]('scroll', queueFrame, { passive: true });
      window[method]('resize', queueFrame, { passive: true });
    }
    if (Boolean(pointerActive) !== pointerListening) {
      pointerListening = Boolean(pointerActive);
      const method = pointerListening ? 'addEventListener' : 'removeEventListener';
      hero[method]('pointermove', movePointer, { passive: true });
      hero[method]('pointerleave', leavePointer, { passive: true });
      if (!pointerListening) resetHero();
    }
    if (!finePointer.matches) resetMunicipal();
    if (!awake || (!heroVisible && !ribbonVisible && !municipalVisible)) cancelFrame();
    animations.forEach(animation => {
      if (awake && heroVisible) animation.play();
      else animation.pause();
    });
    municipalAnimations.forEach(animation => {
      if (awake && municipalVisible) animation.play();
      else animation.pause();
    });
    enterHero();
    enterMunicipal();
  }

  function applyPreference() {
    disabled = preference ?? reduced.matches;
    document.body.dataset.motion = disabled ? 'off' : 'on';
    toggles.forEach(button => {
      button.type = 'button';
      button.hidden = false;
      button.textContent = `Efeitos: ${disabled ? 'desativados' : 'ativados'}`;
      button.setAttribute('aria-pressed', String(disabled));
      button.setAttribute('aria-label', 'Reduzir efeitos');
    });
    if (disabled) {
      cancelFrame();
      animations.forEach(animation => animation.cancel());
      animations.clear();
      municipalAnimations.forEach(animation => animation.cancel());
      municipalAnimations.clear();
      resetHero();
      resetMunicipal();
      ribbon?.style.setProperty('--ribbon-shift', '0px');
    }
    syncActivity();
    if (!disabled && (heroVisible || ribbonVisible || municipalVisible)) queueFrame();
  }

  toggles.forEach(button => button.addEventListener('click', () => {
    preference = !disabled;
    applyPreference();
  }));
  listenMedia(reduced, () => {
    preference = null;
    applyPreference();
  });
  if (hero || municipal) listenMedia(finePointer, () => { resetHero(); resetMunicipal(); syncActivity(); queueFrame(); });
  if (hero || ribbon || municipal || soundButtons.length) document.addEventListener('visibilitychange', () => {
    syncActivity();
    if (!document.hidden && (heroVisible || ribbonVisible || municipalVisible)) queueFrame();
  });
  if (hasObserver && hero) new IntersectionObserver(([entry]) => {
    heroVisible = entry.isIntersecting;
    syncActivity();
    if (heroVisible) queueFrame();
  }).observe(hero);
  if (hasObserver && ribbon) new IntersectionObserver(([entry]) => {
    ribbonVisible = entry.isIntersecting;
    syncActivity();
    if (ribbonVisible) queueFrame();
  }).observe(ribbon);
  if (hasObserver && municipal) new IntersectionObserver(([entry]) => {
    municipalVisible = entry.isIntersecting;
    syncActivity();
    if (municipalVisible) queueFrame();
  }).observe(municipal);
  if (hasObserver && soundButtons.length) {
    const soundObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => soundVisible.set(entry.target, entry.isIntersecting));
      syncActivity();
    });
    soundButtons.forEach(button => soundObserver.observe(button));
  }
  applyPreference();
})();
