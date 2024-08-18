// notification.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EtatNotification } from "../model/etatNotification.model";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private baseUrl = 'http://localhost:9090/rh/notifications';

  constructor(private http: HttpClient) { }

  createNotification(titre: string, message: string, userId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/create`, { titre, message, userId });
  }

  changeNotificationState(id: number, newEtat: EtatNotification): Observable<any> {
    return this.http.put(`${this.baseUrl}/changeEtat/${id}?newEtat=${newEtat}`, {});
  }

  getAllNotifications(): Observable<any> {
    return this.http.get(`${this.baseUrl}/all`);
  }

  markAllAsCompleted(): Observable<any> {
    return this.http.put(`${this.baseUrl}/markAllAsCompleted`, {}, { responseType: 'text' });
  }

}
