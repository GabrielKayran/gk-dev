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

interface GraphNode {
  rx: number;
  ry: number;
  x: number;
  y: number;
  radius: number;
  color: string;
}

interface Edge {
  from: number;
  to: number;
  highway?: boolean;
}

interface Pulse {
  edgeIndex: number;
  t: number;
  speed: number;
  color: string;
  radius: number;
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

  readonly titles = signal([
    'Software Developer',
    'Angular',
    'Problem Solver',
    'Micro Frontend',
    'TypeScript',
    'C# .NET',
    'NestJS',
  ]);

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
    let mouseX = -9999;
    let mouseY = -9999;
    let frameCount = 0;

    const VIOLET = '#7c3aed';
    const CYAN = '#06b6d4';
    const PULSE_COLORS = [VIOLET, CYAN, '#a78bfa', '#22d3ee'];
    const GRID_SPACING = 40;
    const MOUSE_RADIUS = 240;

    // Nodes on left and right edges only — center stays clean for text
    const NODE_DEFS: Array<{ rx: number; ry: number; radius: number; color: string }> = [
      // Left — Frontend / Micro Frontends (cyan)
      { rx: 0.05, ry: 0.3, radius: 6, color: CYAN },
      { rx: 0.03, ry: 0.52, radius: 4, color: CYAN },
      { rx: 0.09, ry: 0.67, radius: 4, color: CYAN },
      { rx: 0.15, ry: 0.42, radius: 5, color: CYAN },
      { rx: 0.12, ry: 0.74, radius: 3, color: CYAN },
      { rx: 0.17, ry: 0.23, radius: 3, color: CYAN },
      // Right — Backend / Infra (violet)
      { rx: 0.95, ry: 0.3, radius: 6, color: VIOLET },
      { rx: 0.97, ry: 0.52, radius: 5, color: VIOLET },
      { rx: 0.91, ry: 0.67, radius: 5, color: VIOLET },
      { rx: 0.85, ry: 0.4, radius: 6, color: VIOLET },
      { rx: 0.88, ry: 0.74, radius: 4, color: VIOLET },
      { rx: 0.82, ry: 0.24, radius: 3, color: VIOLET },
      { rx: 0.8, ry: 0.57, radius: 4, color: VIOLET },
    ];

    const nodes: GraphNode[] = NODE_DEFS.map((d) => ({ ...d, x: 0, y: 0 }));

    const EDGES: Edge[] = [
      // Left internal
      { from: 0, to: 1 },
      { from: 0, to: 3 },
      { from: 1, to: 2 },
      { from: 2, to: 4 },
      { from: 3, to: 4 },
      { from: 3, to: 5 },
      { from: 0, to: 5 },
      // Right internal
      { from: 6, to: 9 },
      { from: 6, to: 7 },
      { from: 7, to: 8 },
      { from: 9, to: 10 },
      { from: 8, to: 10 },
      { from: 9, to: 11 },
      { from: 11, to: 6 },
      { from: 12, to: 7 },
      { from: 9, to: 12 },
      // Highways — cross-screen data streams
      { from: 3, to: 9, highway: true },
      { from: 0, to: 6, highway: true },
      { from: 5, to: 11, highway: true },
    ];

    const pulses: Pulse[] = [];

    const spawnPulse = (initialT = 0): void => {
      pulses.push({
        edgeIndex: Math.floor(Math.random() * EDGES.length),
        t: initialT,
        speed: 0.0018 + Math.random() * 0.004,
        color: PULSE_COLORS[Math.floor(Math.random() * PULSE_COLORS.length)],
        radius: Math.random() < 0.25 ? 3 : 2,
      });
    };

    for (let i = 0; i < 18; i++) spawnPulse(Math.random());

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      nodes.forEach((n) => {
        n.x = n.rx * canvas.width;
        n.y = n.ry * canvas.height;
      });
    };

    resize();

    const draw = () => {
      frameCount++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Dot grid — reacts to mouse proximity
      const cols = Math.ceil(canvas.width / GRID_SPACING) + 1;
      const rows = Math.ceil(canvas.height / GRID_SPACING) + 1;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const gx = c * GRID_SPACING;
          const gy = r * GRID_SPACING;
          const dx = gx - mouseX;
          const dy = gy - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const proximity = Math.max(0, 1 - dist / MOUSE_RADIUS);
          const opacity = 0.06 + proximity * 0.3;
          ctx.beginPath();
          ctx.arc(gx, gy, 0.8, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,${opacity})`;
          ctx.fill();
        }
      }

      // 2. Mouse spotlight
      if (mouseX > -999) {
        const spot = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 300);
        spot.addColorStop(0, 'rgba(124,58,237,0.10)');
        spot.addColorStop(0.45, 'rgba(6,182,212,0.04)');
        spot.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = spot;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // 3. Edges
      EDGES.forEach((edge) => {
        const a = nodes[edge.from];
        const b = nodes[edge.to];
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = edge.highway ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.04)';
        ctx.lineWidth = edge.highway ? 0.8 : 0.6;
        ctx.stroke();
      });

      // 4. Pulses
      for (let i = pulses.length - 1; i >= 0; i--) {
        const pulse = pulses[i];
        pulse.t += pulse.speed;

        const edge = EDGES[pulse.edgeIndex];
        const a = nodes[edge.from];
        const b = nodes[edge.to];
        const px = a.x + (b.x - a.x) * pulse.t;
        const py = a.y + (b.y - a.y) * pulse.t;

        const trailT = Math.max(0, pulse.t - 0.1);
        const tx = a.x + (b.x - a.x) * trailT;
        const ty = a.y + (b.y - a.y) * trailT;
        const trail = ctx.createLinearGradient(tx, ty, px, py);
        trail.addColorStop(0, pulse.color + '00');
        trail.addColorStop(1, pulse.color + 'dd');
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(px, py);
        ctx.strokeStyle = trail;
        ctx.lineWidth = pulse.radius === 3 ? 2 : 1.2;
        ctx.stroke();

        const headGlow = ctx.createRadialGradient(px, py, 0, px, py, pulse.radius * 4);
        headGlow.addColorStop(0, pulse.color + 'ff');
        headGlow.addColorStop(0.35, pulse.color + '55');
        headGlow.addColorStop(1, pulse.color + '00');
        ctx.beginPath();
        ctx.arc(px, py, pulse.radius * 4, 0, Math.PI * 2);
        ctx.fillStyle = headGlow;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(px, py, pulse.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        if (pulse.t > 1) pulses.splice(i, 1);
      }

      // 5. Nodes
      nodes.forEach((node) => {
        const glow = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, node.radius * 6);
        glow.addColorStop(0, node.color + '44');
        glow.addColorStop(1, node.color + '00');
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius * 6, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = node.color + 'ee';
        ctx.fill();

        if (node.radius >= 5) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius * 0.35, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255,255,255,0.55)';
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.strokeStyle = node.color;
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      if (frameCount % 50 === 0 && pulses.length < 24) spawnPulse();

      animId = requestAnimationFrame(draw);
    };

    draw();

    const section = canvas.parentElement;
    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };
    const onMouseLeave = () => {
      mouseX = -9999;
      mouseY = -9999;
    };
    section?.addEventListener('mousemove', onMouseMove);
    section?.addEventListener('mouseleave', onMouseLeave);

    const resizeObs = new ResizeObserver(resize);
    resizeObs.observe(canvas);

    this.destroyRef.onDestroy(() => {
      cancelAnimationFrame(animId);
      resizeObs.disconnect();
      section?.removeEventListener('mousemove', onMouseMove);
      section?.removeEventListener('mouseleave', onMouseLeave);
    });
  }
}
