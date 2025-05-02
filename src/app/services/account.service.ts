import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private apiUrl = 'http://localhost:8080/api/v1/Account';
  private userApiUrl = 'http://localhost:8080/api/v1/User';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.userApiUrl}/dispuser`);
  }

  createAccount(accountData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/addaccount`, accountData);
  }

  sendAccountEmail(accountId: number, userId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${accountId}/send-email`, { userId });
  }

  exportAccountToExcel(accountId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${accountId}/export-excel`, { 
      responseType: 'blob' 
    });
  }
} 