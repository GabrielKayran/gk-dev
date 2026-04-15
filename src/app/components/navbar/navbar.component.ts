import {
  Component,
  ChangeDetectionStrategy,
  signal,
  HostListener,
  inject,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [TranslatePipe, NgClass],
  templateUrl: './navbar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  private platformId = inject(PLATFORM_ID);
  private translate = inject(TranslateService);

  scrolled = signal(false);
  menuOpen = signal(false);
  currentLang = signal<string>('pt');

  constructor() {
    this.translate.use('pt');
  }

  @HostListener('window:scroll')
  onScroll(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.scrolled.set(window.scrollY > 50);
    }
  }

  toggleMenu(): void {
    this.menuOpen.update((v) => !v);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }

  switchLang(): void {
    const next = this.currentLang() === 'pt' ? 'en' : 'pt';
    this.translate.use(next);
    this.currentLang.set(next);
  }

  readonly navLinks = [
    { labelKey: 'NAV.ABOUT', fragment: 'about' },
    { labelKey: 'NAV.EXPERIENCE', fragment: 'experience' },
    { labelKey: 'NAV.SKILLS', fragment: 'skills' },
    { labelKey: 'NAV.PROJECTS', fragment: 'projects' },
    { labelKey: 'NAV.CONTACT', fragment: 'contact' },
  ];
}
