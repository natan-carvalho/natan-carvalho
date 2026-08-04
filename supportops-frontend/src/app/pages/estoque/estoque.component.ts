import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { PageTitleComponent } from '../../shared/page-title/page-title.component';
import { InventoryItem, InventorySummary } from '../../models/dashboard-card.model';
import { MockDataService } from '../../services/mock-data.service';

@Component({
  selector: 'app-estoque',
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
    PageTitleComponent,
  ],
  templateUrl: './estoque.component.html',
  styleUrl: './estoque.component.scss',
})
export class EstoqueComponent {
  readonly items = signal<InventoryItem[]>([]);
  readonly summary = signal<InventorySummary>({ totalItems: 0, available: 0, inUse: 0, maintenance: 0 });
  readonly form = signal({
    name: '',
    category: '',
    quantity: 1,
    location: '',
    status: 'Disponível' as InventoryItem['status'],
  });

  readonly displayedColumns = ['name', 'category', 'quantity', 'location', 'status'];

  constructor(private readonly mockData: MockDataService) {
    this.items.set(this.mockData.inventoryItems());
    this.summary.set(this.mockData.inventorySummary());
  }

  addItem(): void {
    const current = this.form();
    if (!current.name || !current.category || !current.location) {
      return;
    }

    const newItem: InventoryItem = {
      id: Date.now(),
      name: current.name,
      category: current.category,
      quantity: current.quantity,
      location: current.location,
      status: current.status,
    };

    this.items.update((list) => [newItem, ...list]);
    this.summary.update((value) => ({
      totalItems: value.totalItems + 1,
      available: value.available + (current.status === 'Disponível' ? 1 : 0),
      inUse: value.inUse + (current.status === 'Em uso' ? 1 : 0),
      maintenance: value.maintenance + (current.status === 'Em manutenção' ? 1 : 0),
    }));
    this.form.set({ name: '', category: '', quantity: 1, location: '', status: 'Disponível' });
  }

  getStatusClass(status: InventoryItem['status']): string {
    return {
      Disponível: 'status-available',
      'Em uso': 'status-in-use',
      'Em manutenção': 'status-maintenance',
    }[status];
  }
}
