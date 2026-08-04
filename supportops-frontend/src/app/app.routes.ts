import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { InventarioComponent } from './pages/inventario/inventario.component';
import { IncidentesComponent } from './pages/incidentes/incidentes.component';
import { EstoqueComponent } from './pages/estoque/estoque.component';
import { RelatoriosComponent } from './pages/relatorios/relatorios.component';
import { LoginComponent } from './pages/login/login.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'inventario', component: InventarioComponent },
  { path: 'incidentes', component: IncidentesComponent },
  { path: 'estoque', component: EstoqueComponent },
  { path: 'relatorios', component: RelatoriosComponent },
  { path: '**', redirectTo: 'login' },
];
