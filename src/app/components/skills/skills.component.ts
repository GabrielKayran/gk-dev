import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { PortfolioService } from '../../services/portfolio.service';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [ScrollRevealDirective, TranslatePipe],
  templateUrl: './skills.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkillsComponent {
  private portfolioService = inject(PortfolioService);
  skillGroups = computed(() => this.portfolioService.skillGroups());
}
