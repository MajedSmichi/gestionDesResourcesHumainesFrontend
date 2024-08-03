import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {User} from "../model/user.model";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:9090/rh/api/users/employes';

  constructor(private http: HttpClient) { }

  getAllEmployes(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }
}
