import { Injectable } from '@angular/core';
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {AttestationDeTravail} from "../model/AttestationDeTravail.model";

@Injectable({
  providedIn: 'root'
})
export class AttestationDeTravailService{

  private apiURL = 'http://localhost:9090/rh/attestations-de-travail';
  constructor(private router: Router, private http: HttpClient) {}



  saveAttestationDeTravail(attestation:AttestationDeTravail):Observable<AttestationDeTravail>{
    return this.http.post<AttestationDeTravail>(`${this.apiURL}/save`, attestation);
  }

  getAllAttestationDeTravail():Observable<AttestationDeTravail[]>{
    return this.http.get<AttestationDeTravail[]>(`${this.apiURL}/all`)
  }

  getAllAttestationDeTravailByUserId(id:number):Observable<AttestationDeTravail[]>{
    return this.http.get<AttestationDeTravail[]>(`${this.apiURL}/all/${id}`)
  }

  acceptAttestation(id:number):Observable<AttestationDeTravail>{
    return this.http.put<AttestationDeTravail>(`${this.apiURL}/accept/${id}`,null);
  }

  refuseAttestation(id:number):Observable<AttestationDeTravail>{
    return this.http.put<AttestationDeTravail>(`${this.apiURL}/refuse/${id}`,null);
  }




}
