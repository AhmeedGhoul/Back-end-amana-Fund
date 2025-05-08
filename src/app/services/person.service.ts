import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Person } from '../pages/person/person.model';

// Define PersonDTO interface
interface PersonDTO {
  idGarantie?: number | null;
  name: string;
  lastName: string;
  cin: string;
  email: string;
  age: number;
  revenue: number;
  active: boolean;
  documents: string;
  policeId: number;
  filePath: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class PersonService {
  private apiUrl = 'http://localhost:8088/api/v1/person';

  constructor(private http: HttpClient) { }

  addPerson(personDTO: PersonDTO): Observable<any> {
    return this.http.post(`${this.apiUrl}/add_personG`, personDTO);
  }

  addPersonWithFile(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/add_personG_with_file`, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

  getPaginatedPersons(page: number, size: number, sortBy: string, direction: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/paginated`, {
      params: {
        page: page.toString(),
        size: size.toString(),
        sortBy,
        direction
      }
    });
  }

  getPersonList(): Observable<any> {
    return this.http.get(`${this.apiUrl}/list`);
  }

  deletePerson(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/remove_person/${id}`);
  }

  deactivatePerson(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/deactivate`, {});
  }

  updatePerson(person: Person): Observable<any> {
    // Convert Person to PersonDTO format
    const personDTO = {
      idGarantie: person.idGarantie,
      name: person.name,
      lastName: person.lastName,
      cin: person.cin,
      email: person.email,
      age: person.age,
      revenue: person.revenue,
      active: person.active,
      documents: person.documents,
      policeId: person.policeId
    };
    
    return this.http.put(`${this.apiUrl}/update_person`, personDTO);
  }

  searchPersonByCIN(cin: string): Observable<Person[]> {
    return this.http.get<Person[]>(`${this.apiUrl}/search-by-cin?cin=${cin}`).pipe(
      catchError(error => {
        console.error('Search error:', error);
        if (error.status === 500) {
          // Handle the case where no person is found
          return of([]);
        }
        throw error;
      })
    );
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
