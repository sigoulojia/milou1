const slides = [
  {
    chapter: '01 — INTRODUCTION',
    kicker: 'DEVELOPER · PROBLEM-SOLVER · BUILDER',
    title: 'Hey, I’m JOE.',
    description: 'A developer, problem-solver, and builder turning ideas into digital experiences.',
    footer: '01 — INTRODUCTION',
    tags: ['DEVELOPER', 'PROBLEM-SOLVER', 'BUILDER']
  },
  {
    chapter: '02 — MY MINDSET',
    kicker: 'ACTION OVER TALK',
    title: 'Built to Create.',
    description: 'I don’t just imagine possibilities. I build them.',
    footer: '02 — MY MINDSET',
    tags: ['MINDSET', 'EXECUTION', 'CREATE']
  },
  {
    chapter: '03 — MY FIELD',
    kicker: 'CRAFT & ENGINEERING',
    title: 'Software Development.',
    description: 'From web applications to desktop software, I enjoy building useful, practical solutions.',
    footer: '03 — MY FIELD',
    lines: [
      'Web applications & platforms',
      'Desktop & practical system software',
      'Useful, real-world solutions'
    ]
  },
  {
    chapter: '04 — AI & INNOVATION',
    kicker: 'NEXT-GEN DEVELOPMENT',
    title: 'Building With AI.',
    description: 'I use AI to accelerate development, explore ideas, and turn concepts into working products.',
    footer: '04 — AI & INNOVATION',
    lines: [
      'Accelerate development velocity',
      'Explore uncharted ideas & concepts',
      'Turn prototypes into working products'
    ]
  },
  {
    chapter: '05 — VIBE CODING',
    kicker: 'CREATIVITY × AI × CODE',
    title: 'Less Typing. More Building.',
    description: 'Combining creativity, AI, and engineering to bring ideas to life faster.',
    footer: '05 — VIBE CODING',
    tags: ['VIBE CODING', 'RAPID PROTOTYPING', 'HIGH VELOCITY']
  },
  {
    chapter: '06 — MY APPROACH',
    kicker: 'DESIGN & EXPERIENCE',
    title: 'Function Meets Design.',
    description: 'I value clean interfaces, smooth experiences, and software that actually works.',
    footer: '06 — MY APPROACH',
    lines: [
      'Clean & intuitive interfaces',
      'Smooth, responsive experiences',
      'Software that actually works'
    ]
  },
  {
    chapter: '07 — MY AMBITION',
    kicker: 'MISSION & VALUE',
    title: 'Think Beyond Code.',
    description: 'My goal is to build products that solve real problems and create meaningful value.',
    footer: '07 — MY AMBITION',
    lines: [
      'Solve real-world problems',
      'Create meaningful, lasting value',
      'Think beyond syntax and code'
    ]
  },
  {
    chapter: '08 — MY PHILOSOPHY',
    kicker: 'CONTINUOUS EVOLUTION',
    title: 'Learn. Build. Improve.',
    description: 'Every challenge is an opportunity to learn something new and build something better.',
    footer: '08 — MY PHILOSOPHY',
    tags: ['LEARN', 'BUILD', 'IMPROVE']
  },
  {
    chapter: '09 — THE VISION',
    kicker: 'THE JOURNEY CONTINUES',
    title: 'Just Getting Started.',
    description: 'Independent in thought. Curious by nature. Focused on what comes next.\n\n— JOE',
    footer: '09 — THE VISION · JOE',
    lines: [
      'Independent in thought',
      'Curious by nature',
      'Focused on what comes next'
    ]
  }
];

const $ = (selector, root = document) => root.querySelector(selector);
const storyCard = $('#story-card');
const cardCopy = $('#card-copy');
const currentNumber = $('#slide-current');
const progress = $('#deck-progress');
let currentSlide = 0;
let transitionTimer;

function renderSlide(index, animate = false, reverse = false) {
  currentSlide = (index + slides.length) % slides.length;
  const slide = slides[currentSlide];
  if (animate) {
    const stack = storyCard.closest('.card-stack');
    stack.querySelectorAll('.ghost-card').forEach(g => g.remove());
    const ghost = storyCard.cloneNode(true);
    ghost.removeAttribute('id');
    ghost.classList.add('ghost-card');
    ghost.classList.add(reverse ? 'going-prev' : 'going-next');
    stack.appendChild(ghost);

    stack.classList.add('changing');
    paintSlide(slide);

    window.clearTimeout(transitionTimer);
    transitionTimer = window.setTimeout(() => {
      ghost.remove();
      stack.classList.remove('changing');
    }, 320);
  } else {
    paintSlide(slide);
  }
  currentNumber.textContent = String(currentSlide + 1);
  $('#card-chapter').textContent = slide.chapter;
  $('#card-index-label').textContent = slide.footer;
  [...progress.children].forEach((dot, i) => {
    dot.classList.toggle('is-active', i === currentSlide);
    if (i === currentSlide) dot.setAttribute('aria-current', 'step');
    else dot.removeAttribute('aria-current');
  });
}

function paintSlide(slide) {
  cardCopy.replaceChildren();
  const kicker = document.createElement('p');
  kicker.className = 'card-kicker';
  kicker.textContent = slide.kicker;
  const title = document.createElement('h1');
  title.className = 'card-title';
  title.textContent = slide.title;
  const description = document.createElement('p');
  description.className = 'card-description';
  description.textContent = slide.description;
  cardCopy.append(kicker, title, description);

  if (slide.lines?.length) {
    const list = document.createElement('div');
    list.className = 'card-lines';
    for (const text of slide.lines) {
      const line = document.createElement('div');
      line.className = 'card-line';
      line.textContent = text;
      list.append(line);
    }
    cardCopy.append(list);
  }
  if (slide.metrics?.length) {
    const grid = document.createElement('div');
    grid.className = 'stats-grid';
    const counters = [];
    for (const metric of slide.metrics) {
      const tile = document.createElement('div');
      tile.className = 'stat-tile';
      const value = document.createElement('strong');
      value.className = 'stat-value';
      value.textContent = `${metric.prefix || ''}0${metric.suffix || ''}`;
      const label = document.createElement('span');
      label.className = 'stat-label';
      label.textContent = metric.label;
      tile.append(value, label);
      grid.append(tile);
      counters.push({ element: value, ...metric });
    }
    cardCopy.append(grid);
    const duration = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 500;
    const started = performance.now();
    const tick = (now) => {
      const progress = duration === 0 ? 1 : Math.min(1, (now - started) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      counters.forEach((counter) => {
        const number = Math.round(counter.target * eased).toLocaleString();
        counter.element.textContent = `${counter.prefix || ''}${number}${counter.suffix || ''}`;
      });
      if (progress < 1) window.requestAnimationFrame(tick);
    };
    window.requestAnimationFrame(tick);
  }
  if (slide.tags?.length) {
    const tags = document.createElement('div');
    tags.className = 'card-tags';
    for (const text of slide.tags) {
      const tag = document.createElement('span');
      tag.className = 'card-tag';
      tag.textContent = text;
      tags.append(tag);
    }
    cardCopy.append(tags);
  }
  if (slide.link) {
    const link = document.createElement('a');
    link.className = 'card-cta';
    link.href = slide.link.href;
    link.target = slide.link.href.startsWith('https:') ? '_blank' : '_self';
    if (link.target === '_blank') link.rel = 'noreferrer noopener';
    link.textContent = slide.link.label;
    const arrow = document.createElement('span');
    arrow.setAttribute('aria-hidden', 'true');
    arrow.textContent = '↗';
    link.append(arrow);
    cardCopy.append(link);
  }
}

for (let i = 0; i < slides.length; i++) {
  const dot = document.createElement('button');
  dot.type = 'button';
  dot.className = 'progress-dot';
  dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
  dot.addEventListener('click', (e) => {
    e.currentTarget.blur();
    renderSlide(i, true, i < currentSlide);
  });
  progress.append(dot);
}

$('#previous-card').addEventListener('click', (e) => {
  e.currentTarget.blur();
  renderSlide(currentSlide - 1, true, true);
});
$('#next-card').addEventListener('click', (e) => {
  e.currentTarget.blur();
  renderSlide(currentSlide + 1, true, false);
});
$('#story-card').addEventListener('click', (event) => {
  if (window.hasDraggedSpace) return;
  if (event.target.closest('a') || event.target.closest('button')) return;
  renderSlide(currentSlide + 1, true, false);
});
$('#story-card').style.cursor = 'grab';

let wheelTimer;
$('#story-card').closest('.story').addEventListener('wheel', (event) => {
  event.preventDefault();
  if (wheelTimer) return;
  const reverse = event.deltaY < 0;
  renderSlide(currentSlide + (reverse ? -1 : 1), true, reverse);
  wheelTimer = window.setTimeout(() => wheelTimer = null, 360);
}, { passive: false });

document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft') renderSlide(currentSlide - 1, true, true);
  if (event.key === 'ArrowRight') renderSlide(currentSlide + 1, true, false);
});

renderSlide(0);

// Site Preloader & 60 FPS Snake Animation Loader ("واجهة الأفعى لتنزيل موارد الموقع")
function initSiteLoader() {
  const loader = document.getElementById('site-loader');
  if (!loader) return;

  const imageAssets = [
    './cat.png',
    './character.png',
    './camera.png',
    './call-me.png',
    './airplane.png',
    './parfume1.png',
    './parfume2.png',
    './algerianflag.png',
    './cj-glasses.png',
    './cup1.png',
    './cup2.png',
    './headphones.png',
    './lego.png',
    './like-hand.png',
    './my-bike.png',
    './my-shoes.png',
    './pc.png',
    './red-box.png',
    './car.png',
    './email-me.png',
    './whatsapp-me.png',
    './linkedin.png',
    './think.png',
    './bulb.png',
    './psp.png',
    './milo-mark.svg'
  ];

  const audioAssets = [
    'sound/californication.mp3',
    'sound/hippies.mp3',
    'sound/kita.mp3',
    'sound/spray.mp3',
    'sound/airplane.mp3',
    'sound/dz.mp3',
    'sound/phonering.mp3',
    'sound/camera.mp3',
    'sound/cat.mp3',
    'sound/snoopdog.mp3',
    'sound/clink.mp3',
    'sound/bike.mp3',
    'sound/car.mp3'
  ];

  let loadedItems = 0;
  const totalItems = imageAssets.length + audioAssets.length + 1; // +1 for fonts
  let visualPercent = 0;
  const startTime = performance.now();
  const minDisplayMs = 2100; // minimum duration so the 60fps JOE snake stroke fully draws
  let allAssetsDone = false;
  let isFinished = false;

  function finishLoader() {
    if (isFinished) return;
    isFinished = true;
    setTimeout(() => {
      loader.classList.add('is-hidden');
      setTimeout(() => {
        loader.style.display = 'none';
      }, 700);
    }, 280);
  }

  const markOneLoaded = (name) => {
    loadedItems++;
    if (loadedItems >= totalItems) {
      allAssetsDone = true;
    }
  };

  // 1. Preload sticker & UI images
  imageAssets.forEach((src) => {
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => markOneLoaded(src);
    img.onerror = () => markOneLoaded(src);
    img.src = src;
  });

  // 2. Preload Audio buffers (including Californication)
  audioAssets.forEach((src) => {
    const audio = new Audio();
    audio.preload = 'auto';
    let loaded = false;
    const onAudioReady = () => {
      if (loaded) return;
      loaded = true;
      audio.removeEventListener('canplaythrough', onAudioReady);
      audio.removeEventListener('canplay', onAudioReady);
      audio.removeEventListener('error', onAudioReady);
      markOneLoaded(src);
    };
    audio.addEventListener('canplaythrough', onAudioReady, { once: true });
    audio.addEventListener('canplay', onAudioReady, { once: true });
    audio.addEventListener('error', onAudioReady, { once: true });
    audio.src = src;
    audio.load();
  });

  // 3. Preload web fonts
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => markOneLoaded('fonts')).catch(() => markOneLoaded('fonts'));
  } else {
    markOneLoaded('fonts');
  }

  // Smooth 60 FPS requestAnimationFrame ticker loop
  function tick(timestamp) {
    if (isFinished) return;
    const elapsed = timestamp - startTime;
    const timeProgress = Math.min(100, (elapsed / minDisplayMs) * 100);
    const realProgress = Math.min(100, (loadedItems / totalItems) * 100);

    // Loader will not advance past real assets loading until they are buffered & loaded
    const target = allAssetsDone ? Math.max(timeProgress, realProgress) : Math.min(timeProgress, realProgress);

    if (visualPercent < target) {
      visualPercent += (target - visualPercent) * 0.14 + 0.25;
      if (visualPercent > target) visualPercent = target;
      if (visualPercent > 100) visualPercent = 100;
    }

    if (elapsed >= minDisplayMs && allAssetsDone && visualPercent >= 99.5) {
      finishLoader();
      return;
    }

    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

initSiteLoader();

// Mouse parallax tilt & grid motion
let pointerFrame = false;
const finePointer = window.matchMedia('(pointer: fine)').matches;
if (finePointer) {
  document.addEventListener('pointermove', (event) => {
    if (pointerFrame) return;
    pointerFrame = true;
    requestAnimationFrame(() => {
      const x = event.clientX / window.innerWidth - 0.5;
      const y = event.clientY / window.innerHeight - 0.5;
      document.documentElement.style.setProperty('--grid-x', `${x * -12}px`);
      document.documentElement.style.setProperty('--grid-y', `${y * -9}px`);
      const bounds = storyCard.getBoundingClientRect();
      const px = (event.clientX - bounds.left) / bounds.width;
      const py = (event.clientY - bounds.top) / bounds.height;
      if (px >= 0 && px <= 1 && py >= 0 && py <= 1) {
        storyCard.style.setProperty('--card-tilt-x', `${(0.5 - py) * 2.3}deg`);
        storyCard.style.setProperty('--card-tilt-y', `${(px - 0.5) * 2.3}deg`);
      } else {
        storyCard.style.setProperty('--card-tilt-x', '0deg');
        storyCard.style.setProperty('--card-tilt-y', '0deg');
      }
      pointerFrame = false;
    });
  }, { passive: true });
}

// Touch swipe support for cards
let touchStartX = null;
$('#story-card').addEventListener('touchstart', (event) => { touchStartX = event.changedTouches[0]?.clientX ?? null; }, { passive: true });
$('#story-card').addEventListener('touchend', (event) => {
  if (touchStartX === null) return;
  const delta = event.changedTouches[0].clientX - touchStartX;
  if (Math.abs(delta) > 42) {
    const reverse = delta > 0;
    renderSlide(currentSlide + (reverse ? -1 : 1), true, reverse);
  }
  touchStartX = null;
}, { passive: true });

// Background Space Panning
window.hasDraggedSpace = false;
let isPanningSpace = false;
let panStartX = 0;
let panStartY = 0;
let currentPanX = 0;
let currentPanY = 0;
let savedPanX = 0;
let savedPanY = 0;
const stageEl = document.getElementById('top');

document.addEventListener('pointerdown', (e) => {
  if (e.target.closest('button') || e.target.closest('a') || e.target.closest('input') || e.target.closest('textarea')) return;
  if (e.target.closest('.draggable-sticker')) return;

  isPanningSpace = true;
  window.hasDraggedSpace = false;
  panStartX = e.clientX;
  panStartY = e.clientY;
  document.body.style.cursor = 'grabbing';
});

document.addEventListener('pointermove', (e) => {
  if (!isPanningSpace) return;
  const dx = e.clientX - panStartX;
  const dy = e.clientY - panStartY;
  if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
    window.hasDraggedSpace = true;
  }
  currentPanX = savedPanX + dx;
  currentPanY = savedPanY + dy;
  stageEl.style.transform = `translate(${currentPanX}px, ${currentPanY}px)`;
  document.documentElement.style.setProperty('--pan-x', `${currentPanX * 0.15}px`);
  document.documentElement.style.setProperty('--pan-y', `${currentPanY * 0.15}px`);
});

const endPan = () => {
  if (isPanningSpace) {
    isPanningSpace = false;
    document.body.style.cursor = '';
    savedPanX = currentPanX;
    savedPanY = currentPanY;
    setTimeout(() => window.hasDraggedSpace = false, 50);
  }
};
document.addEventListener('pointerup', endPan);
document.addEventListener('pointercancel', endPan);

// ==========================================
// 🎵 AUDIO MANAGER (Real Sound Effects from sound/)
// ==========================================
class SoundManager {
  constructor() {
    this.activeAudios = {};
    this.ctx = null;
  }

  // Play audio file from sound/ folder
  play(src, options = {}) {
    try {
      if (options.singleton && this.activeAudios[src]) {
        this.activeAudios[src].pause();
        this.activeAudios[src].currentTime = 0;
        if (options.toggle) {
          delete this.activeAudios[src];
          return null;
        }
      }

      const audio = new Audio(src);
      this.activeAudios[src] = audio;
      if (options.volume !== undefined) audio.volume = options.volume;

      // Handle custom starting time offset (e.g. Snoop Dogg at second 10)
      if (options.startTime) {
        audio.currentTime = options.startTime;
        audio.addEventListener('loadedmetadata', () => {
          try { audio.currentTime = options.startTime; } catch (_) { }
        }, { once: true });
        audio.addEventListener('canplay', () => {
          try {
            if (audio.currentTime < options.startTime) {
              audio.currentTime = options.startTime;
            }
          } catch (_) { }
        }, { once: true });
      }

      const p = audio.play();
      if (p !== undefined) {
        p.catch(err => console.warn('Audio play notice:', err));
      }

      // Handle custom ending time
      if (options.endTime) {
        audio.ontimeupdate = () => {
          if (audio.currentTime >= options.endTime) {
            audio.pause();
            audio.currentTime = 0;
            delete this.activeAudios[src];
            if (options.onStop) options.onStop();
          }
        };
      }

      // Optional auto-stop duration in seconds
      if (options.duration) {
        setTimeout(() => {
          if (this.activeAudios[src] === audio) {
            audio.pause();
            audio.currentTime = 0;
            delete this.activeAudios[src];
            if (options.onStop) options.onStop();
          }
        }, options.duration * 1000);
      }

      audio.onended = () => {
        if (this.activeAudios[src] === audio) {
          delete this.activeAudios[src];
          if (options.onStop) options.onStop();
        }
      };

      return audio;
    } catch (e) {
      console.warn('Sound play error:', e);
    }
  }

  // Stop ALL playing sounds across all icons
  stopAll() {
    Object.keys(this.activeAudios).forEach((src) => {
      const a = this.activeAudios[src];
      if (a) {
        try {
          a.pause();
          a.currentTime = 0;
        } catch (_) { }
      }
    });
    this.activeAudios = {};
  }

  stop(src) {
    if (this.activeAudios[src]) {
      this.activeAudios[src].pause();
      this.activeAudios[src].currentTime = 0;
      delete this.activeAudios[src];
    }
  }

  isPlaying(src) {
    const a = this.activeAudios[src];
    return a && !a.paused && a.currentTime > 0;
  }

  // Fallback procedural sounds for items without files
  initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') this.ctx.resume();
  }

  // Mechanical Split-Flap clicking sound
  playFlapClick() {
    if (this.flapSoundEnabled === false) return;
    try {
      this.initCtx();
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(160 + Math.random() * 60, now);
      osc.frequency.exponentialRampToValueAtTime(35, now + 0.022);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, now);

      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.022);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.025);
    } catch (_) { }
  }

  shoesSteps() {
    this.initCtx();
    [0, 0.45, 0.9, 1.35].forEach(offset => {
      setTimeout(() => {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(120, now);
        osc.frequency.exponentialRampToValueAtTime(45, now + 0.08);
        gain.gain.setValueAtTime(0.45, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.09);
      }, offset * 1000);
    });
  }

  likePop() {
    this.initCtx();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.13);
  }

  pcBoot() {
    this.initCtx();
    const now = this.ctx.currentTime;
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.1);
      gain.gain.setValueAtTime(0.25, now + i * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.8);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + i * 0.1);
      osc.stop(now + i * 0.1 + 0.85);
    });
  }

  thinkDing() {
    this.initCtx();
    const now = this.ctx.currentTime;
    // Harmonic frequencies for rich crystal idea chime (E5, E6, E7)
    const tones = [
      { freq: 659.25, gain: 0.16, decay: 0.55 },
      { freq: 1318.5, gain: 0.32, decay: 0.85 },
      { freq: 2637.0, gain: 0.14, decay: 0.45 }
    ];
    tones.forEach(({ freq, gain: vol, decay }) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.015, now + 0.05);
      gain.gain.setValueAtTime(vol, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + decay);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + decay + 0.05);
    });
  }

  pspChime() {
    this.initCtx();
    const now = this.ctx.currentTime;
    // Classic handheld PlayStation portable ascending harmonic chime (E5 -> B5 -> E6)
    const tones = [
      { freq: 659.25, time: 0, dur: 0.28, gain: 0.2 },
      { freq: 987.77, time: 0.12, dur: 0.35, gain: 0.22 },
      { freq: 1318.51, time: 0.26, dur: 0.65, gain: 0.26 }
    ];
    tones.forEach(({ freq, time, dur, gain: vol }) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + time);
      gain.gain.setValueAtTime(vol, now + time);
      gain.gain.exponentialRampToValueAtTime(0.001, now + time + dur);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + time);
      osc.stop(now + time + dur + 0.05);
    });
  }

  helloChirp() {
    this.initCtx();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.frequency.setValueAtTime(580, now);
    osc.frequency.exponentialRampToValueAtTime(920, now + 0.12);
    gain.gain.setValueAtTime(0.28, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.2);
  }
}

const sounds = new SoundManager();

// ==========================================
// 🎨 INTERACTIVE STICKERS SYSTEM
// ==========================================
let highestStickerZ = 30;

function setupStickerInteractions() {
  const stickers = Array.from(document.querySelectorAll('.draggable-sticker'));
  const cameraFlash = document.getElementById('camera-flash');
  const legoContainer = document.getElementById('lego-container');
  const likeBadge = document.getElementById('like-badge');
  const callPopover = document.getElementById('call-popover');

  // Character Quotes Setup
  const charQuote = document.getElementById('character-quote');
  const charQuoteText = document.getElementById('character-quote-text');
  let charQuoteTimer = null;
  const characterQuotes = [
    "“Thinking is apparently optional.”",
    "“Delusion is a dangerous skill.”",
    "“Confidence exceeds intelligence. Classic.”",
    "“Money talks. Poverty explains.”",
    "“Patience has officially left the chat.”",
    "“Silence speaks louder than explanations.”",
    "“Growth often comes with loneliness.”",
    "“Peace over pointless connections.”",
    "“Actions reveal what words conceal.”",
    "“My path, my rules.”"
  ];
  let charQuoteIndex = 0;

  // Headphones Music Playlist
  const musicPlaylist = [
    {
      title: 'Californication',
      artist: 'Red Hot Chili Peppers',
      src: 'sound/californication.mp3'
    },
    {
      title: 'Hippies & Cowboys',
      artist: 'Cody Jinks',
      src: 'sound/hippies.mp3'
    },
    {
      title: 'Kita Usahakan Rumah Itu',
      artist: 'Sal Priadi',
      src: 'sound/kita.mp3'
    }
  ];
  let currentPlaylistIndex = -1;
  let musicToastTimer = null;
  const musicToast = document.getElementById('music-track-toast');
  const musicToastTitle = document.getElementById('music-toast-title');
  const musicToastArtist = document.getElementById('music-toast-artist');

  function showTrackToast(track) {
    if (!musicToast || !musicToastTitle || !musicToastArtist) return;
    musicToastTitle.textContent = track.title;
    musicToastArtist.textContent = track.artist;
    musicToast.hidden = false;
    musicToast.classList.remove('is-leaving');
    clearTimeout(musicToastTimer);
    musicToastTimer = setTimeout(() => {
      musicToast.classList.add('is-leaving');
      musicToastTimer = setTimeout(() => {
        musicToast.hidden = true;
        musicToast.classList.remove('is-leaving');
      }, 230);
    }, 3400);
  }

  // Load and display persisted Likes count
  let likesCount = parseInt(localStorage.getItem('JOE_likes_count') || '14', 10);
  if (likeBadge) likeBadge.textContent = `${likesCount} Likes`;

  // Organic quadrant sectors for random placement (responsive for desktop and mobile)
  const isMobile = window.innerWidth <= 680;
  const baseSectors = isMobile ? [
    { x: 4, y: 8 }, { x: 22, y: 6 }, { x: 68, y: 6 }, { x: 84, y: 10 },
    { x: 3, y: 38 }, { x: 86, y: 36 }, { x: 4, y: 64 }, { x: 86, y: 66 },
    { x: 8, y: 84 }, { x: 26, y: 86 }, { x: 62, y: 86 }, { x: 82, y: 84 },
    { x: 44, y: 88 }, { x: 12, y: 22 }, { x: 80, y: 20 }, { x: 36, y: 6 }
  ] : [
    { x: 6, y: 10 }, { x: 26, y: 8 }, { x: 74, y: 8 }, { x: 88, y: 14 },
    { x: 5, y: 35 }, { x: 86, y: 34 }, { x: 7, y: 62 }, { x: 86, y: 64 },
    { x: 12, y: 82 }, { x: 28, y: 84 }, { x: 60, y: 84 }, { x: 78, y: 82 },
    { x: 44, y: 86 }, { x: 18, y: 46 }, { x: 80, y: 48 }, { x: 38, y: 8 },
    { x: 64, y: 10 }, { x: 14, y: 24 }, { x: 82, y: 22 }
  ];
  const shuffledSectors = baseSectors.slice().sort(() => Math.random() - 0.5);

  let sectorIdx = 0;

  stickers.forEach((sticker) => {
    const type = sticker.dataset.sticker;

    // Special placement for anchors (cat & character remain attached to cards)
    if (type === 'cat' || type === 'character') {
      // Anchored via CSS parent!
    } else if (type === 'cup1' || type === 'cup2') {
      // Place cups near each other
      const cupBaseX = isMobile ? 8 : 18;
      const cupBaseY = isMobile ? 82 : 74;
      const offsetX = type === 'cup1' ? 0 : (isMobile ? 12 : 7);
      sticker.style.left = `${cupBaseX + offsetX}%`;
      sticker.style.top = `${cupBaseY}%`;
      sticker.style.transform = `translate(0px, 0px) rotate(${type === 'cup1' ? -4 : 4}deg)`;
    } else if (type === 'think') {
      // Place think sticker with plenty of headroom so the bulb popup above it is fully visible
      sticker.style.left = isMobile ? '78%' : '74%';
      sticker.style.top = isMobile ? '28%' : '36%';
      sticker.style.transform = 'translate(0px, 0px) rotate(2deg)';
    } else {
      // General random placement
      const sector = shuffledSectors[sectorIdx % shuffledSectors.length];
      sectorIdx++;
      const jX = (Math.random() - 0.5) * (isMobile ? 3 : 6);
      const jY = (Math.random() - 0.5) * (isMobile ? 3 : 6);
      const minX = isMobile ? 3 : 4;
      const maxX = isMobile ? 82 : 88;
      const posX = Math.max(minX, Math.min(maxX, sector.x + jX));
      const posY = Math.max(6, Math.min(85, sector.y + jY));
      const initialRot = Number((Math.random() * 20 - 10).toFixed(1));

      sticker.style.left = `${posX.toFixed(1)}%`;
      sticker.style.top = `${posY.toFixed(1)}%`;
      sticker.style.transform = `translate(0px, 0px) rotate(${initialRot}deg)`;
    }

    // Drag vs Click Tracking
    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let transX = 0;
    let transY = 0;
    const initialTransform = sticker.style.transform;
    if (initialTransform) {
      const match = initialTransform.match(/translate\(([-\d.]+)px,\s*([-\d.]+)px\)/);
      if (match) {
        transX = parseFloat(match[1]);
        transY = parseFloat(match[2]);
      }
    }
    let pointerDownX = 0;
    let pointerDownY = 0;
    let hasMoved = false;

    sticker.addEventListener('pointerdown', (e) => {
      if (e.button !== 0 && e.pointerType === 'mouse') return;
      if (e.target.closest('a')) return;
      e.stopPropagation();

      // Clear any accidental blue outline or text focus
      if (document.activeElement && document.activeElement.blur) {
        document.activeElement.blur();
      }
      window.getSelection()?.removeAllRanges();

      isDragging = true;
      hasMoved = false;
      pointerDownX = e.clientX;
      pointerDownY = e.clientY;

      highestStickerZ++;
      sticker.style.zIndex = highestStickerZ;

      dragStartX = e.clientX - transX;
      dragStartY = e.clientY - transY;
      sticker.setPointerCapture(e.pointerId);
    });

    sticker.addEventListener('pointermove', (e) => {
      if (!isDragging) return;
      e.stopPropagation();
      const dist = Math.hypot(e.clientX - pointerDownX, e.clientY - pointerDownY);
      if (dist > 5) {
        hasMoved = true;
        sticker.classList.add('is-dragging');
        transX = e.clientX - dragStartX;
        transY = e.clientY - dragStartY;
        sticker.style.transform = `translate(${transX}px, ${transY}px) scale(1.06)`;
      }
    });

    const finishPointer = (e) => {
      if (!isDragging) return;
      isDragging = false;
      sticker.classList.remove('is-dragging');
      try { sticker.releasePointerCapture(e.pointerId); } catch (_) { }

      // If user tapped/clicked without dragging: TRIGGER EFFECT!
      if (!hasMoved) {
        triggerStickerAction(type, sticker, e);
      }
    };

    sticker.addEventListener('pointerup', finishPointer);
    sticker.addEventListener('dragstart', (e) => e.preventDefault());
  });

  // Action Dispatcher for all Stickers
  function triggerStickerAction(type, sticker, event) {
    const rect = sticker.getBoundingClientRect();

    // 1. Immediately stop any currently playing sound from previous icons!
    sounds.stopAll();

    // 2. Remove active playing classes from all other stickers
    document.querySelectorAll('.flag-playing, .headphones-playing, .glasses-thug').forEach(el => {
      if (el !== sticker) {
        el.classList.remove('flag-playing', 'headphones-playing', 'glasses-thug');
      }
    });

    // If another sticker is clicked, dismiss character quote and music toast
    if (type !== 'character' && charQuote && !charQuote.hidden) {
      clearTimeout(charQuoteTimer);
      charQuote.classList.remove('is-leaving');
      charQuote.hidden = true;
    }
    if (type !== 'headphones' && musicToast && !musicToast.hidden) {
      clearTimeout(musicToastTimer);
      musicToast.classList.remove('is-leaving');
      musicToast.hidden = true;
    }

    switch (type) {
      // 1. Perfumes: real spray sound from sound/spray.mp3
      case 'parfume1':
      case 'parfume2':
        sounds.play('sound/spray.mp3');
        break;

      // 2. Airplane: real takeoff sound from sound/airplane.mp3 + 7-second flight + opens Airport Board!
      case 'airplane':
        if (sticker.classList.contains('airplane-flying')) return;
        sounds.play('sound/airplane.mp3');
        sticker.classList.add('airplane-flying');
        setTimeout(() => sticker.classList.remove('airplane-flying'), 7100);
        if (typeof window.openAirportBoard === 'function') {
          setTimeout(() => window.openAirportBoard(), 650);
        }
        break;

      // 3. Algerian Flag: first 10s of Kassaman anthem from sound/dz.mp3 + wave
      case 'flag':
        sounds.play('sound/dz.mp3', {
          singleton: true,
          duration: 10,
          onStop: () => sticker.classList.remove('flag-playing')
        });
        sticker.classList.add('flag-playing');
        break;

      // 4. Call Me: phone ring from sound/phonering.mp3 + show popover with phone number
      case 'call':
        sounds.play('sound/phonering.mp3');
        if (callPopover) {
          callPopover.hidden = !callPopover.hidden;
        }
        break;

      // 5. Camera: real shutter click from sound/camera.mp3 + screen flash
      case 'camera':
        sounds.play('sound/camera.mp3');
        if (cameraFlash) {
          cameraFlash.classList.add('is-flashing');
          setTimeout(() => cameraFlash.classList.remove('is-flashing'), 140);
        }
        const camSlot = document.getElementById('camera-slot');
        if (camSlot) {
          camSlot.hidden = false;
          setTimeout(() => camSlot.hidden = true, 2600);
        }
        break;

      // 6. Cat: real cat meow from sound/cat.mp3 + stretch on cards
      case 'cat':
        sounds.play('sound/cat.mp3');
        sticker.classList.remove('cat-meowing');
        void sticker.offsetWidth;
        sticker.classList.add('cat-meowing');
        break;

      // 7. Character: quote speech bubble from user's quotes + wave & bounce
      case 'character':
        sounds.helloChirp();
        sticker.classList.remove('char-bouncing');
        void sticker.offsetWidth;
        sticker.classList.add('char-bouncing');

        if (charQuote && charQuoteText) {
          clearTimeout(charQuoteTimer);
          const quote = characterQuotes[charQuoteIndex % characterQuotes.length];
          charQuoteIndex = (charQuoteIndex + 1) % characterQuotes.length;
          charQuoteText.textContent = quote;

          charQuote.classList.remove('is-leaving');
          void charQuote.offsetWidth;
          charQuote.hidden = false;

          charQuoteTimer = setTimeout(() => {
            charQuote.classList.add('is-leaving');
            charQuoteTimer = setTimeout(() => {
              charQuote.hidden = true;
              charQuote.classList.remove('is-leaving');
            }, 260);
          }, 3600);
        }
        break;

      // 8. CJ Glasses: starts at second 10 and ends at second 15!
      case 'glasses':
        sounds.play('sound/snoopdog.mp3', {
          startTime: 10,
          endTime: 15,
          duration: 5,
          singleton: true,
          onStop: () => sticker.classList.remove('glasses-thug')
        });
        sticker.classList.remove('glasses-thug');
        void sticker.offsetWidth;
        sticker.classList.add('glasses-thug');
        break;

      // 9. Cups: real glass toast clink from sound/clink.mp3 + cheers animation
      case 'cup1':
      case 'cup2':
        sounds.play('sound/clink.mp3');
        const cup1 = document.getElementById('sticker-cup1');
        const cup2 = document.getElementById('sticker-cup2');
        if (cup1) {
          cup1.classList.remove('cup1-toasting');
          void cup1.offsetWidth;
          cup1.classList.add('cup1-toasting');
          setTimeout(() => cup1.classList.remove('cup1-toasting'), 800);
        }
        if (cup2) {
          cup2.classList.remove('cup2-toasting');
          void cup2.offsetWidth;
          cup2.classList.add('cup2-toasting');
          setTimeout(() => cup2.classList.remove('cup2-toasting'), 800);
        }
        break;

      // 10. Headphones: Cycle to next song in playlist on each click!
      case 'headphones':
        currentPlaylistIndex = (currentPlaylistIndex + 1) % musicPlaylist.length;
        const currentTrack = musicPlaylist[currentPlaylistIndex];
        showTrackToast(currentTrack);

        sounds.play(currentTrack.src, {
          singleton: true,
          onStop: () => {
            if (sticker.classList.contains('headphones-playing')) {
              // Auto-advance to next track when finished
              currentPlaylistIndex = (currentPlaylistIndex + 1) % musicPlaylist.length;
              const nextTrack = musicPlaylist[currentPlaylistIndex];
              showTrackToast(nextTrack);
              sounds.play(nextTrack.src, {
                singleton: true,
                onStop: () => sticker.classList.remove('headphones-playing')
              });
            }
          }
        });
        sticker.classList.remove('headphones-playing');
        void sticker.offsetWidth;
        sticker.classList.add('headphones-playing');
        break;

      // 11. Lego: Lego brick rain for 5 seconds
      case 'lego':
        spawnLegoRain();
        break;

      // 12. Like Hand: +1 Like pop + increments & saves counter
      case 'like':
        sounds.likePop();
        likesCount++;
        localStorage.setItem('JOE_likes_count', String(likesCount));
        if (likeBadge) likeBadge.textContent = `${likesCount} Likes`;
        spawnFloatingLike(rect.left + rect.width * 0.5, rect.top);
        break;

      // 13. My Bike: real bike sound from sound/bike.mp3 + ride across screen & return
      case 'bike':
        if (sticker.classList.contains('bike-riding')) return;
        sounds.play('sound/bike.mp3');
        sticker.classList.add('bike-riding');
        setTimeout(() => sticker.classList.remove('bike-riding'), 4600);
        break;

      // 14. My Shoes: walk in place without moving
      case 'shoes':
        sounds.shoesSteps();
        sticker.classList.remove('shoes-stepping');
        void sticker.offsetWidth;
        sticker.classList.add('shoes-stepping');
        setTimeout(() => sticker.classList.remove('shoes-stepping'), 1800);
        break;

      // 15. PC: boot chime + glow
      case 'pc':
        sounds.pcBoot();
        break;

      // 16. Red Box: real telephone ring from sound/phonering.mp3 + ringing shake
      case 'redbox':
        sounds.play('sound/phonering.mp3');
        sticker.classList.remove('box-ringing');
        void sticker.offsetWidth;
        sticker.classList.add('box-ringing');
        setTimeout(() => sticker.classList.remove('box-ringing'), 1300);
        break;

      // 17. Car: real car engine rev from sound/car.mp3
      case 'car':
        sounds.play('sound/car.mp3');
        sticker.classList.remove('car-revving');
        void sticker.offsetWidth;
        sticker.classList.add('car-revving');
        setTimeout(() => sticker.classList.remove('car-revving'), 1100);
        break;

      // 18. Email
      case 'email':
        sounds.helloChirp();
        window.location.href = 'mailto:hello@JOE.gg';
        break;

      // 19. WhatsApp
      case 'whatsapp':
        sounds.helloChirp();
        window.open('https://wa.me/', '_blank');
        break;

      // 20. LinkedIn
      case 'linkedin':
        sounds.helloChirp();
        window.open('https://www.linkedin.com/', '_blank');
        break;

      // 21. Think
      case 'think':
        sounds.thinkDing();
        sticker.classList.remove('think-active');
        void sticker.offsetWidth;
        sticker.classList.add('think-active');
        setTimeout(() => sticker.classList.remove('think-active'), 2000);
        break;

      // 22. Sony PSP: gaming pulse & handheld boot chime
      case 'psp':
        sounds.pspChime();
        sticker.classList.remove('psp-active');
        void sticker.offsetWidth;
        sticker.classList.add('psp-active');
        setTimeout(() => sticker.classList.remove('psp-active'), 750);
        break;

      default:
        sounds.helloChirp();
    }
  }



  // Visual helper: Floating Like Heart
  function spawnFloatingLike(x, y) {
    const el = document.createElement('div');
    el.className = 'floating-like-icon';
    el.textContent = Math.random() > 0.5 ? '❤️ +1' : '👍 +1';
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.style.setProperty('--rx', `${(Math.random() - 0.5) * 50}px`);
    document.body.append(el);
    setTimeout(() => el.remove(), 1350);
  }

  // Visual helper: 5-Second Lego Shower
  function spawnLegoRain() {
    if (!legoContainer) return;
    sounds.likePop();
    const colors = ['#f34452', '#3b82f6', '#fbbf24', '#10b981', '#f97316', '#a855f7'];
    const started = Date.now();
    const interval = setInterval(() => {
      if (Date.now() - started > 5000) {
        clearInterval(interval);
        return;
      }
      for (let k = 0; k < 3; k++) {
        const brick = document.createElement('div');
        brick.className = 'lego-brick';
        brick.style.left = `${Math.random() * 95}vw`;
        brick.style.background = colors[Math.floor(Math.random() * colors.length)];
        brick.style.setProperty('--drift', `${(Math.random() - 0.5) * 180}px`);
        brick.style.setProperty('--rot', `${Math.random() * 720 - 360}deg`);
        legoContainer.append(brick);
        setTimeout(() => brick.remove(), 2600);
      }
    }, 110);
  }
}

setupStickerInteractions();

// ==========================================
// ✈️ AIRPORT SPLIT-FLAP ARRIVALS BOARD
// ==========================================
function initAirportBoard() {
  const modal = document.getElementById('airport-modal');
  const dockBtn = document.getElementById('airport-dock-btn');
  const closeBtn = document.getElementById('airport-close-btn');
  const backdrop = document.getElementById('airport-backdrop');
  const rowsContainer = document.getElementById('airport-rows');
  const clockEl = document.getElementById('airport-clock');
  const soundBtn = document.getElementById('airport-sound-btn');
  const soundIcon = document.getElementById('airport-sound-icon');
  const simulateBtn = document.getElementById('airport-simulate-btn');
  const dockCityLabel = document.getElementById('dock-city-label');
  const myOriginEl = document.getElementById('airport-my-origin');
  const passengerCountEl = document.getElementById('airport-passenger-count');

  if (!modal || !rowsContainer) return;

  sounds.flapSoundEnabled = true;

  // Global cities pool with flight codes (Oslo prominently featured as requested)
  const worldCities = [
    { city: 'OSLO, NO', flight: 'SK-842', gate: 'A04' },
    { city: 'ALGIERS, DZ', flight: 'AH-100', gate: 'B11' },
    { city: 'PARIS, FR', flight: 'AF-458', gate: 'C03' },
    { city: 'TOKYO, JP', flight: 'NH-204', gate: 'D21' },
    { city: 'NEW YORK, US', flight: 'BA-178', gate: 'A02' },
    { city: 'LONDON, UK', flight: 'VS-011', gate: 'E05' },
    { city: 'BERLIN, DE', flight: 'LH-302', gate: 'B16' },
    { city: 'DUBAI, AE', flight: 'EK-074', gate: 'C08' },
    { city: 'SYDNEY, AU', flight: 'QF-002', gate: 'D14' },
    { city: 'ZURICH, CH', flight: 'LX-018', gate: 'A09' },
    { city: 'SEOUL, KR', flight: 'KE-901', gate: 'B07' },
    { city: 'MONTREAL, CA', flight: 'AC-870', gate: 'C12' },
    { city: 'AMSTERDAM, NL', flight: 'KL-114', gate: 'D03' },
    { city: 'SINGAPORE, SG', flight: 'SQ-322', gate: 'A15' }
  ];

  const statusOptions = [
    { text: 'JUST LANDED', pillClass: 'status-landed' },
    { text: 'ON SITE', pillClass: 'status-onsite' },
    { text: 'EXPLORING', pillClass: 'status-exploring' },
    { text: 'DOCKED', pillClass: 'status-docked' }
  ];

  const gates = ['A02', 'A04', 'B11', 'B16', 'C03', 'C08', 'D21', 'E05'];

  // Persistent Visitors Log in LocalStorage
  const STORAGE_KEY = 'JOE_airport_arrivals_log';
  let visitors = [];

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) visitors = JSON.parse(raw);
  } catch (_) {}

  // Initialize with authentic visitor history if empty (Oslo at the top!)
  if (!Array.isArray(visitors) || visitors.length < 4) {
    visitors = [
      {
        time: 'JUST NOW',
        flight: 'SK-842',
        visitor: 'PASSENGER #402',
        city: 'OSLO, NO',
        status: 'JUST LANDED',
        pillClass: 'status-landed',
        gate: 'A04',
        isHighlighted: true
      },
      {
        time: '3M AGO',
        flight: 'AH-100',
        visitor: 'PASSENGER #398',
        city: 'ALGIERS, DZ',
        status: 'ON SITE',
        pillClass: 'status-onsite',
        gate: 'B11'
      },
      {
        time: '9M AGO',
        flight: 'AF-458',
        visitor: 'PASSENGER #391',
        city: 'PARIS, FR',
        status: 'EXPLORING',
        pillClass: 'status-exploring',
        gate: 'C03'
      },
      {
        time: '15M AGO',
        flight: 'NH-204',
        visitor: 'PASSENGER #385',
        city: 'TOKYO, JP',
        status: 'DOCKED',
        pillClass: 'status-docked',
        gate: 'D21'
      },
      {
        time: '22M AGO',
        flight: 'BA-178',
        visitor: 'PASSENGER #379',
        city: 'NEW YORK, US',
        status: 'ON SITE',
        pillClass: 'status-onsite',
        gate: 'A02'
      },
      {
        time: '36M AGO',
        flight: 'VS-011',
        visitor: 'PASSENGER #372',
        city: 'LONDON, UK',
        status: 'DOCKED',
        pillClass: 'status-docked',
        gate: 'E05'
      }
    ];
    saveVisitors();
  }

  function saveVisitors() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(visitors.slice(0, 16)));
    } catch (_) {}
  }

  let totalPassengers = parseInt(localStorage.getItem('JOE_airport_passenger_total') || '1284', 10);
  if (passengerCountEl) passengerCountEl.textContent = totalPassengers.toLocaleString();

  // Detect Visitor Actual City & Country (via ipwho.is or Intl timezone fallback)
  async function detectCity() {
    let detected = 'OSLO, NO';
    try {
      const res = await fetch('https://ipwho.is/', { signal: AbortSignal.timeout(2600) });
      if (res.ok) {
        const data = await res.json();
        if (data.city && data.country_code) {
          detected = `${data.city.toUpperCase()}, ${data.country_code}`;
        }
      }
    } catch (_) {
      try {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
        const rawCity = tz.split('/')[1] || tz.split('/')[0] || 'OSLO';
        detected = `${rawCity.replace(/_/g, ' ').toUpperCase()}`;
      } catch (_) {}
    }

    if (dockCityLabel) dockCityLabel.textContent = `${detected} — JUST LANDED`;
    if (myOriginEl) myOriginEl.textContent = detected;

    // Register current visitor once per session
    const hasLoggedThisSession = sessionStorage.getItem('JOE_session_logged_airport');
    if (!hasLoggedThisSession) {
      sessionStorage.setItem('JOE_session_logged_airport', 'true');
      totalPassengers++;
      localStorage.setItem('JOE_airport_passenger_total', String(totalPassengers));
      if (passengerCountEl) passengerCountEl.textContent = totalPassengers.toLocaleString();

      addNewArrival({
        time: 'JUST NOW',
        flight: 'JOE-01',
        visitor: `YOU (#${totalPassengers})`,
        city: detected,
        status: 'JUST LANDED',
        pillClass: 'status-landed',
        gate: 'VIP',
        isHighlighted: true
      });
    }
  }

  detectCity();

  // UTC Airport Clock
  function updateClock() {
    if (!clockEl) return;
    const now = new Date();
    const h = String(now.getUTCHours()).padStart(2, '0');
    const m = String(now.getUTCMinutes()).padStart(2, '0');
    const s = String(now.getUTCSeconds()).padStart(2, '0');
    clockEl.textContent = `${h}:${m}:${s} UTC`;
  }
  setInterval(updateClock, 1000);
  updateClock();

  // Helper: Create Split-Flap Cells
  function createFlapWord(text, maxLen = 12, theme = '') {
    const padded = (text || '').padEnd(maxLen, ' ').slice(0, maxLen);
    const container = document.createElement('div');
    container.className = 'flap-word';
    for (let i = 0; i < padded.length; i++) {
      const cell = document.createElement('span');
      cell.className = `flap-cell ${theme}`;
      cell.dataset.char = padded[i];
      cell.innerHTML = `
        <span class="flap-char-text">${padded[i] === ' ' ? '&nbsp;' : padded[i]}</span>
        <span class="flap-crease" aria-hidden="true"></span>
      `;
      container.appendChild(cell);
    }
    return container;
  }

  // Animate Flip transition from old text to new text on a flap container
  function flipWord(container, newText, maxLen = 12, theme = '', staggerBase = 0) {
    const padded = (newText || '').padEnd(maxLen, ' ').slice(0, maxLen);
    const cells = Array.from(container.querySelectorAll('.flap-cell'));

    while (cells.length < maxLen) {
      const cell = document.createElement('span');
      cell.className = `flap-cell ${theme}`;
      cell.innerHTML = `
        <span class="flap-char-text">&nbsp;</span>
        <span class="flap-crease" aria-hidden="true"></span>
      `;
      container.appendChild(cell);
      cells.push(cell);
    }

    const charsPool = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-· ';

    padded.split('').forEach((targetChar, idx) => {
      const cell = cells[idx];
      if (!cell) return;
      const charEl = cell.querySelector('.flap-char-text');
      const currentChar = cell.dataset.char || ' ';

      if (currentChar === targetChar) return;

      const delay = staggerBase + idx * 30;
      setTimeout(() => {
        cell.classList.add('is-flipping');
        sounds.playFlapClick();

        let steps = 0;
        const maxSteps = Math.floor(Math.random() * 3) + 2;
        const stepInterval = setInterval(() => {
          steps++;
          if (steps >= maxSteps) {
            clearInterval(stepInterval);
            cell.dataset.char = targetChar;
            charEl.innerHTML = targetChar === ' ' ? '&nbsp;' : targetChar;
            cell.classList.remove('is-flipping');
          } else {
            const randomChar = charsPool[Math.floor(Math.random() * charsPool.length)];
            charEl.textContent = randomChar;
            sounds.playFlapClick();
          }
        }, 40);
      }, delay);
    });
  }

  // Render All Board Rows
  function renderRows(animate = false) {
    rowsContainer.innerHTML = '';
    visitors.slice(0, 8).forEach((item, rIdx) => {
      const row = document.createElement('div');
      row.className = `airport-row ${item.isHighlighted ? 'is-highlighted' : ''}`;

      const timeCell = createFlapWord(item.time, 7, 'theme-amber');
      const flightCell = createFlapWord(item.flight, 7, 'theme-amber');
      const visitorCell = createFlapWord(item.visitor, 11, 'theme-white');
      const cityCell = createFlapWord(item.city, 15, 'theme-green');
      const statusWrap = document.createElement('div');
      statusWrap.innerHTML = `
        <span class="status-pill ${item.pillClass || 'status-landed'}">
          <span class="status-dot-blink" aria-hidden="true"></span>
          ${item.status}
        </span>
      `;
      const gateCell = createFlapWord(item.gate || 'A01', 4, 'theme-cyan');

      row.append(timeCell, flightCell, visitorCell, cityCell, statusWrap, gateCell);
      rowsContainer.appendChild(row);

      if (animate) {
        flipWord(timeCell, item.time, 7, 'theme-amber', rIdx * 50);
        flipWord(flightCell, item.flight, 7, 'theme-amber', rIdx * 50 + 30);
        flipWord(visitorCell, item.visitor, 11, 'theme-white', rIdx * 50 + 60);
        flipWord(cityCell, item.city, 15, 'theme-green', rIdx * 50 + 90);
        flipWord(gateCell, item.gate || 'A01', 4, 'theme-cyan', rIdx * 50 + 120);
      }
    });
  }

  renderRows(false);

  // Add a new visitor arrival and ripple through the board
  function addNewArrival(customData = null) {
    const randomCity = worldCities[Math.floor(Math.random() * worldCities.length)];
    const randomGate = gates[Math.floor(Math.random() * gates.length)];
    const randomVisitorNum = Math.floor(Math.random() * 800) + 100;

    const newArrival = customData || {
      time: 'JUST NOW',
      flight: randomCity.flight,
      visitor: `GUEST #${randomVisitorNum}`,
      city: randomCity.city,
      status: 'JUST LANDED',
      pillClass: 'status-landed',
      gate: randomGate,
      isHighlighted: true
    };

    visitors.forEach(v => {
      v.isHighlighted = false;
      if (v.time === 'JUST NOW') v.time = '2M AGO';
      else if (v.time.includes('M AGO')) {
        const mins = parseInt(v.time, 10) || 1;
        v.time = `${mins + 2}M AGO`;
      }
    });

    visitors.unshift(newArrival);
    if (visitors.length > 12) visitors.pop();
    saveVisitors();

    totalPassengers++;
    localStorage.setItem('JOE_airport_passenger_total', String(totalPassengers));
    if (passengerCountEl) passengerCountEl.textContent = totalPassengers.toLocaleString();

    if (dockCityLabel) {
      dockCityLabel.textContent = `${newArrival.city} — JUST LANDED`;
    }

    renderRows(true);
  }

  // Modal Controls
  function openAirportBoard() {
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    renderRows(true);
  }

  function closeAirportBoard() {
    modal.hidden = true;
    document.body.style.overflow = '';
  }

  window.openAirportBoard = openAirportBoard;
  window.closeAirportBoard = closeAirportBoard;

  if (dockBtn) dockBtn.addEventListener('click', openAirportBoard);
  if (closeBtn) closeBtn.addEventListener('click', closeAirportBoard);
  if (backdrop) backdrop.addEventListener('click', closeAirportBoard);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.hidden) closeAirportBoard();
  });

  // Sound toggle button
  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      sounds.flapSoundEnabled = !sounds.flapSoundEnabled;
      soundBtn.classList.toggle('is-muted', !sounds.flapSoundEnabled);
      if (soundIcon) soundIcon.textContent = sounds.flapSoundEnabled ? '🔊' : '🔇';
    });
  }

  // Simulate flight arrival button
  if (simulateBtn) {
    simulateBtn.addEventListener('click', () => {
      addNewArrival();
    });
  }

  // Ambient flight arrival every 22 seconds
  setInterval(() => {
    if (!document.hidden) {
      addNewArrival();
    }
  }, 22000);
}

initAirportBoard();
