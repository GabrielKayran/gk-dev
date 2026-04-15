import {
  Component,
  ChangeDetectionStrategy,
  signal,
  HostListener,
  inject,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  private platformId = inject(PLATFORM_ID);

  scrolled = signal(false);
  menuOpen = signal(false);

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

  readonly navLinks = [
    { label: 'Sobre', fragment: 'about' },
    { label: 'Experiência', fragment: 'experience' },
    { label: 'Skills', fragment: 'skills' },
    { label: 'Projetos', fragment: 'projects' },
    { label: 'Contato', fragment: 'contact' },
  ];
}
