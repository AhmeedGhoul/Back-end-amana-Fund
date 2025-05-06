import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Police } from '../pages/police/police.model';

@Injectable({
  providedIn: 'root'
})
export class PoliceService {
  private apiUrl = 'http://localhost:8088/api/v1/police';

  constructor(private http: HttpClient) {}

  getAllPolice(): Observable<Police[]> {
    return this.http.get<Police[]>(`${this.apiUrl}/getall_police`);
  }

  getPaginatedPolice(page: number = 0, size: number = 5, sortBy: string = 'start', direction: string = 'asc'):
    Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('direction', direction);

    return this.http.get(`${this.apiUrl}/paginated`, { params });
  }

  searchPolice(params: { start?: Date; amount?: number; id?: number; }): Observable<any> {
    const httpParams = new HttpParams()
      .set('start', params.start?.toISOString() || '')
      .set('amount', params.amount?.toString() || '')
      .set('id', params.id?.toString() || '');

    return this.http.get(`${this.apiUrl}/search`, { params: httpParams });
  }

  removePolice(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/removepolice/${id}`);
  }

  generatePDF(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/contract`, {
      responseType: 'blob'
    });
  }

  deactivatePolice(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/deactivate`, {});
  }
}
