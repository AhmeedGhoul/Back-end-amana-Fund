import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { CreditPool } from '../Models/CreditPool';

@Injectable({
  providedIn: 'root',
})
export class CreditPoolService {
  private apiUrl = 'http://localhost:8088/api/v1/creditpool';

  constructor(private http: HttpClient) {}

  addCreditPool(pool: any): Observable<CreditPool> {
    // Envoyer les données telles quelles sans transformation supplémentaire
    // Utiliser any pour le type de retour pour éviter les erreurs de conversion
    return this.http.post<any>(`${this.apiUrl}/createCreditPool`, pool)
      .pipe(
        map(response => {
          console.log('API response:', response);
          return response;
        })
      );
  }

  retrieveCreditPools(): Observable<CreditPool[]> {
    return this.http.get<any[]>(`${this.apiUrl}/all`)
      .pipe(map(pools => pools.map(pool => CreditPool.fromJson(pool))));
  }

  retrieveCreditPool(id: number): Observable<CreditPool> {
    return this.http.get<any>(`${this.apiUrl}/${id}`)
      .pipe(map(response => CreditPool.fromJson(response)));
  }

  retrieveCreditPoolById(id: number): Observable<CreditPool> {
    // This method is specifically for the search functionality
    return this.http.get<any>(`${this.apiUrl}/${id}`)
      .pipe(
        map(response => {
          if (!response) {
            throw new Error('Credit pool not found');
          }
          return CreditPool.fromJson(response);
        })
      );
  }

  updateCreditPool(creditPool: CreditPool): Observable<CreditPool> {
    const creditPoolForApi = this.convertDatesToStrings(creditPool);
    return this.http.put<any>(`${this.apiUrl}/update`, creditPoolForApi)
      .pipe(map(response => CreditPool.fromJson(response)));
  }

  removeCreditPool(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete/${id}`)
      .pipe(
        map(response => {
          // Si la réponse est vide ou null, renvoyer un objet vide pour éviter les erreurs
          return response || {};
        })
      );
  }

  calculateInterestRatesForPool(creditPoolId: number): Observable<Record<string, number>> {
    return this.http.get<Record<string, number>>(`${this.apiUrl}/${creditPoolId}/interest-rates`);
  }

  /**
   * Convert Date objects to ISO 8601 (yyyy-MM-ddTHH:mm:ss) for Java LocalDateTime
   * Uses the exact field names expected by the Spring Boot backend
   */
  private convertDatesToStrings(creditPool: CreditPool): any {
    const now = new Date();
    
    // Create a new object with the exact field names expected by the backend
    const result = {
      id_credit_pool: creditPool.id_credit_pool,
      maxValue: creditPool.maxValue,
      minValue: creditPool.minValue,
      n_Echeance: creditPool.n_Echeance,
      pool_Sum: creditPool.pool_Sum,
      full: creditPool.full,
      contracts: creditPool.contracts,
      
      // Format dates according to backend's expected format
      open_Date: creditPool.open_Date instanceof Date && !isNaN(creditPool.open_Date.getTime())
        ? creditPool.open_Date.toISOString().slice(0, 19)
        : now.toISOString().slice(0, 19),

      close_Date: creditPool.close_Date instanceof Date && !isNaN(creditPool.close_Date.getTime())
        ? creditPool.close_Date.toISOString().slice(0, 19)
        : new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 19),

      grace_Period: creditPool.grace_Period instanceof Date && !isNaN(creditPool.grace_Period.getTime())
        ? creditPool.grace_Period.toISOString().slice(0, 19)
        : new Date(now.getTime() + 45 * 24 * 60 * 60 * 1000).toISOString().slice(0, 19),

      Period: creditPool.Period instanceof Date && !isNaN(creditPool.Period.getTime())
        ? creditPool.Period.toISOString().slice(0, 19)
        : new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000).toISOString().slice(0, 19),
    };
    
    console.log('Converted credit pool for API:', result);
    return result;
  }
}
