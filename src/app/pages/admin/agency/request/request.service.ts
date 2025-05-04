import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Request } from './request.model';

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  private apiUrl = '/api/v1/Request'; // Adjust your API endpoint

  constructor(private http: HttpClient) {}

  getAllRequests(page: number, size: number): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<any>(`${this.apiUrl}/getall_request`, { params });
  }

  searchRequests(filters: any, page: number, size: number): Observable<any> {
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

  createRequest(request: Request): Observable<Request> {
    return this.http.post<Request>(`${this.apiUrl}/add_request`, request);  // Ensure correct API endpoint
  }

  updateRequest(request: Request): Observable<Request> {
    return this.http.put<Request>(`${this.apiUrl}/update_request`, request);
  }

  deleteRequest(request: Request): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/remove_request/${request.id_request}`);
  }

  generateRequestReport(): Observable<any> {
    return this.http.get(`${this.apiUrl}/generate-pdf`, { responseType: 'blob' });
  }
}
