import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-branding',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="branding">
      <a [routerLink]="['/']">
        <img src="../../assets/images/Front/logo.png" alt="logo" style="width: 230px; height: auto;"  class="align-middle" />

      </a>
    </div>
  `,
})
export class BrandingComponent {
  constructor() {}
}
