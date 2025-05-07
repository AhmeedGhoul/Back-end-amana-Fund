import { Component } from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'app-login-choice',
  templateUrl: './login-choice.component.html',
  styleUrls: ['./login-choice.component.css'],
  imports: [
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    RouterLink
  ],
  standalone: true

})
export class LoginChoiceComponent {
  constructor(private router: Router) {}

  goToEmailLogin(): void {
    this.router.navigate(['/authentication/login-normal']);
  }

  goToFaceLogin(): void {
    this.router.navigate(['/authentication/login-face']);
  }
}
