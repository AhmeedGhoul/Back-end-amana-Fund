import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Police } from '../pages/police/police.model';
import { PaginationParams, PaginatedResponse } from '../pages/police/pagination.model';


@Injectable({
  providedIn: 'root'
})
export class PoliceService {
  private apiUrl = 'http://localhost:8088/api/v1/police';
  private fallbackUrl = 'http://localhost:8080/api/v1/police';  // Fallback URL if main server is down

  constructor(private http: HttpClient) {}

  private handleError(error: any): Observable<never> {
    console.error('API Error:', {
      status: error.status,
      message: error.message || 'Server error',
      error: error.error || null,
      url: error.url
    });

    if (error.status === 0) {
      // Connection refused error
      return throwError(() => new Error('Backend server is not running. Please start the backend server.'));
    }

    if (error.error?.businessErrorDescription) {
      return throwError(() => new Error(error.error.businessErrorDescription));
    }

    return throwError(() => new Error(error.message || 'Server error'));
  }

  getAllPolice(): Observable<Police[]> {
    return this.http.get<Police[]>(`${this.apiUrl}/getall_police`);
  }

  getActivePercentage(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/active-percentage`);
  }

  getTotalActiveAmount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/active-total-amount`);
  }

  getTotalAmount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/total-amount`);
  }


  getPoliceById(id: number): Observable<Police> {
    console.log('Fetching police with ID:', id);
    return this.http.get<Police>(`${this.apiUrl}/get_policeById/${id}`)
      .pipe(
        map((response: any) => ({
          idPolice: response.idPolice,
          active: response.active,
          start: response.start,
          end: response.end,
          amount: response.amount,
          frequency: response.frequency,
          renewalDate: response.renewalDate,
          userId: response.userId
        } as Police)),
        catchError((error) => {
          console.error('Error fetching police:', error);
          return this.handleError(error);
        })
      );
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

  searchPolice(amount: number): Observable<Police[]> {
    return this.http.get<Police[]>(`${this.apiUrl}/search?amount=${amount}`);
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

  addPolice(police: Police): Observable<Police> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post<Police>(`${this.apiUrl}/add_police`, police, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error adding police:', error);
          throw error;
        })
      );
  }

  updatePolice(police: Police): Observable<Police> {
    if (!police || !police.idPolice) {
      throw new Error('Police object and ID are required');
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    console.log(police.userId);
    
    return this.http.put<Police>(`${this.apiUrl}/update_police`, police, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error updating police:', error);
          throw error;
        })
      );
  }
}
