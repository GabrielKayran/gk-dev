import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { PortfolioService } from '../../services/portfolio.service';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ScrollRevealDirective, TranslatePipe],
  templateUrl: './contact.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactComponent {
  private portfolioService = inject(PortfolioService);
  contactLinks = computed(() => this.portfolioService.contactLinks());
}
