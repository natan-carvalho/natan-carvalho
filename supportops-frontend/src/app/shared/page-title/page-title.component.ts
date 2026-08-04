import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-page-title',
  standalone: true,
  template: `
    <div class="page-title">
      <h1>{{ title }}</h1>
      <p>{{ subtitle }}</p>
    </div>
  `,
  styles: [
    `
      .page-title {
        margin-bottom: 1.25rem;
      }

      h1 {
        margin: 0;
        font-size: 1.7rem;
        font-weight: 700;
      }

      p {
        margin: 0.25rem 0 0;
        color: rgba(255, 255, 255, 0.72);
      }
    `,
  ],
})
export class PageTitleComponent {
  @Input() title = '';
  @Input() subtitle = '';
}
