/**
 * Site-wide interaction layer.
 *
 * Always on (also with reduced motion): header state, menu, spotlight panels.
 * Motion only: Lenis smooth scroll, scroll reveals, counters, magnetic buttons,
 * marquee velocity, GSAP ScrollTrigger scenes (pipeline, scroll-lit words,
 * parallax) and the WebGL hero field. Heavy pieces are dynamic imports so they
 * never block first paint.
 */

declare global {
  interface Window {
    __cbMotion?: boolean;
  }
}

const reduceMotion = (): boolean => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = (): boolean => window.matchMedia('(pointer: fine)').matches;

type ScrollListener = (y: number, velocity: number) => void;
const scrollListeners: ScrollListener[] = [];
const onScroll = (fn: ScrollListener): void => {
  scrollListeners.push(fn);
};

/* ---------------------------------------------------------------- header */

function initHeader(): void {
  const header = document.querySelector<HTMLElement>('[data-header]');
  if (!header) return;
  const progress = header.querySelector<HTMLElement>('[data-progress]');
  let lastY = window.scrollY;

  const update = (y: number): void => {
    header.dataset.scrolled = String(y > 24);
    const goingDown = y > lastY + 4;
    const goingUp = y < lastY - 4;
    if (goingDown && y > 480 && header.dataset.menu !== 'open') header.dataset.hidden = 'true';
    if (goingUp || y < 480) header.dataset.hidden = 'false';
    lastY = y;
    if (progress) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.setProperty('--progress', String(max > 0 ? Math.min(1, y / max) : 0));
    }
  };

  update(window.scrollY);
  onScroll((y) => update(y));
}

/* ------------------------------------------------------------------ menu */

function initMenu(stopScroll: (stop: boolean) => void): void {
  const button = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  const menu = document.querySelector<HTMLElement>('[data-menu]');
  const header = document.querySelector<HTMLElement>('[data-header]');
  if (!button || !menu) return;

  const setOpen = (open: boolean): void => {
    button.setAttribute('aria-expanded', String(open));
    button.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.dataset.open = String(open);
    menu.toggleAttribute('inert', !open);
    if (header) header.dataset.menu = open ? 'open' : 'closed';
    stopScroll(open);
    if (open) menu.querySelector<HTMLElement>('a')?.focus({ preventScroll: true });
  };

  menu.toggleAttribute('inert', true);
  button.addEventListener('click', () => setOpen(button.getAttribute('aria-expanded') !== 'true'));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.dataset.open === 'true') {
      setOpen(false);
      button.focus();
    }
  });
  menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setOpen(false)));
}

/* -------------------------------------------------------------- spotlight */

function initSpotlight(): void {
  if (!finePointer()) return;
  document.querySelectorAll<HTMLElement>('.spot').forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${e.clientX - r.left}px`);
      el.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  });
}

/* ---------------------------------------------------------------- reveals */

function initReveals(): void {
  const items = document.querySelectorAll<HTMLElement>('[data-reveal]');
  if (!items.length) return;
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        (entry.target as HTMLElement).dataset.in = 'true';
        io.unobserve(entry.target);
      });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
  );
  items.forEach((el) => {
    // Anything already above the fold on load reveals immediately.
    if (el.getBoundingClientRect().top < window.innerHeight * 0.95) {
      requestAnimationFrame(() => (el.dataset.in = 'true'));
    } else io.observe(el);
  });
}

/* --------------------------------------------------------------- counters */

function initCounters(animate: boolean): void {
  const els = document.querySelectorAll<HTMLElement>('[data-count]');
  const format = (n: number): string => Math.round(n).toLocaleString('en-GB');
  els.forEach((el) => {
    const target = Number(el.dataset.count);
    if (!animate || !Number.isFinite(target)) return;
    const from = Number(el.dataset.countFrom ?? 0);
    el.textContent = format(from);
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const dur = 1800;
        const tick = (t: number): void => {
          const p = Math.min(1, (t - start) / dur);
          const eased = 1 - Math.pow(1 - p, 4);
          el.textContent = format(from + (target - from) * eased);
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.5 }
    );
    io.observe(el);
  });
}

/* --------------------------------------------------------------- magnetic */

function initMagnetic(): void {
  if (!finePointer()) return;
  document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
    const strength = 0.22;
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - (r.left + r.width / 2)) * strength;
      const y = (e.clientY - (r.top + r.height / 2)) * strength;
      el.style.transform = `translate(${x}px, ${y}px)`;
    });
    el.addEventListener('pointerleave', () => {
      el.style.transform = '';
    });
  });
}

/* ----------------------------------------------------------- marquee speed */

function initMarquee(): void {
  const tracks = Array.from(document.querySelectorAll<HTMLElement>('.marquee__track'));
  if (!tracks.length) return;
  let rate = 1;
  onScroll((_y, velocity) => {
    const targetRate = 1 + Math.min(4, Math.abs(velocity) * 0.06);
    rate += (targetRate - rate) * 0.2;
    tracks.forEach((t) => t.getAnimations().forEach((a) => (a.playbackRate = rate)));
  });
}

/* ---------------------------------------------------------------- scenes */

async function initScenes(): Promise<void> {
  const needs = document.querySelector('[data-pipeline], .lit, [data-parallax], [data-split]') !== null;
  if (!needs) return;

  const [{ gsap }, { ScrollTrigger }, { SplitText }] = await Promise.all([
    import('gsap'),
    import('gsap/ScrollTrigger'),
    import('gsap/SplitText'),
  ]);
  gsap.registerPlugin(ScrollTrigger, SplitText);
  onScroll(() => ScrollTrigger.update());

  // Section headings: lines rise from a mask as they enter.
  document.querySelectorAll<HTMLElement>('[data-split]').forEach((el) => {
    SplitText.create(el, {
      type: 'lines',
      mask: 'lines',
      linesClass: 'split-line',
      autoSplit: true,
      onSplit(self) {
        return gsap.from(self.lines, {
          yPercent: 105,
          duration: 1.2,
          ease: 'expo.out',
          stagger: 0.08,
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        });
      },
    });
  });

  // Scroll-lit words: each word brightens as the reader scrolls past it.
  document.querySelectorAll<HTMLElement>('.lit').forEach((block) => {
    const words = Array.from(block.querySelectorAll<HTMLElement>('.lit-word'));
    ScrollTrigger.create({
      trigger: block,
      start: 'top 75%',
      end: 'bottom 45%',
      scrub: true,
      onUpdate(self) {
        const n = Math.round(self.progress * words.length);
        words.forEach((w, i) => (w.dataset.on = String(i < n)));
      },
    });
  });

  // Gentle parallax on decorative imagery only (never on text).
  document.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
    const amount = Number(el.dataset.parallax || 10);
    gsap.fromTo(
      el,
      { yPercent: -amount },
      {
        yPercent: amount,
        ease: 'none',
        scrollTrigger: { trigger: el.parentElement || el, start: 'top bottom', end: 'bottom top', scrub: true },
      }
    );
  });

  // Pipeline: a pinned stage that steps through the four stages of a booking.
  const pipeline = document.querySelector<HTMLElement>('[data-pipeline]');
  if (pipeline) {
    const mm = gsap.matchMedia();
    mm.add('(min-width: 64rem)', () => {
      const steps = Array.from(pipeline.querySelectorAll<HTMLElement>('[data-step]'));
      const counter = pipeline.querySelector<HTMLElement>('[data-step-counter]');
      const rail = pipeline.querySelector<HTMLElement>('[data-rail]');
      pipeline.dataset.staged = 'true';
      const setActive = (i: number): void => {
        steps.forEach((s, j) => (s.dataset.active = String(i === j)));
        if (counter) counter.textContent = String(i + 1).padStart(2, '0');
      };
      setActive(0);
      const st = ScrollTrigger.create({
        trigger: pipeline,
        start: 'top top',
        end: () => `+=${window.innerHeight * steps.length * 0.85}`,
        pin: pipeline.querySelector<HTMLElement>('[data-pin]') ?? pipeline,
        scrub: true,
        onUpdate(self) {
          const i = Math.min(steps.length - 1, Math.floor(self.progress * steps.length));
          setActive(i);
          rail?.style.setProperty('--fill', String(self.progress));
        },
      });
      return () => {
        st.kill();
        pipeline.dataset.staged = 'false';
        steps.forEach((s) => delete s.dataset.active);
      };
    });
  }

  ScrollTrigger.refresh();
}

/* ------------------------------------------------------------ hero field */

function initField(): void {
  const host = document.querySelector<HTMLElement>('[data-field]');
  if (!host) return;
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  if (conn?.saveData) return;
  const start = (): void => {
    import('./field')
      .then(({ mountField }) => mountField(host, { still: reduceMotion() }))
      .catch(() => {
        /* The static fallback stays visible. */
      });
  };
  if ('requestIdleCallback' in window) window.requestIdleCallback(start, { timeout: 1500 });
  else setTimeout(start, 600);
}

/* ------------------------------------------------------------------ boot */

export async function bootMotion(): Promise<void> {
  const motion = !reduceMotion();
  window.__cbMotion = true;

  let lenis: { stop: () => void; start: () => void } | null = null;
  const stopScroll = (stop: boolean): void => {
    document.documentElement.style.overflow = stop ? 'hidden' : '';
    if (lenis) (stop ? lenis.stop : lenis.start).call(lenis);
  };

  initHeader();
  initMenu(stopScroll);
  initSpotlight();
  initCounters(motion);
  initField();

  if (!motion) {
    window.addEventListener('scroll', () => scrollListeners.forEach((fn) => fn(window.scrollY, 0)), {
      passive: true,
    });
    return;
  }

  initReveals();
  initMagnetic();
  initMarquee();

  // Smooth, weighted scroll. Native scroll is kept for touch devices.
  try {
    const { default: Lenis } = await import('lenis');
    const instance = new Lenis({ lerp: 0.11, smoothWheel: true, anchors: { offset: -80 } });
    lenis = instance;
    instance.on('scroll', (l: { scroll: number; velocity: number }) =>
      scrollListeners.forEach((fn) => fn(l.scroll, l.velocity))
    );
    const raf = (t: number): void => {
      instance.raf(t);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  } catch {
    let last = window.scrollY;
    window.addEventListener(
      'scroll',
      () => {
        const y = window.scrollY;
        scrollListeners.forEach((fn) => fn(y, y - last));
        last = y;
      },
      { passive: true }
    );
  }

  initScenes().catch(() => {
    /* Scenes are progressive enhancement; content is already in place. */
  });
}
