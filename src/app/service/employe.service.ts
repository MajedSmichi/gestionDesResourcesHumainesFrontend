import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Employe} from "../model/employe.model";

@Injectable({
  providedIn: 'root'
})
export class EmployeService {

  private apiUrl = 'http://localhost:9090/rh/api/employes';

  constructor(private http: HttpClient) { }

  getAllEmploye(): Observable<Employe[]> {
    return this.http.get<Employe[]>(this.apiUrl);
  }
}
