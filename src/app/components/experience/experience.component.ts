import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { PortfolioService } from '../../services/portfolio.service';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [ScrollRevealDirective],
  templateUrl: './experience.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExperienceComponent {
  private portfolioService = inject(PortfolioService);
  experiences = computed(() => this.portfolioService.experiences());
}
