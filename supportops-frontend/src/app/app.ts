import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { HeaderComponent } from './layout/header/header.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { FooterComponent } from './layout/footer/footer.component';
import { MockDataService } from './services/mock-data.service';
import { SidebarItem } from './models/dashboard-card.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MatSidenavModule, HeaderComponent, SidebarComponent, FooterComponent],
  template: `
    <div class="app-shell" [class.collapsed]="collapsed()">
      <app-header
        [collapsed]="collapsed()"
        [userName]="user().name"
        [userRole]="user().role"
        (toggleSidebar)="toggleSidebar()"
        (logout)="goToLogin()"
      ></app-header>

      <div class="content-row">
        <app-sidebar [items]="sidebarItems()" [collapsed]="collapsed()"></app-sidebar>

        <main class="main-content">
          <router-outlet></router-outlet>
        </main>
      </div>

      <app-footer></app-footer>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        height: 100%;
      }

      .app-shell {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        background: #060915;
        color: #f8fbff;
      }

      .content-row {
        display: flex;
        flex: 1;
      }

      .main-content {
        flex: 1;
        padding: 1.5rem;
        background: linear-gradient(180deg, #0f172a 0%, #060915 100%);
      }

      @media (max-width: 768px) {
        .content-row {
          flex-direction: column;
        }
      }
    `,
  ],
})
export class App {
  protected readonly collapsed = signal(false);
  protected readonly sidebarItems = signal<SidebarItem[]>([]);
  protected readonly user = signal({ name: 'Natan Carvalho', role: 'Gerente de Operações' });

  constructor(private readonly mockData: MockDataService) {
    this.sidebarItems.set(this.mockData.sidebarItems());
    this.user.set(this.mockData.user());
  }

  toggleSidebar(): void {
    this.collapsed.set(!this.collapsed());
  }

  goToLogin(): void {
    window.location.href = '/login';
  }
}
