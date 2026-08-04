import { Injectable, signal } from '@angular/core';
import { AppUser, DashboardCard, Incident, IncidentReport, InventoryItem, InventorySummary, Machine, ReportMetric, SidebarItem } from '../models/dashboard-card.model';

@Injectable({ providedIn: 'root' })
export class MockDataService {
  readonly sidebarItems = signal<SidebarItem[]>([
    { label: 'Dashboard', route: '/dashboard', icon: 'dashboard' },
    { label: 'Inventário', route: '/inventario', icon: 'inventory_2' },
    { label: 'Chamados', route: '/chamados', icon: 'support_agent' },
    { label: 'Incidentes', route: '/incidentes', icon: 'warning_amber' },
    { label: 'Estoque', route: '/estoque', icon: 'warehouse' },
    { label: 'Relatórios', route: '/relatorios', icon: 'bar_chart' },
    { label: 'Configurações', route: '/configuracoes', icon: 'settings' },
    { label: 'Usuários', route: '/usuarios', icon: 'group' },
  ]);

  readonly dashboardCards = signal<DashboardCard[]>([
    { title: 'Computadores', value: '184', icon: 'desktop_windows', trend: '+12% este mês', color: '#4f8cff' },
    { title: 'Chamados', value: '37', icon: 'support_agent', trend: '8 em aberto', color: '#ffb84d' },
    { title: 'Incidentes', value: '5', icon: 'warning_amber', trend: '2 críticos', color: '#ff5d7a' },
    { title: 'Equipamentos', value: '92', icon: 'devices', trend: '+4 novos', color: '#2ec7a6' },
    { title: 'Salas', value: '14', icon: 'meeting_room', trend: '3 em manutenção', color: '#8b6bff' },
    { title: 'Usuários', value: '128', icon: 'group', trend: '6 ativos hoje', color: '#2bb5ff' },
  ]);

  readonly user = signal<AppUser>({
    name: 'Natan Carvalho',
    role: 'Gerente de Operações',
    initials: 'NC',
  });

  readonly machines = signal<Machine[]>([
    {
      id: 1,
      name: 'PC-001',
      hostname: 'SUP-WS-001',
      department: 'Suporte Técnico',
      status: 'Online',
      lastUpdate: '2 min atrás',
    },
    {
      id: 2,
      name: 'PC-002',
      hostname: 'SUP-WS-002',
      department: 'Rede',
      status: 'Aletar',
      lastUpdate: '12 min atrás',
    },
    {
      id: 3,
      name: 'PC-003',
      hostname: 'SUP-WS-003',
      department: 'Infraestrutura',
      status: 'Offline',
      lastUpdate: '1h atrás',
    },
  ]);

  readonly incidents = signal<Incident[]>([
    {
      id: 1,
      title: 'Falha no acesso remoto',
      description: 'Usuários da equipe de suporte não conseguiram acessar a VPN.',
      severity: 'Alta',
      owner: 'Marina',
      createdAt: 'Hoje, 08:20',
      status: 'Aberto',
    },
    {
      id: 2,
      title: 'Monitor desconectado',
      description: 'Uma estação do setor de rede ficou sem vídeo.',
      severity: 'Média',
      owner: 'Rafael',
      createdAt: 'Hoje, 10:10',
      status: 'Em análise',
    },
    {
      id: 3,
      title: 'Atualização de impressora',
      description: 'Impressora de etiquetas reiniciou após atualização.',
      severity: 'Baixa',
      owner: 'Luiza',
      createdAt: 'Ontem, 16:40',
      status: 'Resolvido',
    },
  ]);

  readonly incidentReport = signal<IncidentReport>({
    total: 3,
    open: 1,
    resolved: 1,
    critical: 0,
  });

  readonly inventoryItems = signal<InventoryItem[]>([
    {
      id: 1,
      name: 'Headset Logitech',
      category: 'Periférico',
      quantity: 12,
      location: 'Setor A',
      status: 'Disponível',
    },
    {
      id: 2,
      name: 'Teclado Mecânico',
      category: 'Periférico',
      quantity: 8,
      location: 'Setor B',
      status: 'Em uso',
    },
    {
      id: 3,
      name: 'Notebook Dell',
      category: 'Computador',
      quantity: 4,
      location: 'TI',
      status: 'Em manutenção',
    },
  ]);

  readonly inventorySummary = signal<InventorySummary>({
    totalItems: 3,
    available: 1,
    inUse: 1,
    maintenance: 1,
  });

  readonly reports = signal<ReportMetric[]>([
    { period: 'Diário', incidents: 8, resolved: 6, uptime: '99.2%', productivity: '87%' },
    { period: 'Mensal', incidents: 42, resolved: 37, uptime: '98.8%', productivity: '91%' },
    { period: 'Anual', incidents: 512, resolved: 486, uptime: '99.6%', productivity: '94%' },
  ]);
}
