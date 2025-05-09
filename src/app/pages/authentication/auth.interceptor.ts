import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('authToken');

    // Check if this is a public request (authentication or registration)
    const isPublicRequest = req.url.includes('/api/v1/auth/authenticate') ||
      req.url.includes('/api/v1/auth/forgot-password') ||
      req.url.includes('/api/v1/auth/reset-password');


    if (token && !isPublicRequest) {
      const clonedRequest = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`),
      });
      return next.handle(clonedRequest);
    }

    // Public API: don't attach token
    return next.handle(req);
  }
}
