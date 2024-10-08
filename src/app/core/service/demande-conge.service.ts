import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { DemandeConge } from '../model/demande-conge.model';
import { DemandeCongeStatus } from '../model/demande-conge-status.enum';

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

  getApprovedDemandesConge(): Observable<DemandeConge[]> {
    return this.getDemandesConge().pipe(
      map(demandes => demandes.filter(demande => demande.status === DemandeCongeStatus.APPROVED))
    );
  }

  refuseDemandeConge(id: number | undefined, status: DemandeCongeStatus): Observable<DemandeConge> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { status };
    return this.http.put<DemandeConge>(`${this.apiUrl}/refuseDemandeConge/${id}`, body, { headers }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error updating demande conge status:', error);
        return throwError(() => new Error('Erreur lors de la mise à jour du statut de la demande de congé'));
      })
    );
  }

  acceptDemandeConge(id: number | undefined, status: DemandeCongeStatus): Observable<DemandeConge> {
    const body = { status };
    return this.http.put<DemandeConge>(`${this.apiUrl}/acceptDemandeConge/${id}`, body).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error updating demande conge status:', error);
        return throwError(() => new Error('Erreur lors de la mise à jour du statut de la demande de congé'));
      })
    );
  }

  validateDemandeConge(demande: DemandeConge, userId: number | undefined): Observable<DemandeConge> {
    return this.http.post<DemandeConge>(`${this.apiUrl}/validate?userId=${userId}`, demande).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error validating demande conge:', error);
        return throwError(() => error.error);
      })
    );
  }

  getDemandeCongeByUserId(id: number | undefined): Observable<DemandeConge[]> {
    return this.http.get<DemandeConge[]>(`${this.apiUrl}/user/${id}`);
  }
}
