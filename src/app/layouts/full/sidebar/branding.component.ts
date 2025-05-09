import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-branding',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="branding">
      <a [routerLink]="['/']" class="brand-link">
        <img
          src="/assets/images/logos/dark-logo.svg"
          class="brand-logo"
          alt="logo"
        />
      </a>
    </div>
  `,
  styles: [`
    .branding {
      padding: 1rem;
    }
    
    .brand-link {
      display: flex;
      align-items: center;
      text-decoration: none;
    }
    
    .brand-logo {
      height: 40px;
      width: auto;
    }
  `]
})
export class BrandingComponent {
  constructor() {}
}
