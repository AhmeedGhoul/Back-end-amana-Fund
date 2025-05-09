import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Payment } from '../models/Payment';

interface FraudCheckResult {
  isFraudulent: boolean;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = '/api/v1/payments';
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }
  constructor(private http: HttpClient) {}

  getPayments(): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.apiUrl}/all`,
        { headers: this.getAuthHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  getPaymentById(id: number): Observable<Payment> {
    return this.http.get<Payment>(`${this.apiUrl}/${id}`,
        { headers: this.getAuthHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  createPayment(payment: Payment): Observable<Payment> {
    const payload = {
      ...payment,
      date_payment: payment.date_payment ?
                   new Date(payment.date_payment).toISOString() :
                   new Date().toISOString()
    };

    return this.http.post<Payment>(`${this.apiUrl}/add`, payload,
        { headers: this.getAuthHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  updatePayment(payment: Payment): Observable<Payment> {
    return this.http.put<Payment>(`${this.apiUrl}/update/${payment.id_payment}`, payment,
        { headers: this.getAuthHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  deletePayment(id: number): Observable<void> {
    if (!id || isNaN(id)) {
      return throwError(() => new Error('Invalid payment ID'));
    }

    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`,
        { headers: this.getAuthHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  checkFraud(payment: Payment): Observable<FraudCheckResult> {
    return this.http.post<FraudCheckResult>(`${this.apiUrl}/check`, payment,
        { headers: this.getAuthHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    let errorMessage = 'An error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      switch (error.status) {
        case 400:
          errorMessage = 'Invalid request';
          break;
        case 404:
          errorMessage = 'Payment not found';
          break;
        case 500:
          errorMessage = 'Server error';
          break;
        default:
          errorMessage = error.error?.message || error.message;
      }
    }

    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
