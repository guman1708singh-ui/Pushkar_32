/* =========================================================
   BIRTHDAY SURPRISE WEBSITE — SCRIPT
   Vanilla JS only. Organized by feature for easy customization.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* =====================================================
     0. CUSTOMIZATION SHORTCUTS
     Change these values to personalize the site quickly.
  ===================================================== */
  const CONFIG = {
    birthdayPersonName: 'Motu 🫠❤️',
    birthdayMessage:
      "Happy Birthday! Every year that passes, you somehow manage to become even more wonderful than the last. " +
      "I hope today is filled with laughter, love, and every little thing that makes you smile. " +
      "Here's to celebrating YOU, today and always.",
    wishesSeed: [
      'Wishing you a year as amazing as you are! 🎉',
      'May all your dreams come true this year 🌟',
      'Sending you the biggest birthday hug! 🤗'
    ]
  };

  document.getElementById('birthdayName').textContent = CONFIG.birthdayPersonName;

  /* =====================================================
     1. LOADING SCREEN
  ===================================================== */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('loader-hidden'), 900);
  });
  // Fallback in case 'load' already fired
  setTimeout(() => loader.classList.add('loader-hidden'), 2500);

  /* =====================================================
     2. CUSTOM CURSOR
  ===================================================== */
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorRing = document.querySelector('.cursor-ring');
  let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX; mouseY = e.clientY;
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    cursorRing.style.left = `${ringX}px`;
    cursorRing.style.top = `${ringY}px`;
    requestAnimationFrame(animateRing);
  }
  animateRing();

  document.querySelectorAll('a, button, input').forEach(el => {
    el.addEventListener('mouseenter', () => cursorRing.classList.add('cursor-active'));
    el.addEventListener('mouseleave', () => cursorRing.classList.remove('cursor-active'));
  });

  /* =====================================================
     3. SCROLL PROGRESS BAR + NAV VISIBILITY + BACK TO TOP
  ===================================================== */
  const scrollProgressBar = document.getElementById('scrollProgressBar');
  const siteNav = document.getElementById('siteNav');
  const backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgressBar.style.width = `${progress}%`;

    if (scrollTop > 120) {
      siteNav.classList.add('nav-visible');
      backToTop.hidden = false;
    } else {
      siteNav.classList.remove('nav-visible');
      backToTop.hidden = true;
    }
  });

  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* Mobile nav toggle */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('nav-open');
    navToggle.setAttribute('aria-expanded', isOpen);
  });
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', (e) => {
      navLinks.classList.remove('nav-open');
      // BUG FIX: nav links (Memories, Timeline, Cake, etc.) pointed into
      // #mainContent, which stays [hidden] until "Open Surprise" is
      // clicked — so those links silently did nothing before that.
      // Now clicking one also reveals the surprise content first.
      const targetId = link.getAttribute('href');
      const mc = document.getElementById('mainContent');
      if (targetId && targetId !== '#hero' && mc && mc.hidden) {
        e.preventDefault();
        mc.hidden = false;
        document.getElementById('floatingMusicBtn').hidden = false;
        setTimeout(() => {
          document.querySelector(targetId)?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    });
  });

  /* Active link highlight on scroll */
  const navAnchors = document.querySelectorAll('[data-nav]');
  const observedSections = document.querySelectorAll('main section, .hero');
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navAnchors.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`));
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px' });
  observedSections.forEach(sec => sec.id && navObserver.observe(sec));

  /* =====================================================
     4. DARK / LIGHT MODE
  ===================================================== */
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const savedTheme = localStorage.getItem('bday-theme');
  if (savedTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    themeIcon.textContent = '☀️';
  }
  themeToggle.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (isDark) {
      document.documentElement.removeAttribute('data-theme');
      themeIcon.textContent = '🌙';
      localStorage.setItem('bday-theme', 'light');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      themeIcon.textContent = '☀️';
      localStorage.setItem('bday-theme', 'dark');
    }
  });

  /* =====================================================
     5. HERO CANVAS — floating hearts, stars, sparkles
  ===================================================== */
  const heroCanvas = document.getElementById('heroCanvas');
  const heroCtx = heroCanvas.getContext('2d');
  let heroParticles = [];
  const heroEmojis = ['❤️', '✨', '⭐', '💫', '💗'];

  function resizeHeroCanvas() {
    heroCanvas.width = heroCanvas.parentElement.offsetWidth;
    heroCanvas.height = heroCanvas.parentElement.offsetHeight;
  }
  resizeHeroCanvas();
  window.addEventListener('resize', resizeHeroCanvas);

  function createHeroParticles() {
    heroParticles = [];
    const count = Math.min(40, Math.floor(heroCanvas.width / 30));
    for (let i = 0; i < count; i++) {
      heroParticles.push({
        x: Math.random() * heroCanvas.width,
        y: Math.random() * heroCanvas.height + heroCanvas.height,
        size: 12 + Math.random() * 16,
        speed: 0.3 + Math.random() * 0.9,
        drift: (Math.random() - 0.5) * 0.6,
        emoji: heroEmojis[Math.floor(Math.random() * heroEmojis.length)],
        opacity: 0.35 + Math.random() * 0.5,
        angle: Math.random() * Math.PI * 2
      });
    }
  }
  createHeroParticles();

  function drawHeroParticles() {
    heroCtx.clearRect(0, 0, heroCanvas.width, heroCanvas.height);
    heroParticles.forEach(p => {
      p.y -= p.speed;
      p.x += Math.sin(p.angle + p.y * 0.01) * p.drift;
      if (p.y < -30) {
        p.y = heroCanvas.height + 30;
        p.x = Math.random() * heroCanvas.width;
      }
      heroCtx.globalAlpha = p.opacity;
      heroCtx.font = `${p.size}px sans-serif`;
      heroCtx.fillText(p.emoji, p.x, p.y);
    });
    heroCtx.globalAlpha = 1;
    requestAnimationFrame(drawHeroParticles);
  }
  drawHeroParticles();

  /* =====================================================
     6. OPEN SURPRISE BUTTON -> Reveal main content
  ===================================================== */
  const openSurpriseBtn = document.getElementById('openSurpriseBtn');
  const mainContent = document.getElementById('mainContent');

  openSurpriseBtn.addEventListener('click', () => {
    mainContent.hidden = false;
    document.getElementById('floatingMusicBtn').hidden = false;
    launchConfettiBurst(120);
    setTimeout(() => {
      document.getElementById('message').scrollIntoView({ behavior: 'smooth' });
    }, 250);
  });

  /* =====================================================
     7. SCROLL REVEAL (IntersectionObserver)
  ===================================================== */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        // Stagger children with .reveal-stagger
        const staggerChildren = entry.target.querySelectorAll('.reveal-stagger');
        staggerChildren.forEach((child, i) => {
          setTimeout(() => child.classList.add('is-visible'), i * 120);
        });
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => revealObserver.observe(el));

  /* Also observe stagger items placed outside a .reveal parent (safety)
     BUG FIX: previously this selected ALL .reveal-stagger elements,
     including ones already inside a .reveal parent. That caused a race
     condition — the child's own observer could fire immediately and
     skip the staggered delay set up above. Now it only watches
     orphan stagger items that have no .reveal ancestor. */
  const staggerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        staggerObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  document.querySelectorAll('.reveal-stagger').forEach(el => {
    if (!el.closest('.reveal')) staggerObserver.observe(el);
  });

  /* =====================================================
     8. TYPEWRITER EFFECT (Section 1)
  ===================================================== */
  const typewriterEl = document.getElementById('typewriterText');
  const messageSection = document.getElementById('message');
  let typewriterStarted = false;

  const typewriterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !typewriterStarted) {
        typewriterStarted = true;
        typeMessage(CONFIG.birthdayMessage, typewriterEl);
        typewriterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  typewriterObserver.observe(messageSection);

  function typeMessage(text, el) {
    let i = 0;
    const speed = 28;
    function step() {
      if (i < text.length) {
        el.textContent += text.charAt(i);
        i++;
        setTimeout(step, speed);
      }
    }
    step();
  }

  /* =====================================================
     9. MEMORY GALLERY + LIGHTBOX
  ===================================================== */
  const galleryItems = Array.from(document.querySelectorAll('.gallery-item img'));
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  let currentImgIndex = 0;

  function openLightbox(index) {
    currentImgIndex = index;
    lightboxImg.src = galleryItems[index].src;
    lightboxImg.alt = galleryItems[index].alt;
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    lightbox.hidden = true;
    document.body.style.overflow = '';
  }
  function showImg(delta) {
    currentImgIndex = (currentImgIndex + delta + galleryItems.length) % galleryItems.length;
    lightboxImg.src = galleryItems[currentImgIndex].src;
    lightboxImg.alt = galleryItems[currentImgIndex].alt;
  }

  galleryItems.forEach((img, i) => {
    img.parentElement.addEventListener('click', () => openLightbox(i));
  });
  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', () => showImg(-1));
  lightboxNext.addEventListener('click', () => showImg(1));
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', (e) => {
    if (lightbox.hidden) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showImg(-1);
    if (e.key === 'ArrowRight') showImg(1);
  });

  /* =====================================================
     10. MUSIC PLAYER (Section 5) + FLOATING MUSIC BUTTON
  ===================================================== */
  const bgMusic = document.getElementById('bgMusic');
  const musicPlayBtn = document.getElementById('musicPlayBtn');
  const musicPlayIcon = document.getElementById('musicPlayIcon');
  const musicBars = document.querySelector('.music-bars');
  const volumeSlider = document.getElementById('volumeSlider');
  const floatingMusicBtn = document.getElementById('floatingMusicBtn');
  const floatingMusicIcon = document.getElementById('floatingMusicIcon');

  bgMusic.volume = volumeSlider.value / 100;
  let isPlaying = false;

  function togglePlay() {
    if (isPlaying) {
      bgMusic.pause();
    } else {
      bgMusic.play().catch(() => { /* Autoplay restrictions handled gracefully */ });
    }
    isPlaying = !isPlaying;
    musicPlayIcon.textContent = isPlaying ? '❚❚' : '▶';
    musicBars.classList.toggle('playing', isPlaying);
    floatingMusicBtn.classList.toggle('playing', isPlaying);
    musicPlayBtn.setAttribute('aria-label', isPlaying ? 'Pause music' : 'Play music');
  }

  musicPlayBtn.addEventListener('click', togglePlay);
  floatingMusicBtn.addEventListener('click', togglePlay);
  volumeSlider.addEventListener('input', () => { bgMusic.volume = volumeSlider.value / 100; });

  /* ---- Voice Note player ---- */
  const voiceNoteAudio = document.getElementById('voiceNoteAudio');
  const voiceNotePlayBtn = document.getElementById('voiceNotePlayBtn');
  const voiceNotePlayIcon = document.getElementById('voiceNotePlayIcon');
  const voiceNoteBars = document.getElementById('voiceNoteBars');
  let voiceNotePlaying = false;

  voiceNotePlayBtn.addEventListener('click', () => {
    if (voiceNotePlaying) {
      voiceNoteAudio.pause();
    } else {
      // Pause background music so both don't play together
      if (isPlaying) togglePlay();
      voiceNoteAudio.play().catch(() => {});
    }
  });
  voiceNoteAudio.addEventListener('play', () => {
    voiceNotePlaying = true;
    voiceNotePlayIcon.textContent = '❚❚';
    voiceNoteBars.classList.add('playing');
    voiceNotePlayBtn.setAttribute('aria-label', 'Pause voice note');
  });
  voiceNoteAudio.addEventListener('pause', () => {
    voiceNotePlaying = false;
    voiceNotePlayIcon.textContent = '▶';
    voiceNoteBars.classList.remove('playing');
    voiceNotePlayBtn.setAttribute('aria-label', 'Play voice note');
  });
  voiceNoteAudio.addEventListener('ended', () => {
    voiceNotePlaying = false;
    voiceNotePlayIcon.textContent = '▶';
    voiceNoteBars.classList.remove('playing');
  });

  /* =====================================================
     11. CAKE CELEBRATION (Section 6)
  ===================================================== */
  const blowBtn = document.getElementById('blowBtn');
  const cakeEl = document.getElementById('cakeEl');
  const cakeSound = document.getElementById('cakeSound');

  blowBtn.addEventListener('click', () => {
    cakeEl.classList.add('blown');
    blowBtn.disabled = true;
    blowBtn.textContent = '🎉 Wish Made!';
    cakeSound.currentTime = 0;
    cakeSound.play().catch(() => {});
    launchConfettiBurst(180);
  });

  /* =====================================================
     12. WISH COUNTER (Section 7)
  ===================================================== */
  const wishForm = document.getElementById('wishForm');
  const wishInput = document.getElementById('wishInput');
  const wishList = document.getElementById('wishList');
  const likeBtn = document.getElementById('likeBtn');
  const likeCount = document.getElementById('likeCount');
  let likes = 0;

  function addWish(text) {
    const wishEl = document.createElement('div');
    wishEl.className = 'wish-item';
    wishEl.textContent = `💕 ${text}`;
    wishList.prepend(wishEl);
  }
  CONFIG.wishesSeed.forEach(addWish);

  wishForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const val = wishInput.value.trim();
    if (!val) return;
    addWish(val);
    wishInput.value = '';
    spawnHeartBurst(likeBtn);
  });

  likeBtn.addEventListener('click', () => {
    likes++;
    likeCount.textContent = likes;
    likeBtn.classList.remove('liked');
    void likeBtn.offsetWidth; // restart animation
    likeBtn.classList.add('liked');
    spawnHeartBurst(likeBtn);
  });

  function spawnHeartBurst(originEl) {
    const rect = originEl.getBoundingClientRect();
    for (let i = 0; i < 6; i++) {
      const heart = document.createElement('span');
      heart.textContent = '❤️';
      heart.style.position = 'fixed';
      heart.style.left = `${rect.left + rect.width / 2}px`;
      heart.style.top = `${rect.top}px`;
      heart.style.fontSize = '1.1rem';
      heart.style.pointerEvents = 'none';
      heart.style.zIndex = 1600;
      heart.style.transition = 'transform 1.1s ease-out, opacity 1.1s ease-out';
      document.body.appendChild(heart);
      requestAnimationFrame(() => {
        const dx = (Math.random() - 0.5) * 100;
        heart.style.transform = `translate(${dx}px, -120px) scale(1.3)`;
        heart.style.opacity = '0';
      });
      setTimeout(() => heart.remove(), 1200);
    }
  }

  /* =====================================================
     13. COUNTDOWN (Section 8)
  ===================================================== */
  const cdDays = document.getElementById('cdDays');
  const cdHours = document.getElementById('cdHours');
  const cdMins = document.getElementById('cdMins');
  const cdSecs = document.getElementById('cdSecs');
  const birthdayDateInput = document.getElementById('birthdayDate');
  const countdownSubtitle = document.getElementById('countdownSubtitle');

  // Default target: next Jan 1 as a placeholder — replace via the date picker
  function getDefaultTarget() {
    const now = new Date();
    const target = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
    if (target < now) target.setFullYear(target.getFullYear() + 1);
    return target;
  }

  let countdownTarget = getDefaultTarget();
  const savedDate = localStorage.getItem('bday-target-date');
  if (savedDate) {
    countdownTarget = new Date(savedDate);
    birthdayDateInput.value = savedDate;
  }

  birthdayDateInput.addEventListener('change', () => {
    if (!birthdayDateInput.value) return;
    countdownTarget = new Date(`${birthdayDateInput.value}T00:00:00`);
    localStorage.setItem('bday-target-date', birthdayDateInput.value);
    countdownSubtitle.textContent = 'Counting down to the big day!';
  });

  function updateCountdown() {
    const now = new Date();
    let diff = countdownTarget - now;
    if (diff < 0) diff = 0;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / (1000 * 60)) % 60);
    const secs = Math.floor((diff / 1000) % 60);
    cdDays.textContent = String(days).padStart(2, '0');
    cdHours.textContent = String(hours).padStart(2, '0');
    cdMins.textContent = String(mins).padStart(2, '0');
    cdSecs.textContent = String(secs).padStart(2, '0');
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);

  /* =====================================================
     14. FLOATING LOVE NOTES (Section 9)
  ===================================================== */
  const floatingNotesStage = document.getElementById('floatingNotesStage');
  const loveNotes = [
    'You are so loved 💗', 'Forever grateful for you 🤍', 'Here’s to more memories 🥂',
    'You make life brighter ✨', 'Simply the best 💫', 'Cherished, always ❤️'
  ];
  const notesSection = document.getElementById('notes');
  let notesInterval = null;

  function spawnFloatingNote() {
    const note = document.createElement('span');
    note.className = 'floating-note';
    note.textContent = loveNotes[Math.floor(Math.random() * loveNotes.length)];
    note.style.left = `${5 + Math.random() * 80}%`;
    note.style.setProperty('--drift', `${(Math.random() - 0.5) * 80}px`);
    note.style.animationDuration = `${6 + Math.random() * 4}s`;
    floatingNotesStage.appendChild(note);
    setTimeout(() => note.remove(), 11000);
  }

  const notesObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !notesInterval) {
        notesInterval = setInterval(spawnFloatingNote, 1400);
      } else if (!entry.isIntersecting && notesInterval) {
        clearInterval(notesInterval);
        notesInterval = null;
      }
    });
  }, { threshold: 0.2 });
  notesObserver.observe(notesSection);

  /* =====================================================
     15. FINALE — Fireworks canvas + gift reveal
  ===================================================== */
  const fireworksCanvas = document.getElementById('fireworksCanvas');
  const fwCtx = fireworksCanvas.getContext('2d');
  const finaleSection = document.getElementById('finale');
  let fireworks = [];
  let fireworksRunning = false;
  const fwColors = ['#ff6fb5', '#a24bf0', '#ffd76a', '#be185d', '#ffffff'];

  function resizeFireworksCanvas() {
    fireworksCanvas.width = finaleSection.offsetWidth;
    fireworksCanvas.height = finaleSection.offsetHeight;
  }
  resizeFireworksCanvas();
  window.addEventListener('resize', resizeFireworksCanvas);

  function createFirework() {
    const x = Math.random() * fireworksCanvas.width;
    const y = Math.random() * fireworksCanvas.height * 0.5 + 40;
    const particleCount = 34;
    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount;
      const speed = 1.5 + Math.random() * 2.5;
      fireworks.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 60 + Math.random() * 20,
        maxLife: 80,
        color: fwColors[Math.floor(Math.random() * fwColors.length)]
      });
    }
  }

  function animateFireworks() {
    if (!fireworksRunning) return;
    fwCtx.clearRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);
    fireworks.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.vy += 0.03; p.life--;
      fwCtx.globalAlpha = Math.max(p.life / p.maxLife, 0);
      fwCtx.fillStyle = p.color;
      fwCtx.beginPath();
      fwCtx.arc(p.x, p.y, 2.4, 0, Math.PI * 2);
      fwCtx.fill();
    });
    fireworks = fireworks.filter(p => p.life > 0);
    fwCtx.globalAlpha = 1;
    if (Math.random() < 0.035) createFirework();
    requestAnimationFrame(animateFireworks);
  }

  const finaleObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !fireworksRunning) {
        fireworksRunning = true;
        createFirework();
        animateFireworks();
      } else if (!entry.isIntersecting) {
        fireworksRunning = false;
      }
    });
  }, { threshold: 0.15 });
  finaleObserver.observe(finaleSection);

  /* Gift open */
  const giftBtn = document.getElementById('giftBtn');
  const giftBox = document.getElementById('giftBox');
  const finaleContent = document.getElementById('finaleContent');
  const finaleMessage = document.getElementById('finaleMessage');

  giftBtn.addEventListener('click', () => {
    giftBox.classList.add('opened');
    giftBtn.style.opacity = '0';
    launchConfettiBurst(220);
    setTimeout(() => {
      finaleContent.style.display = 'none';
      finaleMessage.hidden = false;
    }, 550);
  });

  /* =====================================================
     16. CONFETTI SYSTEM (global, reusable)
  ===================================================== */
  const confettiCanvas = document.getElementById('confettiCanvas');
  const confettiCtx = confettiCanvas.getContext('2d');
  let confettiParticles = [];
  let confettiRunning = false;
  const confettiColors = ['#ff6fb5', '#a24bf0', '#ffd76a', '#be185d', '#ffffff', '#7b2ff7'];

  function resizeConfettiCanvas() {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
  }
  resizeConfettiCanvas();
  window.addEventListener('resize', resizeConfettiCanvas);

  function launchConfettiBurst(count = 100) {
    for (let i = 0; i < count; i++) {
      confettiParticles.push({
        x: Math.random() * confettiCanvas.width,
        y: -20 - Math.random() * 100,
        size: 5 + Math.random() * 6,
        color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
        vy: 2 + Math.random() * 3,
        vx: (Math.random() - 0.5) * 3,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        life: 160
      });
    }
    if (!confettiRunning) {
      confettiRunning = true;
      animateConfetti();
    }
  }

  function animateConfetti() {
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    confettiParticles.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.rotation += p.rotationSpeed; p.life--;
      confettiCtx.save();
      confettiCtx.translate(p.x, p.y);
      confettiCtx.rotate((p.rotation * Math.PI) / 180);
      confettiCtx.fillStyle = p.color;
      confettiCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      confettiCtx.restore();
    });
    confettiParticles = confettiParticles.filter(p => p.life > 0 && p.y < confettiCanvas.height + 40);
    if (confettiParticles.length > 0) {
      requestAnimationFrame(animateConfetti);
    } else {
      confettiRunning = false;
      confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    }
  }

}); /* end DOMContentLoaded */
