// src/app/shared/loader/loader.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderService } from './loader.service';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="loaderService.loading$ | async" class="global-loader">
      <div class="loader-spinner"></div>
    </div>
  `,
  styles: [`
    .global-loader {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(255, 255, 255, 0.7);
      z-index: 9999;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .loader-spinner {
      width: 60px;
      height: 60px;
      border: 6px solid #ccc;
      border-top-color: #3f51b5;
      border-radius: 50%;
      animation: spin 0.9s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class LoaderComponent {
  constructor(public loaderService: LoaderService) {}
}
