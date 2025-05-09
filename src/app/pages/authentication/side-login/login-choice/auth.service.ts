import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthRequest, AuthResponse } from './auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8088/api/v1/auth/authenticate';

  constructor(private http: HttpClient) {}

  login(authRequest: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.apiUrl, authRequest).pipe(
      tap(response => {
        localStorage.setItem('authToken', response.token);
      })
    );
  }

  forgotPassword(email: string): Observable<any> {
    const params = new HttpParams().set('email', email);  // Add email as a query parameter
    return this.http.post('http://localhost:8088/api/v1/auth/forgot-password', null, { params });
  }
  resetPassword(token: string, newPassword: string): Observable<any> {
    console.log(token);  // Debugging log to check token value
    return this.http.post('http://localhost:8088/api/v1/auth/reset-password', { token, newPassword });
  }


  logout(): void {
    localStorage.removeItem('authToken');
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }


  isLoggedIn(): boolean {
    return !!this.getToken();
  }
  getCurrentUser(): { roles: string[] } {
    const token = localStorage.getItem('authToken');
    if (!token) return { roles: [] };

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        roles: payload.roles || payload.authorities || []
      };
    } catch (e) {
      console.error('Failed to decode JWT', e);
      return { roles: [] };
    }
  }
}
