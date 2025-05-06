import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Police } from '../pages/police/police.model';
import { PaginationParams, PaginatedResponse } from '../pages/police/pagination.model';

@Injectable({
  providedIn: 'root'
})
export class PoliceService {
  private apiUrl = 'http://localhost:8088/api/v1/police';

  constructor(private http: HttpClient) {}

  getAllPolice(): Observable<Police[]> {
    return this.http.get<Police[]>(`${this.apiUrl}/getall_police`);
  }

  getPaginatedPolice(params: PaginationParams): Observable<PaginatedResponse<Police>> {
    const { page, size, sortBy, direction } = params;
    
    // Validate sort field
    if (!['start', 'end'].includes(sortBy)) {
      throw new Error('Invalid sort field. Choose between "start" or "end".');
    }

    const paramsObj = {
      page: page.toString(),
      size: size.toString(),
      sortBy,
      direction
    };

    return this.http.get<PaginatedResponse<Police>>(`${this.apiUrl}/paginated`, { params: paramsObj });
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
