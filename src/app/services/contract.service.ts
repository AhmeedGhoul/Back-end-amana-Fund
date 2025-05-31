import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Contract } from '../models/contract.model';
import { environment } from '@environments/environment';
import { Page } from '../models/page.model';

@Injectable({
  providedIn: 'root'
})
export class ContractService {
  private apiUrl = `${environment.apiUrl}/api/contrats`;

  constructor(private http: HttpClient) {}

  /**
   * Get paginated list of contracts with optional search filters
   */
  getContracts(params: any): Observable<Page<Contract>> {
    let httpParams = new HttpParams()
      .set('page', params.page || 0)
      .set('size', params.size || 10);

    // Add optional search parameters
    if (params.idContrat) {
      httpParams = httpParams.set('idContrat', params.idContrat);
    }
    if (params.name) {
      httpParams = httpParams.set('name', params.name);
    }
    if (params.date) {
      httpParams = httpParams.set('date', params.date);
    }
    if (params.sort) {
      httpParams = httpParams.set('sort', params.sort);
    }

    return this.http.get<Page<Contract>>(this.apiUrl, { params: httpParams });
  }

  /**
   * Get a single contract by ID
   */
  getContractById(id: number): Observable<Contract> {
    return this.http.get<Contract>(`${this.apiUrl}/${id}`);
  }

  /**
   * Create a new contract
   */
  addContract(contract: Partial<Contract>): Observable<Contract> {
    return this.http.post<Contract>(this.apiUrl, contract);
  }

  /**
   * Update an existing contract
   */
  updateContract(id: number, contract: Partial<Contract>): Observable<Contract> {
    return this.http.put<Contract>(`${this.apiUrl}/${id}`, contract);
  }

  /**
   * Delete a contract
   */
  deleteContract(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Get contracts with pagination and search
   * @deprecated Use getContracts with params instead
   */
  getContractsPaginatedAndSearch(
    page: number = 0,
    size: number = 10,
    idContrat?: number | null,
    name?: string,
    date?: string
  ): Observable<Page<Contract>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (idContrat) {
      params = params.set('idContrat', idContrat.toString());
    }
    if (name) {
      params = params.set('name', name);
    }
    if (date) {
      params = params.set('date', date);
    }

    return this.http.get<Page<Contract>>(this.apiUrl, { params });
  }

  /**
   * Get statistics for contracts
   */
  getContractStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/stats`);
  }
}
