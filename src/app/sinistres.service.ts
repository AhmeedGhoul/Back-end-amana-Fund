import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Sinistres } from './sinistres.model';
import { User } from './pages/admin/user/user.model';
@Injectable({
  providedIn: 'root'
})
export class SinistresService {
  private apiUrl = 'api/v1/Sinitre';
  private usersApiUrl = 'api/v1/auth/users';// API URL for sinistres

  constructor(private http: HttpClient) { }

  // Helper method to get headers with Authorization token
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // Get all sinistres (paginated and with search)
  getSinistres(page: number = 0, size: number = 5, claimAmount: number | null = null, settlementDate: string = ''): Observable<Sinistres[]> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (claimAmount !== null) {
      params = params.set('claimAmount', claimAmount.toString());
    }
    if (settlementDate !== '') {
      params = params.set('settlementDate', settlementDate);
    }

    return this.http.get<Sinistres[]>(`${this.apiUrl}/paginated`, { params: params, headers: this.getHeaders() });
  }

  // Add a new sinistre
  addSinistre(newSinistre: Sinistres): Observable<Sinistres> {
    return this.http.post<Sinistres>(`${this.apiUrl}/add`, newSinistre, { headers: this.getHeaders() });
  }

  // Update a sinistre
  updateSinistre(id: number, updatedSinistre: Sinistres): Observable<Sinistres> {
    return this.http.put<Sinistres>(`${this.apiUrl}/update`, updatedSinistre, { headers: this.getHeaders() });
  }

  // Delete a sinistre
  deleteSinistre(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/remove/${id}`, { headers: this.getHeaders() });
  }

  // Get a Sinistre PDF
  getSinistrePdf(id: number): Observable<Blob> {
    return this.http.get<Blob>(`${this.apiUrl}/pdfsinistre/${id}`, {
      responseType: 'blob' as 'json',
      headers: this.getHeaders()
    });
  }

  // Get Sinistres Excel for User
  getSinistresExcelForUserById(userId: number): Observable<Blob> {
    return this.http.get<Blob>(`${this.apiUrl}/excel/user/${userId}`, {
      responseType: 'blob' as 'json',
      headers: this.getHeaders()
    });
  }

  // Get Indemnisation Final
  getIndemnisationFinale(id: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/${id}/indemnisation`, { headers: this.getHeaders() });
  }

  // Get Sinistres by User ID
  getSinistresByUserId(userId: number): Observable<Sinistres[]> {
    return this.http.get<Sinistres[]>(`${this.apiUrl}/user/${userId}`, { headers: this.getHeaders() });
  }
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.usersApiUrl, { headers: this.getHeaders() });
  }
  getFondsDeReserve(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/fonds-reserve`, { headers: this.getHeaders() }); // Fixed template string
  }

  // Evaluate Risk
  evaluerRisque(userId: number): Observable<string> {
    return this.http.get<string>(`${this.apiUrl}/evaluer-risque/${userId}`, { headers: this.getHeaders(), responseType: 'text' as 'json' });
  }



}
