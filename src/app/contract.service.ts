import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Contract } from './contract.model';
import { Sinistres } from './sinistres.model';

@Injectable({
  providedIn: 'root',
})
export class ContractService {
  private contractApiUrl = 'http://localhost:8088/api/v1/Contract';
  private apiUrl = 'http://localhost:8088/api/v1/Sinitre';

  constructor(private http: HttpClient) {}

  getContracts(): Observable<Contract[]> {
    return this.http.get<Contract[]>(`${this.contractApiUrl}/Reassurance/all`);
  }

  addContract(newContract: Contract): Observable<Contract> {
    return this.http.post<Contract>(
      `${this.contractApiUrl}/addReassurance`,
      newContract
    );
  }

  updateContract(id: number, updatedContract: Contract): Observable<Contract> {
    return this.http.put<Contract>(
      `${this.contractApiUrl}/updateReassurance`,
      updatedContract
    );
  }

  deleteContract(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.contractApiUrl}/removeReassurance/${id}`
    );
  }

  getSinistres(): Observable<Sinistres[]> {
    return this.http.get<Sinistres[]>(`${this.apiUrl}/all`);
  }

  getContractsPaginatedAndSearch(
    page: number,
    size: number,
    idContrat: number | null,
    name: string,
    date: string
  ): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (idContrat !== null) {
      params = params.set('idContrat', idContrat.toString());
    }
    if (name) {
      params = params.set('name', name);
    }
    if (date) {
      params = params.set('date', date);
    }

    return this.http.get<any>(
      `${this.contractApiUrl}/Reassurance/paginated`,
      { params: params }
    );
  }
}
