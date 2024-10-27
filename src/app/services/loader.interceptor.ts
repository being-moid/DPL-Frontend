import { inject } from '@angular/core';
import { finalize, tap, catchError, delay } from 'rxjs/operators';
import { LoaderService } from './loader.service';
import { HttpInterceptorFn } from '@angular/common/http';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  // Injecting the LoaderService
  const loadingService = inject(LoaderService);

  // Show the loader when a request starts
  loadingService.show();

  return next(req).pipe(

    // Handle successful responses
    tap(() => {
      loadingService.showMessage('success', 'Request successful!');
    }),
    // Handle errors
    catchError((error) => {
      loadingService.showMessage('error', 'An error occurred.');
      throw error; // Rethrow the error for further handling
    }),
    // Delay for a specified amount of time (e.g., 500ms) before finalizing
    finalize(() =>
      next(req).subscribe({
        complete: () => loadingService.hide()
      })
    )
  );
};
