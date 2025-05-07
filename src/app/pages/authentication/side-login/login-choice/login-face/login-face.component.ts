import { Component } from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import { Subject } from 'rxjs';
import {WebcamImage, WebcamModule} from 'ngx-webcam';
import { FaceAuthService } from './face-auth.service';
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-login-face',
  templateUrl: './login-face.component.html',
  standalone: true,
  styleUrls: ['./login-face.component.css'],
  imports: [
    MatCardModule,
    RouterLink,
    WebcamModule,
    MatIconModule,
    MatButtonModule,
    NgIf
  ],
})
export class LoginFaceComponent {
  trigger: Subject<void> = new Subject<void>();
  triggerObservable = this.trigger.asObservable();
  errorMessage = '';

  constructor(private faceAuthService: FaceAuthService, private router: Router) {}

  capture(): void {
    this.trigger.next(); // triggers the webcam capture
  }

  handleImage(webcamImage: WebcamImage): void {
    const blob = this.dataURLtoBlob(webcamImage.imageAsDataUrl);
    const formData = new FormData();
    formData.append('image', blob, 'face.jpg');

    this.faceAuthService.loginWithFace(formData).subscribe({
      next: (res) => {
        localStorage.setItem('authToken', res.token);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        const msg = err?.error?.message || err?.error || 'Face not recognized. Try again.';
        this.errorMessage =
          typeof err?.error === 'string'
            ? err.error
            : err?.error?.message || 'Face not recognized. Try again.';
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/authentication/login']);
  }

  private dataURLtoBlob(dataUrl: string): Blob {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new Blob([u8arr], { type: mime });
  }
}
