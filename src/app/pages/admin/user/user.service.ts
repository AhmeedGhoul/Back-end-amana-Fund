import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, tap, catchError, of } from 'rxjs';
import { User, PagedResponse } from './user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = '/api/v1/auth';

  constructor(private http: HttpClient) {}

  getUsers(page = 0, size = 10): Observable<PagedResponse<User>> {
    const params = new HttpParams().set('page', page).set('size', size);
    
    return this.http.get<PagedResponse<User>>(this.apiUrl+'/users', { params })
      .pipe(
        tap(response => {
          console.log('Raw user response:', response);
          if (!response || !response.content) {
            console.error('Invalid user response format:', response);
          }
        }),
        catchError(error => {
          console.error('Error fetching users:', error);
          // Return an empty response structure to prevent application crashes
          return of({ content: [], totalElements: 0, totalPages: 0, size: 0, number: 0 });
        })
      );
  }
  deleteUser(user: User): Observable<void> {
    const userId = user.id; // assuming 'id' is the unique identifier for a user
    return this.http.delete<void>(`/api/v1/auth/Delete/${userId}`);
  }

  // In your user.service.ts
  promoteUser(email: string, role: string) {
    return this.http.post<void>(`${this.apiUrl}/Promote`, { email, role });
  }

  demoteUser(email: string, role: string) {
    return this.http.post<void>(`${this.apiUrl}/Demote`, { email, role });
  }
  searchUsers(filters: any, page: number, size: number): Observable<PagedResponse<User>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    // Add filters to params if provided
    for (const key in filters) {
      if (filters[key] != null) {
        params = params.set(key, filters[key]);
      }
    }
    return this.http.get<PagedResponse<User>>(`${this.apiUrl}/search`, { params });
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
    return this.http.put<void>(`${this.apiUrl}/Modify`, user);
  }



}
