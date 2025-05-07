import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { UserService } from '../user/user.service';
import { User } from '../user/user.model';
import {MatCardModule} from "@angular/material/card";
import {NgIf} from "@angular/common";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {MaterialModule} from "../../../material.module";
import { Subject } from 'rxjs';
import { WebcamImage, WebcamModule } from 'ngx-webcam';
import { FaceAuthService } from '../../authentication/side-login/login-choice/login-face/face-auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  standalone: true,
  imports: [
    MatCardModule,
    NgIf,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    MaterialModule,
    FormsModule,
    WebcamModule
  ]
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  editForm!: FormGroup;
  oldPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  isEditing: boolean = false;
  isPasswordEditing: boolean = false;

  // Face recognition
  showFaceRegister = false;
  trigger: Subject<void> = new Subject<void>();
  triggerObservable = this.trigger.asObservable();

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private faceAuthService: FaceAuthService
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    const userId = 1; // Replace with actual ID from token/session
    this.userService.getUsers().subscribe((response) => {
      const foundUser = response.content.find((u) => u.id === userId) ?? null;
      this.user = foundUser;
      if (this.user) {
        this.editForm = this.fb.group({
          firstName: [this.user.firstName, Validators.required],
          lastName: [this.user.lastName, Validators.required],
          email: [this.user.email, [Validators.required, Validators.email]],
          phoneNumber: [this.user.phoneNumber, Validators.required],
          address: [this.user.address, Validators.required],
          dateOfBirth: [this.user.dateOfBirth, Validators.required],
          age: [this.user.age, [Validators.required, Validators.min(18), Validators.max(150)]],
          civilStatus: [this.user.civilStatus, Validators.required],
        });
      }
    });
  }

  enableEditing(): void {
    this.isEditing = true;
  }

  onSubmit(): void {
    if (this.editForm.valid && this.user) {
      const updatedUser: User = {
        ...this.editForm.value
      };

      this.userService.editUser(updatedUser).subscribe({
        next: () => {
          alert('Profile updated successfully!');
          this.isEditing = false;
          this.user = updatedUser;
        },
        error: err => {
          console.error('Update failed', err);
        }
      });
    }
  }

  togglePasswordEditing(): void {
    this.isPasswordEditing = !this.isPasswordEditing;
  }

  changePassword(): void {
    if (this.newPassword !== this.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    if (this.user) {
      this.userService.changePassword(this.user.id, this.oldPassword, this.newPassword).subscribe({
        next: () => {
          alert('Password changed successfully!');
          this.togglePasswordEditing();
        },
        error: (err) => {
          alert(err.error?.token || 'Failed to change password.');
          console.error(err);
        }
      });
    }
  }

  toggleFaceRegister(): void {
    this.showFaceRegister = true;
  }

  cancelFaceRegister(): void {
    this.showFaceRegister = false;
  }

  captureFace(): void {
    this.trigger.next();
  }

  registerFaceImage(webcamImage: WebcamImage): void {
    if (!this.user) return;
    const blob = this.dataURLtoBlob(webcamImage.imageAsDataUrl);
    const formData = new FormData();
    formData.append('image', blob, 'face.jpg');
    formData.append('userId', this.user.id.toString());

    this.faceAuthService.registerFace(formData).subscribe({
      next: () => {
        alert('Face registered successfully!');
        this.cancelFaceRegister();
      },
      error: () => {
        alert('Face registration failed.');
      }
    });
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
