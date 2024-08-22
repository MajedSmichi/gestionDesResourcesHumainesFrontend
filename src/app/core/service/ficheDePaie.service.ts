import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {FicheDePaie} from "../model/FicheDePaie.model";
import {AttestationDeTravail} from "../model/AttestationDeTravail.model";

@Injectable({
  providedIn: 'root'
})
export class FicheDePaieService {
  private apiUrl = 'http://localhost:9090/rh/ficheDePaie';

  constructor(private http: HttpClient) {}

  addFicheDePaie(ficheDePaie: FicheDePaie): Observable<FicheDePaie> {
    return this.http.post<FicheDePaie>(this.apiUrl, ficheDePaie);
  }

  getFicheDePaieByUserId(id:number): Observable<FicheDePaie[]>{
    return this.http.get<FicheDePaie[]>(`${this.apiUrl}/user/${id}`)
  }

  getFicheDePaieById(id: number): Observable<FicheDePaie> {
    return this.http.get<FicheDePaie>(`${this.apiUrl}/${id}`);
  }

  getAllFicheDePaie(): Observable<FicheDePaie[]> {
    return this.http.get<FicheDePaie[]>(this.apiUrl);
  }

  acceptDemand(id: number | undefined):Observable<AttestationDeTravail>{
    return this.http.put<AttestationDeTravail>(`${this.apiUrl}/acceptDemand/${id}`,null);
  }

  refuseDemand(id: number | undefined):Observable<AttestationDeTravail>{
    return this.http.put<AttestationDeTravail>(`${this.apiUrl}/refuseDemand/${id}`,null);
  }
}
