import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="app-footer">
      <span>SupportOps © 2026</span>
      <span>Gestão operacional em tempo real</span>
    </footer>
  `,
  styles: [
    `
      .app-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 1.5rem;
        color: rgba(255, 255, 255, 0.72);
        font-size: 0.9rem;
        border-top: 1px solid rgba(255, 255, 255, 0.08);
      }

      @media (max-width: 768px) {
        .app-footer {
          flex-direction: column;
          gap: 0.35rem;
        }
      }
    `,
  ],
})
export class FooterComponent {}
