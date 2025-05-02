import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AccountPayment } from '../models/account-payment.model';

@Injectable({
  providedIn: 'root'
})
export class AccountPaymentService {
  private apiUrl = `${environment.apiUrl}/account-payments`;

  constructor(private http: HttpClient) {}

  getAccountPayments(): Observable<AccountPayment[]> {
    return this.http.get<AccountPayment[]>(this.apiUrl);
  }

  getAccountPayment(id: number): Observable<AccountPayment> {
    return this.http.get<AccountPayment>(`${this.apiUrl}/${id}`);
  }

  createAccountPayment(payment: AccountPayment): Observable<AccountPayment> {
    return this.http.post<AccountPayment>(this.apiUrl, payment);
  }

  updateAccountPayment(id: number, payment: AccountPayment): Observable<AccountPayment> {
    return this.http.put<AccountPayment>(`${this.apiUrl}/${id}`, payment);
  }

  deleteAccountPayment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getAccountPaymentsPaged(page: number, size: number): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<any>(`${this.apiUrl}/paged`, { params });
  }

  getAccountPaymentsByAgency(agencyName: string): Observable<AccountPayment[]> {
    const params = new HttpParams().set('agencyName', agencyName);
    return this.http.get<AccountPayment[]>(`${this.apiUrl}/by-agency`, { params });
  }

  getAccountPaymentsByDateRange(startDate: string, endDate: string): Observable<AccountPayment[]> {
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);
    return this.http.get<AccountPayment[]>(`${this.apiUrl}/by-date-range`, { params });
  }
} 