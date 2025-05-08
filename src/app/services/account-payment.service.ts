import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AccountPayment } from '../models/account-payment.model';

@Injectable({
  providedIn: 'root'
})
export class AccountPaymentService {
  private apiUrl = `${environment.apiUrl}/account-payments`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getAccountPayments(): Observable<AccountPayment[]> {
    return this.http.get<AccountPayment[]>(`${this.apiUrl}/dispaccountpayment`, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  getAccountPayment(id: number): Observable<AccountPayment> {
    return this.http.get<AccountPayment>(`${this.apiUrl}/dispaccountpaymentId/${id}`, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  createAccountPayment(payment: AccountPayment): Observable<AccountPayment> {
    return this.http.post<AccountPayment>(`${this.apiUrl}/addaccountpayment`, payment, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  updateAccountPayment(payment: AccountPayment): Observable<AccountPayment> {
    if (!payment.id) {
      return throwError(() => new Error('Payment ID is required for update'));
    }
    return this.http.put<AccountPayment>(`${this.apiUrl}/updateaccountpayment`, payment, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  deleteAccountPayment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delaccountpayment/${id}`, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  getAccountPaymentsPaged(page: number, size: number): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    console.log('Fetching paged payments:', {
      url: `${this.apiUrl}/dispaccountpayment/paged`,
      page,
      size
    });

    return this.http.get<any>(`${this.apiUrl}/dispaccountpayment/paged`, { 
      headers: this.getAuthHeaders(),
      params,
      observe: 'response' // Capture full HTTP response
    }).pipe(
      map((response: HttpResponse<any>) => {
        console.log('Paged payments response:', response);
        return response.body;
      }),
      catchError(error => {
        console.error('Full error details:', {
          status: error.status,
          message: error.message,
          url: error.url
        });
        return this.handleError(error);
      })
    );
  }

  getAccountPaymentsByAgency(agencyName: string): Observable<AccountPayment[]> {
    const params = new HttpParams().set('agencyName', agencyName);
    return this.http.get<AccountPayment[]>(`${this.apiUrl}/filter/agency`, { 
      headers: this.getAuthHeaders(),
      params 
    }).pipe(catchError(this.handleError));
  }

  getAccountPaymentsByDateRange(startDate: string, endDate: string): Observable<AccountPayment[]> {
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);
    return this.http.get<AccountPayment[]>(`${this.apiUrl}/filter/date`, { 
      headers: this.getAuthHeaders(),
      params 
    }).pipe(catchError(this.handleError));
  }

  getAccountPaymentsByRib(rib: string): Observable<AccountPayment[]> {
    return this.http.get<AccountPayment[]>(`${this.apiUrl}/by-rib/${rib}`, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    console.error('Full HTTP Error:', error);

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Client Error: ${error.error.message}`;
    } else if (error.status === 0) {
      // Connection refused or network error
      errorMessage = `Connection Error: Unable to reach the server. Please check:\n` +
        `1. Backend server is running\n` +
        `2. Network connectivity\n` +
        `3. CORS configuration\n` +
        `4. Firewall or proxy settings`;
    } else {
      // Server-side error
      errorMessage = `Server Error Code: ${error.status}\n` +
        `Message: ${error.message}\n` +
        `URL: ${error.url || 'Unknown URL'}`;
    }

    // Log the detailed error for debugging
    console.error('Detailed Error:', {
      status: error.status,
      url: error.url,
      message: errorMessage
    });

    return throwError(() => new Error(errorMessage));
  }
}