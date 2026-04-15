import {
  Directive,
  ElementRef,
  DestroyRef,
  inject,
  input,
  PLATFORM_ID,
  afterNextRender,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: '[appScrollReveal]',
  standalone: true,
})
export class ScrollRevealDirective {
  delay = input<number>(0, { alias: 'appScrollReveal' });

  private el = inject(ElementRef);
  private destroyRef = inject(DestroyRef);
  private platformId = inject(PLATFORM_ID);

  constructor() {
    afterNextRender(() => {
      if (!isPlatformBrowser(this.platformId)) return;

      const element = this.el.nativeElement as HTMLElement;
      element.classList.add('scroll-reveal');

      const delayMs = this.delay();
      if (delayMs > 0) {
        element.style.transitionDelay = `${delayMs}ms`;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              element.classList.add('revealed');
              observer.unobserve(element);
            }
          });
        },
        { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
      );

      observer.observe(element);

      this.destroyRef.onDestroy(() => observer.disconnect());
    });
  }
}
