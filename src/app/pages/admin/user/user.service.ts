import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, PagedResponse } from './user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = '/api/v1/auth';

  constructor(private http: HttpClient) {}

  getUsers(page = 0, size = 10): Observable<PagedResponse<User>> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const params = new HttpParams().set('page', page).set('size', size);

    return this.http.get<PagedResponse<User>>(this.apiUrl+'/users', { headers, params });
  }
  deleteUser(user: User): Observable<void> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const userId = user.id; // assuming 'id' is the unique identifier for a user

    return this.http.delete<void>(`/api/v1/auth/Delete/${userId}`, { headers });
  }

  // In your user.service.ts
  promoteUser(email: string, role: string, token: string) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<void>(`${this.apiUrl}/Promote`, { email, role }, { headers });
  }

  demoteUser(email: string, role: string, token: string) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<void>(`${this.apiUrl}/Demote`, { email, role }, { headers });
  }
  searchUsers(filters: any, page: number, size: number, token: string): Observable<PagedResponse<User>> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    // Add filters to params if provided
    for (const key in filters) {
      if (filters[key] != null) {
        params = params.set(key, filters[key]);
      }
    }
    return this.http.get<PagedResponse<User>>(`${this.apiUrl}/search`, { params,headers });
  }

  // Generate User Report
  generateUserReport(directoryPath?: string, fileName?: string): Observable<void> {
    const params = new HttpParams()
      .set('directoryPath', directoryPath || '')
      .set('fileName', fileName || 'user_report');

    return this.http.get<void>(`${this.apiUrl}/generateUserReport`, { params });
  }
  registerUser(user: any): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/register`, user);
  }
  editUser(user: any): Observable<void> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.put<void>(`${this.apiUrl}/Modify`, user, { headers });
  }
  changePassword(userId: number, newPassword: string, oldPassword: string): Observable<void> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post<void>(`${this.apiUrl}/modify-password`, {
      userId,
      newPassword,
      oldPassword
    }, { headers });
  }


}
