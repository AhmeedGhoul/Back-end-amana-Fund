import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { User } from '../models/user.model';
import { AuthService } from '@app/pages/authentication/side-login/auth.service';
import { Account, Page } from '../models/account.model';
import { AccountPayment } from '../models/account-payment.model';

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

  getAccountByRib(rib: string): Observable<Account> {
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
      catchError((error: HttpErrorResponse) => {
        console.error('Error fetching account by RIB:', {
          status: error.status,
          message: error.message,
          errorBody: error.error
        });
        return throwError(() => error);
      })
    );
  }

  updateAccount(account: Account): Observable<Account> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    // Deep clone the account to avoid modifying the original object
    const accountToUpdate = JSON.parse(JSON.stringify(account));

    // Validate required fields
    const requiredFields = ['id', 'rib'];
    const missingFields = requiredFields.filter(field => 
      !accountToUpdate[field] || accountToUpdate[field] === null
    );

    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields);
      return throwError(() => new Error(`Missing required fields: ${missingFields.join(', ')}`));
    }

    // Specific fields to keep
    const fieldsToKeep = [
      'id', 'date_Opening', 'accountType', 'rib', 'amount', 'clientEmail', 
      'agent', 'zakatTransactions', 'zakatTransactionDates', 
      'nissabReachedDate', 'interestRate', 'eligibleForZakat'
    ];

    // Filter account to only include specified fields
    const filteredAccount: any = {};
    fieldsToKeep.forEach(field => {
      if (accountToUpdate.hasOwnProperty(field)) {
        // Special handling for nested objects
        if (field === 'agent' && accountToUpdate[field]) {
          // Ensure only specific agent fields are included
          const agentFieldsToKeep = [
            'id', 'firstName', 'lastName', 'email', 'phoneNumber'
          ];
          filteredAccount[field] = {};
          agentFieldsToKeep.forEach(agentField => {
            if (accountToUpdate[field][agentField] !== undefined) {
              filteredAccount[field][agentField] = accountToUpdate[field][agentField];
            }
          });
        } else if (accountToUpdate[field] !== null && accountToUpdate[field] !== undefined) {
          filteredAccount[field] = accountToUpdate[field];
        }
      }
    });

    // Validate data types and formats
    const validationErrors: string[] = [];
    
    // Validate amount
    if (filteredAccount.amount !== undefined) {
      if (typeof filteredAccount.amount !== 'number' || filteredAccount.amount < 0) {
        validationErrors.push('Amount must be a non-negative number');
      }
    }

    // Validate email
    if (filteredAccount.clientEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(filteredAccount.clientEmail)) {
        validationErrors.push('Invalid email format');
      }
    }

    // If validation errors exist, throw an error
    if (validationErrors.length > 0) {
      console.error('Validation Errors:', validationErrors);
      return throwError(() => new Error(`Validation failed: ${validationErrors.join(', ')}`));
    }

    // Log the filtered and validated account data before sending
    console.log('Validated Account Update Request:', {
      filteredAccount: JSON.stringify(filteredAccount, null, 2),
      originalAccount: JSON.stringify(accountToUpdate, null, 2)
    });

    return this.http.put<Account>(`${this.apiUrl}/updateaccount`, filteredAccount, { 
      headers, 
      observe: 'response' // Get full response to inspect headers and status
    }).pipe(
      map(response => {
        // Log successful response details
        console.log('Update Account Response:', {
          status: response.status,
          headers: response.headers.keys(),
          body: response.body
        });
        
        // Ensure non-null Account is returned
        if (!response.body) {
          throw new Error('No account data returned');
        }
        return response.body;
      }),
      catchError((error: HttpErrorResponse) => {
        // Comprehensive error logging
        console.error('Detailed Account Update Error:', {
          status: error.status,
          statusText: error.statusText,
          message: error.message,
          errorBody: error.error,
          headers: error.headers?.keys(),
          url: error.url,
          requestBody: filteredAccount
        });

        // Detailed error handling based on status
        let errorMessage = 'Failed to update account';
        let detailedErrorInfo = 'No additional details';

        // Try to extract detailed error information
        try {
          // Check for different possible error response formats
          if (error.error instanceof ErrorEvent) {
            // Client-side error
            detailedErrorInfo = error.error.message;
          } else if (typeof error.error === 'string') {
            // Might be a string error message
            detailedErrorInfo = error.error;
          } else if (error.error && typeof error.error === 'object') {
            // Try to extract message from different possible keys
            detailedErrorInfo = error.error.message || 
                                error.error.error || 
                                error.error.detail || 
                                JSON.stringify(error.error);
          }
        } catch (e) {
          console.warn('Error extracting detailed error info:', e);
        }

        // Specific error handling based on status
        switch (error.status) {
          case 400:
            errorMessage = 'Invalid account data';
            break;
          case 401:
            errorMessage = 'Unauthorized';
            break;
          case 403:
            errorMessage = 'Forbidden';
            break;
          case 404:
            errorMessage = 'Account not found';
            break;
          case 500:
            errorMessage = 'Server error';
            break;
          case 0:
            errorMessage = 'Network error';
            break;
        }

        // Combine error message with detailed info
        if (detailedErrorInfo !== 'No additional details') {
          errorMessage += `: ${detailedErrorInfo}`;
        }

        console.error('Full Error Details:', {
          errorMessage,
          detailedErrorInfo,
          originalError: error
        });

        // Rethrow error with detailed message
        return throwError(() => new Error(errorMessage));
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

  createAccountPayment(accountPayment: AccountPayment): Observable<AccountPayment> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    // Validate required fields
    const requiredFields = ['amount', 'agencyName', 'rib'];
    for (const field of requiredFields) {
      if (!accountPayment[field] || accountPayment[field] === null) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    // Set payment date to current date if not provided
    if (!accountPayment.paymentDate) {
      accountPayment.paymentDate = new Date().toISOString();
    }

    return this.http.post<AccountPayment>(`http://localhost:8088/api/v1/account-payments/addaccountpayment`, accountPayment, { headers }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error creating account payment:', {
          status: error.status,
          message: error.message,
          errorBody: error.error
        });
        let errorMessage = `Failed to create account payment`;
        if (error.error instanceof ErrorEvent) {
          errorMessage += ` - Client Error: ${error.error.message}`;
        } else if (error.error && error.error.message) {
          errorMessage += ` - Server Error: ${error.error.message}`;
        }
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  getAccountPaymentsByRib(rib: string): Observable<AccountPayment[]> {
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

    return this.http.get<AccountPayment[]>(`${this.apiUrl}/account-payments/by-rib/${trimmedRib}`, { headers }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error fetching account payments by RIB:', {
          status: error.status,
          message: error.message,
          errorBody: error.error
        });
        let errorMessage = `Failed to retrieve account payments for RIB: ${trimmedRib}`;
        if (error.error instanceof ErrorEvent) {
          errorMessage += ` - Client Error: ${error.error.message}`;
        } else if (error.error && error.error.message) {
          errorMessage += ` - Server Error: ${error.error.message}`;
        }
        return throwError(() => new Error(errorMessage));
      })
    );
  }
}