import { Component } from '@angular/core';
import { NgIf, AsyncPipe, CommonModule } from '@angular/common';
import { LoaderService } from './services/loader.service';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [NgIf, AsyncPipe, CommonModule],
  template: `
    <div *ngIf="(loaderService.loading$ | async) || (loaderService.message$ | async)" class="loader-container">

      <!-- Loading Message -->
      <div *ngIf="loaderService.loading$ | async" role="alert" class="alert alert-info">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="h-6 w-6 shrink-0 stroke-current">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <span>{{ loaderService.loadingMessage$ | async }}</span>
      </div>

      <!-- Alert Message -->
      <div role="alert" *ngIf="(loaderService.message$ | async) as message" class="alert" [ngClass]="{
        'alert-success': message?.type === 'success',
        'alert-error': message?.type === 'error'
      }">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="h-6 w-6 shrink-0 stroke-current">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{{ message.text }}</span>
      </div>

    </div>
  `,
  styles: [`
    .loader-container {
      position: fixed;
      top: 1rem;
      right: 1rem;
      z-index: 9999; /* Ensure the loader is above all other content */
      max-width: 300px;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .alert {
      display: flex;
      align-items: center;
      padding: 0.75rem 1rem;
      border-radius: 0.25rem;
      background-color: #f0f0f0;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .alert-info {
      background-color: #d1ecf1;
      color: #0c5460;
    }

    .alert-success {
      background-color: #d4edda;
      color: #155724;
    }

    .alert-error {
      background-color: #f8d7da;
      color: #721c24;
    }

    .h-6 {
      height: 1.5rem;
      width: 1.5rem;
      margin-right: 0.5rem;
    }
  `]
})
export class LoaderComponent {
  constructor(public loaderService: LoaderService) {}
}
