import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { User } from '../models/user.model';
import { AuthService } from '@app/pages/authentication/side-login/auth.service';
import { Account, Page } from '../models/account.model';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private apiUrl = 'http://localhost:8088/api/v1/Account';
  private userApiUrl = 'http://localhost:8088/api/v1/User';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  getAccounts(params: any): Observable<Page<Account>> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    
    // Use the paged endpoint
    const url = `${this.apiUrl}/dispaccount/paged`;
    
    // Prepare query parameters
    const queryParams: { [key: string]: string | number } = {
      page: params.page || 0,
      size: params.size || 10
    };
    
    // Add optional filtering
    if (params.accountType) {
      // Ensure the account type is a valid enum value
      const validAccountTypes = ['EPARGNE', 'EPARGNE_ZEKET'];
      const accountType = params.accountType.toUpperCase();
      
      if (validAccountTypes.includes(accountType)) {
        queryParams['accountType'] = accountType;
      } else {
        console.warn(`Invalid account type: ${params.accountType}. Using default.`);
      }
    }
    
    // Add RIB filtering if provided
    if (params.rib) {
      queryParams['rib'] = params.rib;
    }
    
    return this.http.get<Page<Account>>(url, {
      headers,
      params: new HttpParams({ fromObject: queryParams })
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Account retrieval error:', {
          status: error.status,
          message: error.message,
          errorBody: error.error,
          requestParams: queryParams
        });
        
        // Rethrow the error to be handled by the component
        return throwError(() => error);
      })
    );
  }

  filterAccountsByType(accountType: string): Observable<Account[]> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.get<Account[]>(`${this.apiUrl}/filter/type`, {
      headers,
      params: new HttpParams().set('accountType', accountType)
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Account type filtering error:', {
          status: error.status,
          message: error.message,
          errorBody: error.error
        });
        
        return throwError(() => error);
      })
    );
  }

  filterAccountsByRib(rib: string): Observable<Account[]> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    // Trim and validate RIB before sending
    const trimmedRib = rib.trim();
    if (!trimmedRib) {
      return throwError(() => new Error('RIB cannot be empty'));
    }

    return this.http.get<Account>(`${this.apiUrl}/by-rib/${trimmedRib}`, { headers }).pipe(
      map((account: Account | null) => {
        if (account) {
          console.log('Account found by RIB:', account);
          return [account];
        } else {
          console.warn('No account found for RIB:', trimmedRib);
          return [];
        }
      }),
      catchError((error: HttpErrorResponse) => {
        // More comprehensive error logging
        console.error('Detailed Account RIB filtering error:', {
          status: error.status,
          statusText: error.statusText,
          message: error.message,
          errorBody: error.error,
          requestRib: trimmedRib,
          headers: error.headers?.keys(),
          url: error.url
        });
        
        // Detailed error handling
        let errorMessage = `Failed to find account with RIB: ${trimmedRib}`;
        
        // Check for specific error details
        if (error.error instanceof ErrorEvent) {
          // Client-side error
          errorMessage += ` - Client Error: ${error.error.message}`;
        } else if (error.error && error.error.message) {
          // Server-side error with message
          errorMessage += ` - Server Error: ${error.error.message}`;
        }
        
        // Specific handling for different status codes
        switch (error.status) {
          case 404:
            console.warn(`No account found for RIB: ${trimmedRib}`);
            return of([]); // Return empty array for 404
          case 500:
            console.error(`Internal Server Error for RIB: ${trimmedRib}`);
            break;
          case 0:
            errorMessage += ' - Network Error or Server Unreachable';
            break;
        }
        
        // Rethrow error with detailed message
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  deleteAccount(accountId: number): Observable<void> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    return this.http.delete<void>(`${this.apiUrl}/${accountId}`, { headers });
  }

  // Keep the rest of your existing methods
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.userApiUrl}/dispuser`);
  }

  createAccount(data: any): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    return this.http.post(`${this.apiUrl}/addaccount`, data, { headers }).pipe(
      catchError(error => {
        console.error('Full error response:', {
          status: error.status,
          message: error.error?.message,
          details: error.error,
          headers: error.headers,
          url: error.url
        });
        return throwError(() => error);
      })
    );
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