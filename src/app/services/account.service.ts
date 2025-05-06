import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';

export interface PaymentStatisticsDTO {
  period: string;
  totalAmount: number;
}

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
  private paymentapiUrl = 'http://localhost:8088/api/v1/account-payments';
  private userApiUrl = 'http://localhost:8088/api/v1/User';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  getPaymentStatistics(rib: string, periodType: string = 'monthly'): Observable<PaymentStatisticsDTO[]> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    const params = new HttpParams()
      .set('rib', rib)
      .set('periodType', periodType);
    return this.http.get<PaymentStatisticsDTO[]>(`${this.paymentapiUrl}/payment-statistics`, { headers, params });
  }

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
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<Account[]>(`${this.apiUrl}/by-rib/${rib}`, { headers }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error fetching accounts by RIB:', error);
        return throwError(() => new Error('Failed to fetch accounts by RIB'));
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
    const requiredAccountUpdateFields = ['id', 'rib'];
    const missingUpdateFields = requiredAccountUpdateFields.filter(field => 
      !accountToUpdate[field] || accountToUpdate[field] === null
    );

    if (missingUpdateFields.length > 0) {
      console.error('Missing required fields:', missingUpdateFields);
      return throwError(() => new Error(`Missing required fields: ${missingUpdateFields.join(', ')}`));
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

    // Use the RIB in the URL for update
    const updateUrl = `${this.apiUrl}/updateaccount/${filteredAccount.rib}`;

    return this.http.put<Account>(updateUrl, filteredAccount, { headers }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Detailed Account Update Error:', {
          status: error.status,
          statusText: error.statusText,
          message: error.message,
          errorBody: error.error,
        });
        return throwError(() => new Error(`Failed to update account: ${error.message}`));
      })
    );
  }

  createAccount(account: Account): Observable<Account> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    // Validate required fields
    const requiredFields = ['accountType', 'clientEmail'];
    let missingFields = requiredFields.filter(field => 
      !account.hasOwnProperty(field) || account[field as keyof Account] === null
    );

    if (missingFields.length > 0) {
      return throwError(() => new Error(`Missing required fields: ${missingFields.join(', ')}`));
    }

    // Set default values for optional fields
    const accountToCreate = {
      ...account,
      date_Opening: account.date_Opening || new Date().toISOString(),
      amount: account.amount || 0,
      interestRate: account.interestRate || 0,
      eligibleForZakat: account.eligibleForZakat || false
    };

    return this.http.post<Account>(`${this.apiUrl}/addaccount`, accountToCreate, { headers }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error creating account:', {
          status: error.status,
          message: error.message,
          errorBody: error.error
        });
        let errorMessage = `Failed to create account`;
        if (error.error instanceof ErrorEvent) {
          errorMessage += ` - Client Error: ${error.error.message}`;
        } else if (error.error && error.error.message) {
          errorMessage += ` - Server Error: ${error.error.message}`;
        }
        return throwError(() => new Error(errorMessage));
      })
    );
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

    return this.http.get<AccountPayment[]>(`${this.paymentapiUrl}/by-rib/${trimmedRib}`, { 
      headers,
      observe: 'response'  // Get full response to inspect headers and status
    }).pipe(
      map(response => {
        // Log successful response details
        console.log('Account Payments Response:', {
          status: response.status,
          headers: response.headers.keys(),
          body: response.body
        });
        
        // Ensure non-null AccountPayment array is returned
        if (!response.body) {
          console.warn('No account payments data returned');
          return [];  // Return empty array instead of throwing an error
        }
        return response.body;
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Error fetching account payments:', {
          status: error.status,
          message: error.message,
          errorBody: error.error
        });
        let errorMessage = `Failed to fetch account payments`;
        if (error.error instanceof ErrorEvent) {
          errorMessage += ` - Client Error: ${error.error.message}`;
        } else if (error.error && error.error.message) {
          errorMessage += ` - Server Error: ${error.error.message}`;
        }
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  deleteAccount(accountId: number): Observable<boolean> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.delete<boolean>(`${this.apiUrl}/${accountId}`, { headers }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error deleting account:', {
          status: error.status,
          message: error.message,
          errorBody: error.error
        });
        return throwError(() => error);
      })
    );
  }
}