import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Contract } from '../Models/Contract';

@Injectable({
  providedIn: 'root',
})
export class PdfService {
  private baseUrl = 'http://localhost:8088/api/v1/contracts';

  constructor(private http: HttpClient) {}

  /**
   * Generates a PDF for a contract by calling the backend API
   * @param contract The contract to generate a PDF for
   * @returns Observable with PDF data as Blob
   */
  generateContractPdf(contract: Contract): Observable<Blob> {
    // Ensure the contract has the proper structure for the backend
    const contractDto = this.prepareContractForBackend(contract);
    
    // Call the backend API with responseType 'blob' to handle binary data
    return this.http.post(`${this.baseUrl}/generate-pdf`, contractDto, {
      responseType: 'blob'
    });
  }

  /**
   * Prepares the contract object for the backend by ensuring it has the correct structure
   * This is similar to the structure used in ContractService
   */
  private prepareContractForBackend(contract: Contract): any {
    // Structure the contract to match the Spring Boot entity
    const contractDto: any = {
      // Basic contract properties
      id_Contract: contract.id_Contract > 0 ? contract.id_Contract : null,
      documents: contract.documents || '',
      queue_Number: contract.queue_Number || 0,
      amount: contract.amount || 0,
      payed: contract.payed || 0
    };
    
    // Handle user reference correctly
    if (contract.userId) {
      contractDto.user = {
        id: contract.userId
      };
    } else if (contract.user && contract.user.id) {
      contractDto.user = {
        id: contract.user.id
      };
    }
    
    // Handle credit pool reference correctly
    if (contract.id_credit_pool) {
      contractDto.creditPool = {
        id_credit_pool: contract.id_credit_pool
      };
    } else if (contract.creditPool && contract.creditPool.id_credit_pool) {
      contractDto.creditPool = {
        id_credit_pool: contract.creditPool.id_credit_pool
      };
    }
    
    // Format dates properly for Java LocalDateTime
    if (contract.date_Contract instanceof Date && !isNaN(contract.date_Contract.getTime())) {
      contractDto.date_Contract = contract.date_Contract.toISOString().slice(0, 19);
    } else if (typeof contract.date_Contract === 'string' && contract.date_Contract) {
      try {
        const dateObj = new Date(contract.date_Contract);
        if (!isNaN(dateObj.getTime())) {
          contractDto.date_Contract = dateObj.toISOString().slice(0, 19);
        }
      } catch (e) {
        console.warn('Error parsing date_Contract string:', e);
      }
    }
    
    if (contract.withdrawal_date instanceof Date && !isNaN(contract.withdrawal_date.getTime())) {
      contractDto.withdrawal_date = contract.withdrawal_date.toISOString().slice(0, 19);
    } else if (typeof contract.withdrawal_date === 'string' && contract.withdrawal_date) {
      try {
        const dateObj = new Date(contract.withdrawal_date);
        if (!isNaN(dateObj.getTime())) {
          contractDto.withdrawal_date = dateObj.toISOString().slice(0, 19);
        }
      } catch (e) {
        console.warn('Error parsing withdrawal_date string:', e);
      }
    }
    
    return contractDto;
  }
}
