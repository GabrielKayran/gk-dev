import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';

interface Tab {
  id: string;
  label: string;
  items: { icon: string; text: string }[];
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [ScrollRevealDirective],
  templateUrl: './about.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutComponent {
  activeTab = signal('foco');

  tabs = signal<Tab[]>([
    {
      id: 'foco',
      label: 'No que estou trabalhando',
      items: [
        { icon: '▸', text: 'Aplicações Angular que continuam rápidas mesmo crescendo' },
        { icon: '▸', text: 'Arquitetura front-end que não vira problema daqui a 6 meses' },
        { icon: '▸', text: 'Integrações consistentes com APIs e backend' },
        { icon: '▸', text: 'Organização de código pensando em evolução, não só entrega' },
      ],
    },
    {
      id: 'abordagem',
      label: 'Como eu trabalho',
      items: [
        { icon: '▸', text: 'Prefiro soluções simples que resolvem bem o problema' },
        { icon: '▸', text: 'Evito complexidade desnecessária desde o início' },
        { icon: '▸', text: 'Penso no impacto das decisões no médio prazo' },
        { icon: '▸', text: 'Busco consistência mais do que “genialidade”' },
      ],
    },
  ]);

  activeItems = computed(() => this.tabs().find((t) => t.id === this.activeTab())?.items ?? []);

  setTab(id: string): void {
    this.activeTab.set(id);
  }
}
