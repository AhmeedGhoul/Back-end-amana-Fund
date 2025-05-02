import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import { AppNotification } from './Notification.model';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private apiUrl = '/api/v1/notification';

  constructor(private http: HttpClient) {}

  getUnseen(): Observable<AppNotification[]> {
    return this.http.get<AppNotification[]>(`${this.apiUrl}/unseen`);
  }

  markAsSeen(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/seen/${id}`, {});
  }
}
