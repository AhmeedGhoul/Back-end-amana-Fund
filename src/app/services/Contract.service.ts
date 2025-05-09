import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, throwError, catchError, tap } from 'rxjs';
import { Contract } from '@app/models/Contract';

// Define Payment interface if it doesn't exist elsewhere
interface Payment {
  id_payment: number;
  date_payment: Date;
  amount: number;
  status: boolean;
  contract?: { id_Contract: number };
}

@Injectable({
  providedIn: 'root',
})
export class ContractService {
  private baseUrl = 'http://localhost:8088/api/v1/contracts'; // Using proxy configuration
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }
  constructor(private http: HttpClient) {}

  addContract(contract: Contract): Observable<Contract> {
    // Structure the contract to match the Spring Boot entity
    const contractDto: any = {
      // Basic contract properties - set id to null for new contracts
      id_Contract: contract.id_Contract > 0 ? contract.id_Contract : null, // Spring Boot will generate ID for new contracts
      documents: contract.documents || '',
      queue_Number: contract.queue_Number || 0,
      amount: contract.amount || 0,
      payed: contract.payed || 0
    };

    // Handle user reference correctly - Spring Boot expects a user object with just the ID
    if (contract.userId) {
      contractDto.user = {
        id: contract.userId
      };
    } else if (contract.user && contract.user.id) {
      contractDto.user = {
        id: contract.user.id
      };
    } else {
      // Default to user ID 1 if none provided
      contractDto.user = {
        id: 1
      };
    }

    // Handle credit pool reference correctly - Spring Boot expects a creditPool object with just the ID
    if (contract.id_credit_pool) {
      contractDto.creditPool = {
        id_credit_pool: contract.id_credit_pool
      };
    } else if (contract.creditPool && contract.creditPool.id_credit_pool) {
      contractDto.creditPool = {
        id_credit_pool: contract.creditPool.id_credit_pool
      };
    } else {
      // Default to credit pool ID 1 if none provided
      contractDto.creditPool = {
        id_credit_pool: 1
      };
    }

    // Set dates with proper formatting for Java LocalDateTime
    const now = new Date();
    now.setHours(12, 0, 0, 0); // Set to noon to avoid timezone issues

    const futureDate = new Date(now);
    futureDate.setMonth(futureDate.getMonth() + 1);

    // Format dates as expected by Java's LocalDateTime (yyyy-MM-dd'T'HH:mm:ss)
    // The backend expects this exact format for proper parsing
    if (contract.date_Contract instanceof Date && !isNaN(contract.date_Contract.getTime())) {
      contractDto.date_Contract = contract.date_Contract.toISOString().slice(0, 19);
    } else {
      contractDto.date_Contract = now.toISOString().slice(0, 19);
    }

    if (contract.withdrawal_date instanceof Date && !isNaN(contract.withdrawal_date.getTime())) {
      contractDto.withdrawal_date = contract.withdrawal_date.toISOString().slice(0, 19);
    } else {
      contractDto.withdrawal_date = futureDate.toISOString().slice(0, 19);
    }

    // Log the exact structure we're sending
    console.log('Contract DTO structure being sent to backend:', JSON.stringify(contractDto, null, 2));

    console.log('Sending contract to backend:', JSON.stringify(contractDto, null, 2));

    return this.http.post<any>(`${this.baseUrl}/add`, contractDto,{ headers: this.getAuthHeaders() })
      .pipe(
        map(newContract => {
          console.log('Contract created successfully:', newContract);
          return Contract.fromJson(newContract);
        })
      );
  }

  retrieveContracts(): Observable<Contract[]> {
    return this.http.get<any[]>(`${this.baseUrl}/all`,{ headers: this.getAuthHeaders() })
      .pipe(
        map(response => {
          console.log('Raw contract response from backend:', response);

          // Check if the response is an array
          if (Array.isArray(response)) {
            return response.map(contract => {
              console.log('Processing contract:', contract);

              // Ensure date fields are properly formatted before passing to fromJson
              if (contract.date_Contract) {
                try {
                  // If it's already a string, keep it as is
                  if (typeof contract.date_Contract !== 'string') {
                    contract.date_Contract = new Date(contract.date_Contract).toISOString();
                  }
                } catch (e) {
                  console.warn('Error formatting date_Contract:', e);
                }
              }

              if (contract.withdrawal_date) {
                try {
                  // If it's already a string, keep it as is
                  if (typeof contract.withdrawal_date !== 'string') {
                    contract.withdrawal_date = new Date(contract.withdrawal_date).toISOString();
                  }
                } catch (e) {
                  console.warn('Error formatting withdrawal_date:', e);
                }
              }

              return Contract.fromJson(contract);
            });
          } else {
            console.warn('Unexpected response format from contracts API:', response);
            return [];
          }
        })
      );
  }

  retrieveContract(id: number): Observable<Contract> {
    return this.http.get<any>(`${this.baseUrl}/${id}`,{ headers: this.getAuthHeaders() })
      .pipe(
        map(contract => {
          console.log('Retrieved contract by ID:', contract);
          return Contract.fromJson(contract);
        })
      );
  }

  /**
   * Refactors the payment schedule (echeances) for a contract
   * @param contractId The ID of the contract to refactor
   * @returns An observable with the response message
   */
  refactorEcheances(contractId: number): Observable<any> {
    // Use responseType: 'text' to handle string responses from the backend
    return this.http.post(`${this.baseUrl}/refactor/${contractId}`, {}, { responseType: 'text',headers: this.getAuthHeaders() })
      .pipe(
        tap(response => console.log('Refactor response:', response)),
        // Map the text response to an object with a message property
        map(response => ({ message: response })),
        catchError(error => {
          console.error('Error refactoring echeances:', error);
          // Extract the error message if possible
          let errorMessage = 'Failed to refactor payment schedule';
          if (error.error && typeof error.error === 'string') {
            errorMessage = error.error;
          } else if (error.message) {
            errorMessage = error.message;
          }
          return throwError(() => new Error(errorMessage));
        })
      );
  }

  /**
   * Gets the updated payment schedule after refactoring
   * @param contractId The ID of the contract
   * @returns An observable with the updated payment list
   */
  getRefactoredPayments(contractId: number): Observable<Payment[]> {
    return this.http.get<any[]>(`${this.baseUrl}/${contractId}/payments`,{ headers: this.getAuthHeaders() })
      .pipe(
        map(payments => {
          console.log('Retrieved payments for contract:', payments);
          return payments.map(payment => {
            // Convert payment to Payment model
            return {
              id_payment: payment.id_payment,
              date_payment: new Date(payment.date_payment),
              amount: payment.amount,
              status: payment.status,
              contract: payment.contract ? { id_Contract: payment.contract.id_Contract } : null
            } as Payment;
          });
        }),
        catchError(error => {
          console.error('Error retrieving payments:', error);
          return throwError(() => new Error(error.message || 'Failed to retrieve payments'));
        })
      );
  }

  // This method is properly implemented above - removing duplicate

  updateContract(contract: Contract): Observable<Contract> {
    // Make sure we have a valid contract ID
    if (!contract.id_Contract) {
      console.error('Cannot update contract without a valid ID');
      return throwError('Contract ID is required for update operations');
    }

    // Create a properly structured DTO for updating that matches the Spring Boot entity exactly
    const contractDto: any = {
      // Primary key - must be present and valid
      id_Contract: contract.id_Contract,

      // Basic properties
      documents: contract.documents || '',
      queue_Number: contract.queue_Number || 0,
      amount: contract.amount || 0,
      payed: contract.payed || 0
    };

    // Handle user reference correctly - Spring Boot expects a user object with just the ID
    if (contract.userId) {
      contractDto.user = {
        id: contract.userId
      };
    } else if (contract.user && contract.user.id) {
      contractDto.user = {
        id: contract.user.id
      };
    } else {
      // Default to user ID 1 if none provided
      contractDto.user = {
        id: 1
      };
    }

    // Handle credit pool reference correctly - Spring Boot expects a creditPool object with just the ID
    if (contract.id_credit_pool) {
      contractDto.creditPool = {
        id_credit_pool: contract.id_credit_pool
      };
    } else if (contract.creditPool && contract.creditPool.id_credit_pool) {
      contractDto.creditPool = {
        id_credit_pool: contract.creditPool.id_credit_pool
      };
    } else {
      // Default to credit pool ID 1 if none provided
      contractDto.creditPool = {
        id_credit_pool: 1
      };
    }

    // Set dates with proper formatting for Java LocalDateTime
    const now = new Date();
    now.setHours(12, 0, 0, 0); // Set to noon to avoid timezone issues

    const futureDate = new Date(now);
    futureDate.setMonth(futureDate.getMonth() + 1);

    // Format dates as expected by Java's LocalDateTime (yyyy-MM-dd'T'HH:mm:ss)
    if (contract.date_Contract instanceof Date && !isNaN(contract.date_Contract.getTime())) {
      contractDto.date_Contract = contract.date_Contract.toISOString().slice(0, 19);
    } else if (typeof contract.date_Contract === 'string' && contract.date_Contract) {
      try {
        // Try to parse the string date and format it correctly
        const dateObj = new Date(contract.date_Contract);
        if (!isNaN(dateObj.getTime())) {
          contractDto.date_Contract = dateObj.toISOString().slice(0, 19);
        } else {
          contractDto.date_Contract = now.toISOString().slice(0, 19);
        }
      } catch (e) {
        console.warn('Error parsing date_Contract string:', e);
        contractDto.date_Contract = now.toISOString().slice(0, 19);
      }
    } else {
      contractDto.date_Contract = now.toISOString().slice(0, 19);
    }

    if (contract.withdrawal_date instanceof Date && !isNaN(contract.withdrawal_date.getTime())) {
      contractDto.withdrawal_date = contract.withdrawal_date.toISOString().slice(0, 19);
    } else if (typeof contract.withdrawal_date === 'string' && contract.withdrawal_date) {
      try {
        // Try to parse the string date and format it correctly
        const dateObj = new Date(contract.withdrawal_date);
        if (!isNaN(dateObj.getTime())) {
          contractDto.withdrawal_date = dateObj.toISOString().slice(0, 19);
        } else {
          contractDto.withdrawal_date = futureDate.toISOString().slice(0, 19);
        }
      } catch (e) {
        console.warn('Error parsing withdrawal_date string:', e);
        contractDto.withdrawal_date = futureDate.toISOString().slice(0, 19);
      }
    } else {
      contractDto.withdrawal_date = futureDate.toISOString().slice(0, 19);
    }

    console.log('Updating contract with ID:', contract.id_Contract);
    console.log('Update DTO:', JSON.stringify(contractDto, null, 2));

    // Add error handling
    return this.http.put<any>(`${this.baseUrl}/update`, contractDto,{ headers: this.getAuthHeaders() })
      .pipe(
        catchError(error => {
          console.error('Error in update contract request:', error);
          return throwError(error);
        }),
        map(updatedContract => {
          console.log('Update response:', updatedContract);
          return Contract.fromJson(updatedContract);
        })
      );
  }

  removeContract(id: number): Observable<any> {
    // Set responseType to 'text' to handle plain text responses
    return this.http.delete(`${this.baseUrl}/delete/${id}`, { responseType: 'text', headers: this.getAuthHeaders() });
  }
}
