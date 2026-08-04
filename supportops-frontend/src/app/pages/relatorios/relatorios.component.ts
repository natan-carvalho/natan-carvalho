import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { PageTitleComponent } from '../../shared/page-title/page-title.component';
import { ReportMetric, ReportPeriod } from '../../models/dashboard-card.model';
import { MockDataService } from '../../services/mock-data.service';

@Component({
  selector: 'app-relatorios',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatTabsModule, PageTitleComponent],
  templateUrl: './relatorios.component.html',
  styleUrl: './relatorios.component.scss',
})
export class RelatoriosComponent {
  readonly reports = signal<ReportMetric[]>([]);
  readonly selectedPeriod = signal<ReportPeriod>('Mensal');

  readonly currentReport = computed(() => this.reports().find((report) => report.period === this.selectedPeriod()) ?? this.reports()[0]);

  constructor(private readonly mockData: MockDataService) {
    this.reports.set(this.mockData.reports());
  }

  selectPeriod(period: ReportPeriod): void {
    this.selectedPeriod.set(period);
  }
}
