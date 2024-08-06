import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../model/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:9090/rh/api/users';
  private apiUrl1 = 'http://localhost:9090/rh/api/saisie';

  constructor(private http: HttpClient) {}

  getPostes(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/postes`);
  }

  getRoles(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/roles`);
  }

  getFonctions(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/fonctions`);
  }

  createUser(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, formData);
  }

  validateUser(user: User): Observable<any> {
    return this.http.post(`${this.apiUrl1}/validate`, user);
  }

  getAllUser(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/all`);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }

}
