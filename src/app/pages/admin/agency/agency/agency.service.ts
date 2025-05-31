import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Agency } from './agency.model';

export interface ApiResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

@Injectable({
  providedIn: 'root'
})
export class AgencyService {
  /** Base API URL for agency endpoints */
  private readonly apiUrl = '/api/v1/Agency';

  constructor(private http: HttpClient) {}

  /**
   * Get all agencies with pagination
   * @param page Page number (0-based)
   * @param size Number of items per page
   * @returns Observable with paginated agencies
   */
  getAllAgencies(page: number = 0, size: number = 10): Observable<ApiResponse<Agency>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
      
    return this.http.get<ApiResponse<Agency>>(`${this.apiUrl}/getall_agency`, { params })
      .pipe(
        catchError(this.handleError<ApiResponse<Agency>>('getAllAgencies', {
          content: [],
          totalElements: 0,
          totalPages: 0,
          size: 0,
          number: 0
        }))
      );
  }

  /**
   * Search agencies with filters and pagination
   * @param filters Object containing search filters
   * @param page Page number (0-based)
   * @param size Number of items per page
   * @returns Observable with paginated search results
   */
  searchAgencies(filters: Partial<Agency>, page: number = 0, size: number = 10): Observable<ApiResponse<Agency>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    // Add non-empty filter values to params
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        params = params.set(key, value.toString());
      }
    });
    
    return this.http.get<ApiResponse<Agency>>(`${this.apiUrl}/search`, { params })
      .pipe(
        catchError(this.handleError<ApiResponse<Agency>>('searchAgencies', {
          content: [],
          totalElements: 0,
          totalPages: 0,
          size: 0,
          number: 0
        }))
      );
  }

  /**
   * Create a new agency
   * @param agency Agency data to create
   * @returns Observable with created agency
   */
  createAgency(agency: Omit<Agency, 'id_agency'>): Observable<Agency> {
    return this.http.post<Agency>(`${this.apiUrl}/add_agency`, agency)
      .pipe(
        catchError(this.handleError<Agency>('createAgency'))
      );
  }

  /**
   * Update an existing agency
   * @param agency Agency data to update
   * @returns Observable with updated agency
   */
  updateAgency(agency: Agency): Observable<Agency> {
    if (!agency.id_agency) {
      return throwError(() => new Error('Agency ID is required for update'));
    }
    return this.http.put<Agency>(`${this.apiUrl}/update_agency`, agency)
      .pipe(
        catchError(this.handleError<Agency>('updateAgency'))
      );
  }

  /**
   * Delete an agency by ID
   * @param agency Agency to delete
   * @returns Observable that completes when deletion is successful
   */
  deleteAgency(agency: Pick<Agency, 'id_agency'>): Observable<void> {
    if (!agency.id_agency) {
      return throwError(() => new Error('Agency ID is required for deletion'));
    }
    return this.http.delete<void>(`${this.apiUrl}/remove_agency/${agency.id_agency}`)
      .pipe(
        catchError(this.handleError<void>('deleteAgency'))
      );
  }

  /**
   * Generate a report of all agencies
   * @returns Observable with Blob containing the report
   */
  generateAgencyReport(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/report`, { responseType: 'blob' })
      .pipe(
        catchError(this.handleError<Blob>('generateAgencyReport', new Blob()))
      );
  }

  /**
   * Handle HTTP operations that failed
   * @param operation Name of the operation that failed
   * @param result Optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: HttpErrorResponse): Observable<T> => {
      console.error(`${operation} failed:`, error);
      
      // You can transform the error into a user-friendly message
      let errorMessage = 'An error occurred';
      if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = `Error: ${error.error.message}`;
      } else {
        // Server-side error
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      }
      
      // Log the detailed error to the console
      console.error(errorMessage);
      
      // Return an observable with a user-facing error message
      return throwError(() => new Error(errorMessage));
    };
  }
}
