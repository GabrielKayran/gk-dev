import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { PortfolioService } from '../../services/portfolio.service';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [ScrollRevealDirective, TranslatePipe],
  templateUrl: './experience.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExperienceComponent {
  private portfolioService = inject(PortfolioService);
  experiences = computed(() => this.portfolioService.experiences());
}
