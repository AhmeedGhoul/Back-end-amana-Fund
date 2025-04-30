import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Agency } from './agency.model';

@Injectable({
  providedIn: 'root'
})
export class AgencyService {
  private apiUrl = '/api/v1/Agency'; // Adjust your API endpoint

  constructor(private http: HttpClient) {}

  getAllAgencies(page: number, size: number): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<any>(`${this.apiUrl}`, { params });
  }

  searchAgencies(filters: any, page: number, size: number): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        params = params.set(key, filters[key]);
      }
    });
    return this.http.get<any>(`${this.apiUrl}/search`, { params });
  }

  createAgency(agency: Agency): Observable<Agency> {
    return this.http.post<Agency>(`${this.apiUrl}`, agency);
  }

  updateAgency(agency: Agency): Observable<Agency> {
    return this.http.put<Agency>(`${this.apiUrl}/${agency.id_agency}`, agency);
  }

  deleteAgency(agency: Agency): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${agency.id_agency}`);
  }

  generateAgencyReport(): Observable<any> {
    return this.http.get(`${this.apiUrl}/report`, { responseType: 'blob' });
  }
}
