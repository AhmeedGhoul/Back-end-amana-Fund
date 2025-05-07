import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import { AppNotification } from './Notification.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private apiUrl = '/api/v1/notification';

  constructor(private http: HttpClient,private snackBar: MatSnackBar) {}
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }
  getUnseen(): Observable<AppNotification[]> {
    return this.http.get<AppNotification[]>(`${this.apiUrl}/unseen`, { headers: this.getAuthHeaders() });
  }

  markAsSeen(id: number): Observable<void> {

    return this.http.put<void>(`${this.apiUrl}/seen/${id}`, { headers: this.getAuthHeaders() });
  }
  showNotification(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 5000, // Duration the notification stays visible
      horizontalPosition: 'right', // Position horizontally (left or right)
      verticalPosition: 'bottom', // Position vertically (top or bottom)
      panelClass: ['custom-notification'], // Custom CSS class for styling
    });
  }
}
