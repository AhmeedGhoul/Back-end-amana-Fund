import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Sinistres } from './sinistres.model';

@Injectable({
  providedIn: 'root'
})
export class SinistresService {

  private apiUrl = 'http://localhost:8088/api/v1/Sinitre'; // API URL for sinistres

  constructor(private http: HttpClient) { }

  // Get all sinistres (paginated and with search)
  getSinistres(page: number = 0, size: number = 5, claimAmount: number | null = null, settlementDate: string = ''): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (claimAmount !== null) {
      params = params.set('claimAmount', claimAmount.toString());
    }
    if (settlementDate !== '') {
      params = params.set('settlementDate', settlementDate);
    }

    return this.http.get<any>(`${this.apiUrl}/paginated`, { params: params });
  }

  // Add a new sinistre
  addSinistre(newSinistre: Sinistres): Observable<Sinistres> {
    return this.http.post<Sinistres>(`${this.apiUrl}/add`, newSinistre);
  }

  // Update a sinistre
  updateSinistre(id: number, updatedSinistre: Sinistres): Observable<Sinistres> {
    return this.http.put<Sinistres>(`${this.apiUrl}/update`, updatedSinistre);
  }

  // Delete a sinistre
  deleteSinistre(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/remove/${id}`);
  }

  // Get a Sinistre PDF
  getSinistrePdf(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/pdfsinistre/${id}`, {
      responseType: 'blob',
      headers: new HttpHeaders({ 'Accept': 'application/pdf' })
    });
  }

  getSinistresExcelForUserById(userId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/excel/user/${userId}`, {  // Modified URL
      responseType: 'blob',
      headers: new HttpHeaders({ 'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    });
  }

  getIndemnisationFinale(id: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/${id}/indemnisation`);
  }
}
