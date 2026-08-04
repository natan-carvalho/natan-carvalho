export interface DashboardCard {
  title: string;
  value: string;
  icon: string;
  trend: string;
  color: string;
}

export interface SidebarItem {
  label: string;
  route: string;
  icon: string;
}

export interface AppUser {
  name: string;
  role: string;
  initials: string;
}

export type MachineStatus = 'Online' | 'Aletar' | 'Offline';

export interface Machine {
  id: number;
  name: string;
  hostname: string;
  department: string;
  status: MachineStatus;
  lastUpdate: string;
}

export type IncidentSeverity = 'Baixa' | 'Média' | 'Alta' | 'Crítica';

export interface Incident {
  id: number;
  title: string;
  description: string;
  severity: IncidentSeverity;
  owner: string;
  createdAt: string;
  status: 'Aberto' | 'Em análise' | 'Resolvido';
}

export interface IncidentReport {
  total: number;
  open: number;
  resolved: number;
  critical: number;
}

export interface InventoryItem {
  id: number;
  name: string;
  category: string;
  quantity: number;
  location: string;
  status: 'Disponível' | 'Em uso' | 'Em manutenção';
}

export interface InventorySummary {
  totalItems: number;
  available: number;
  inUse: number;
  maintenance: number;
}

export type ReportPeriod = 'Diário' | 'Mensal' | 'Anual';

export interface ReportMetric {
  period: ReportPeriod;
  incidents: number;
  resolved: number;
  uptime: string;
  productivity: string;
}
