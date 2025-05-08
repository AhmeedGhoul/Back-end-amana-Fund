import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Person } from '../pages/person/person.model';

@Injectable({
  providedIn: 'root'
})
export class PersonService {
  private apiUrl = 'http://localhost:8088/api/v1/person';

  constructor(private http: HttpClient) {}

  addPerson(person: Person): Observable<Person> {
    return this.http.post<Person>(`${this.apiUrl}/add_personG`, person);
  }

  getPersonById(id: number): Observable<Person> {
    return this.http.get<Person>(`${this.apiUrl}/${id}`);
  }

  updatePerson(id: number, person: Person): Observable<Person> {
    return this.http.put<Person>(`${this.apiUrl}/update_person/${id}`, person);
  }

  deletePerson(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/remove_person/${id}`);
  }

  getPersonByCIN(cin: string): Observable<Person> {
    return this.http.get<Person>(`${this.apiUrl}/search-by-cin?cin=${cin}`);
  }

  getRiskLevel(id: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/${id}/score`);
  }
}
