import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { PageTitleComponent } from '../../shared/page-title/page-title.component';
import { Incident, IncidentReport, IncidentSeverity } from '../../models/dashboard-card.model';
import { MockDataService } from '../../services/mock-data.service';

@Component({
  selector: 'app-incidentes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatChipsModule,
    PageTitleComponent,
  ],
  templateUrl: './incidentes.component.html',
  styleUrl: './incidentes.component.scss',
})
export class IncidentesComponent {
  readonly incidents = signal<Incident[]>([]);
  readonly report = signal<IncidentReport>({ total: 0, open: 0, resolved: 0, critical: 0 });
  readonly form = signal({
    title: '',
    description: '',
    severity: 'Média' as IncidentSeverity,
    owner: '',
    status: 'Aberto' as Incident['status'],
  });

  readonly displayedColumns = ['title', 'severity', 'owner', 'createdAt', 'status'];

  constructor(private readonly mockData: MockDataService) {
    this.incidents.set(this.mockData.incidents());
    this.report.set(this.mockData.incidentReport());
  }

  addIncident(): void {
    const current = this.form();
    if (!current.title || !current.description || !current.owner) {
      return;
    }

    const newIncident: Incident = {
      id: Date.now(),
      title: current.title,
      description: current.description,
      severity: current.severity,
      owner: current.owner,
      createdAt: 'Agora',
      status: current.status,
    };

    this.incidents.update((items) => [newIncident, ...items]);
    this.form.set({ title: '', description: '', severity: 'Média', owner: '', status: 'Aberto' });
  }

  getSeverityClass(severity: IncidentSeverity): string {
    return {
      Baixa: 'severity-low',
      Média: 'severity-medium',
      Alta: 'severity-high',
      Crítica: 'severity-critical',
    }[severity];
  }
}
