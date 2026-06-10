import {
  Component,
  ChangeDetectionStrategy,
  signal,
  computed,
  DestroyRef,
  inject,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

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
  }
}
