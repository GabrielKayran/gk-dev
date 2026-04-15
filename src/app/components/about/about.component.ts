import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';

interface Tab {
  id: string;
  labelKey: string;
  items: { icon: string; textKey: string }[];
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [ScrollRevealDirective, TranslatePipe],
  templateUrl: './about.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutComponent {
  activeTab = signal('focus');

  tabs = signal<Tab[]>([
    {
      id: 'focus',
      labelKey: 'ABOUT.TABS.FOCUS.LABEL',
      items: [
        { icon: '▸', textKey: 'ABOUT.TABS.FOCUS.ITEM_1' },
        { icon: '▸', textKey: 'ABOUT.TABS.FOCUS.ITEM_2' },
        { icon: '▸', textKey: 'ABOUT.TABS.FOCUS.ITEM_3' },
        { icon: '▸', textKey: 'ABOUT.TABS.FOCUS.ITEM_4' },
      ],
    },
    {
      id: 'approach',
      labelKey: 'ABOUT.TABS.APPROACH.LABEL',
      items: [
        { icon: '▸', textKey: 'ABOUT.TABS.APPROACH.ITEM_1' },
        { icon: '▸', textKey: 'ABOUT.TABS.APPROACH.ITEM_2' },
        { icon: '▸', textKey: 'ABOUT.TABS.APPROACH.ITEM_3' },
        { icon: '▸', textKey: 'ABOUT.TABS.APPROACH.ITEM_4' },
      ],
    },
  ]);

  activeItems = computed(() => this.tabs().find((t) => t.id === this.activeTab())?.items ?? []);

  setTab(id: string): void {
    this.activeTab.set(id);
  }
}
