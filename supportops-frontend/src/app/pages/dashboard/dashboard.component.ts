import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CardComponent } from '../../shared/card/card.component';
import { PageTitleComponent } from '../../shared/page-title/page-title.component';
import { MockDataService } from '../../services/mock-data.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, CardComponent, PageTitleComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  readonly cards = signal<any[]>([]);
  readonly user = signal({ name: 'Natan Carvalho', role: 'Gerente de Operações' });

  readonly summary = computed(() => this.cards().length);

  constructor(private readonly mockData: MockDataService) {
    this.cards.set(this.mockData.dashboardCards());
    this.user.set(this.mockData.user());
  }
}
