import {
  Component,
  ChangeDetectionStrategy,
  signal,
  computed,
  DestroyRef,
  inject,
  ElementRef,
  viewChild,
  PLATFORM_ID,
  afterNextRender,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
}

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './hero.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroComponent {
  private platformId = inject(PLATFORM_ID);
  private destroyRef = inject(DestroyRef);

  canvasRef = viewChild<ElementRef<HTMLCanvasElement>>('canvas');

  readonly titles = signal(['Software Developer', 'Angular', 'Micro Frontend', 'TypeScript']);

  currentTitle = signal(0);
  displayText = signal('');
  showCursor = signal(true);

  currentFullTitle = computed(() => this.titles()[this.currentTitle()]);

  constructor() {
    if (!isPlatformBrowser(this.platformId)) return;

    // Typewriter effect
    let charIndex = 0;
    let isDeleting = false;
    let typeTimeout: ReturnType<typeof setTimeout>;

    const type = () => {
      const full = this.currentFullTitle();
      if (!isDeleting) {
        charIndex++;
        this.displayText.set(full.slice(0, charIndex));
        if (charIndex === full.length) {
          isDeleting = false;
          typeTimeout = setTimeout(() => {
            isDeleting = true;
            type();
          }, 2000);
          return;
        }
      } else {
        charIndex--;
        this.displayText.set(full.slice(0, charIndex));
        if (charIndex === 0) {
          isDeleting = false;
          this.currentTitle.update((i) => (i + 1) % this.titles().length);
          charIndex = 0;
        }
      }
      typeTimeout = setTimeout(type, isDeleting ? 40 : 80);
    };

    typeTimeout = setTimeout(type, 500);

    // Cursor blink
    const cursorInterval = setInterval(() => {
      this.showCursor.update((v) => !v);
    }, 530);

    this.destroyRef.onDestroy(() => {
      clearTimeout(typeTimeout);
      clearInterval(cursorInterval);
    });

    // Canvas particles
    afterNextRender(() => {
      this.initCanvas();
    });
  }

  private initCanvas(): void {
    const canvasEl = this.canvasRef();
    if (!canvasEl) return;

    const canvas = canvasEl.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const particles: Particle[] = [];
    const PARTICLE_COUNT = 80;
    const CONNECTION_DIST = 120;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    const createParticle = (): Particle => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.5 + 0.1,
    });

    resize();
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(createParticle());
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${p.opacity})`;
        ctx.fill();
      });

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECTION_DIST) {
            const alpha = (1 - dist / CONNECTION_DIST) * 0.15;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(124,58,237,${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    const resizeObs = new ResizeObserver(resize);
    resizeObs.observe(canvas);

    this.destroyRef.onDestroy(() => {
      cancelAnimationFrame(animId);
      resizeObs.disconnect();
    });
  }
}
