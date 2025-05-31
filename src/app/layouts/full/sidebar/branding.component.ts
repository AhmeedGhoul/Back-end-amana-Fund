import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-branding',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="branding">
      <a [routerLink]="['/']" class="logo-link">
        <img 
          [src]="logoPath" 
          alt="Amana Fund Logo" 
          class="logo" 
        />
      </a>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }
    
    .branding {
      padding: 12px 16px 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      box-sizing: border-box;
      
      .logo-link {
        display: block;
        text-align: center;
        width: 100%;
        text-decoration: none;
      }
      
      .logo {
        max-width: 100%;
        height: 200px;
        width: auto;
        display: block;
        margin: 0 auto;
        object-fit: contain;
        transition: all 0.3s ease;
      }
      
      @media (max-width: 1199px) {
        .logo {
          height: 180px;
        }
      }
      
      @media (max-width: 767px) {
        .logo {
          height: 150px;
        }
      }
    }
  `]
})
export class BrandingComponent {
  // Use absolute path for better reliability
  logoPath = 'assets/images/Front/logo1.2.png';
  
  constructor() {}
}
