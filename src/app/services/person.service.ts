import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Person } from '../pages/person/person.model';

@Injectable({
  providedIn: 'root'
})
export class PersonService {
  private apiUrl = 'http://localhost:8088/api/v1/person';

  constructor(private http: HttpClient) { }

  addPerson(person: Person): Observable<any> {
    return this.http.post(`${this.apiUrl}/add_personG`, person);
  }

  addPersonWithFile(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/add-with-file`, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

  getPersonList(): Observable<any> {
    return this.http.get(`${this.apiUrl}/list`);
  }

  deletePerson(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }

  updatePerson(person: Person): Observable<any> {
    return this.http.put(`${this.apiUrl}/update`, person);
  }

  getPersonById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/get/${id}`);
  }

  getPersonByCIN(cin: string): Observable<Person> {
    return this.http.get<Person>(`${this.apiUrl}/search-by-cin?cin=${cin}`);
  }

  getRiskLevel(id: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/${id}/score`);
  }
}
