import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { PortfolioService } from '../../services/portfolio.service';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [ScrollRevealDirective, TranslatePipe],
  templateUrl: './projects.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsComponent {
  private portfolioService = inject(PortfolioService);
  projects = computed(() => this.portfolioService.projects());
}
