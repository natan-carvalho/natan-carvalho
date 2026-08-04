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
import { Machine, MachineStatus } from '../../models/dashboard-card.model';
import { MockDataService } from '../../services/mock-data.service';

@Component({
  selector: 'app-inventario',
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
  templateUrl: './inventario.component.html',
  styleUrl: './inventario.component.scss',
})
export class InventarioComponent {
  readonly machines = signal<Machine[]>([]);
  readonly form = signal({
    name: '',
    hostname: '',
    department: '',
    status: 'Online' as MachineStatus,
  });

  readonly displayedColumns = ['name', 'hostname', 'department', 'status', 'lastUpdate'];

  constructor(private readonly mockData: MockDataService) {
    this.machines.set(this.mockData.machines());
  }

  addMachine(): void {
    const current = this.form();
    if (!current.name || !current.hostname || !current.department) {
      return;
    }

    const newMachine: Machine = {
      id: Date.now(),
      name: current.name,
      hostname: current.hostname,
      department: current.department,
      status: current.status,
      lastUpdate: 'agora',
    };

    this.machines.update((items) => [newMachine, ...items]);
    this.form.set({ name: '', hostname: '', department: '', status: 'Online' });
  }

  getStatusClass(status: MachineStatus): string {
    return {
      Online: 'status-online',
      Aletar: 'status-alert',
      Offline: 'status-offline',
    }[status];
  }
}
