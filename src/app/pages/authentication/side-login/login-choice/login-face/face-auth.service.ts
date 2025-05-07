import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, tap} from 'rxjs';
import { AuthResponse } from '../auth.model';

@Injectable({
  providedIn: 'root'
})
export class FaceAuthService {
  private faceApi = '/api/v1/face-auth/login';
  private registerUrl = '/api/v1/face-auth/register';

  constructor(private http: HttpClient) {}

  loginWithFace(imageFormData: FormData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.faceApi, imageFormData).pipe(
      tap(response =>{
        localStorage.setItem('authToken', response.token);
      })
    );
  }
  registerFace(imageFormData: FormData): Observable<any> {
    return this.http.post(this.registerUrl, imageFormData, { responseType: 'text' });
  }
}
