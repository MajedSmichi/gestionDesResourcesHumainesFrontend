// navbar.component.ts
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/service/auth.service';
import { NotificationService } from '../../core/service/notification.service';
import { EtatNotification } from '../../core/model/etatNotification.model';
import {DatePipe, NgForOf} from "@angular/common";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  imports: [
    DatePipe,
    NgForOf
  ],
  standalone: true
})
export class NavbarComponent implements OnInit {
  loggedUserName: string = '';
  userImage: string = '';
  notifications: any[] = [];
  completedNotificationsCount: number = 0;

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.authService.loadToken();
    this.loggedUserName = this.authService.loggedUser;
    this.userImage = this.authService.userImage
      ? `http://localhost:9090/rh/uploads/${this.authService.userImage}`
      : 'default-image-url';

    this.loadNotifications();
  }

  loadNotifications(): void {
    this.notificationService.getAllNotifications().subscribe(
      (data: any[]) => {
        this.notifications = data;
        this.calculateCompletedNotifications();
      },
      (error) => {
        console.error('Error loading notifications:', error);
      }
    );
  }

  calculateCompletedNotifications(): void {
    this.completedNotificationsCount = this.notifications.filter(
      notification => notification.etat === EtatNotification.EN_ATTENTE
    ).length;
  }

  markAllNotificationsAsCompleted(): void {
    this.notificationService.markAllAsCompleted().subscribe(
      () => {
        this.notifications.forEach(notification => {
          notification.etat = EtatNotification.TERMINEE;
        });
        this.calculateCompletedNotifications();
      },
      (error) => {
        console.error('Error marking all notifications as completed:', error);
      }
    );
  }

  onLogout() {
    this.authService.logout();
  }
}
