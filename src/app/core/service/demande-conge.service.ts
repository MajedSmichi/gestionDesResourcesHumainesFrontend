import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DemandeConge } from '../model/demande-conge.model';

@Injectable({
  providedIn: 'root'
})
export class DemandeCongeService {
  private apiUrl = 'http://localhost:9090/rh/demandes-conge';

  constructor(private http: HttpClient) {}



  saveDemandeConge(demande: DemandeConge): Observable<DemandeConge> {
    return this.http.post<DemandeConge>(`${this.apiUrl}/save`, demande);
  }


  getDemandesConge(): Observable<DemandeConge[]> {
    return this.http.get<DemandeConge[]>(`${this.apiUrl}/all`);
  }

}
