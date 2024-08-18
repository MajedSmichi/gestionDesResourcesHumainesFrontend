import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { DemandeConge } from '../../../core/model/demande-conge.model';
import { DemandeCongeService } from '../../../core/service/demande-conge.service';
import { AuthService } from '../../../core/service/auth.service';
import { User } from '../../../core/model/user.model';
import { Router } from '@angular/router';
import { NotificationService } from '../../../core/service/notification.service';
import { Notification } from '../../../core/model/notification.model';
import {EtatNotification} from "../../../core/model/etatNotification.model";

@Component({
  selector: 'app-demande-conge',
  templateUrl: './demande-conge.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrls: ['./demande-conge.component.css']
})
export class DemandeCongeComponent implements OnInit {
  newDemande: DemandeConge = new DemandeConge();
  minDate: string | undefined;
  currentUser: User | undefined;
  errors: any = {};
  successMessage: string = '';
  demandes: DemandeConge[] = [];

  constructor(
    private demandeCongeService: DemandeCongeService,
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.setMinDate();
    this.setCurrentUser();
    this.setDefaultDates();
    this.loadDemandesUser();
  }

  setMinDate(): void {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
  }

  setCurrentUser(): void {
    this.currentUser = this.authService.getCurrentUserFromToken();
  }

  setDefaultDates(): void {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    this.newDemande.dateDebut = formattedDate;
    this.newDemande.dateFin = formattedDate;
  }

  onDateChange(field: string, event: Event): void {
    const input = event.target as HTMLInputElement;
    console.log(`${field} selected:`, input.value);
  }

  clearError(field: string): void {
    this.errors[field] = null;
  }

  onSubmit(): void {
    this.errors = {}; // Reset errors before submitting

    this.demandeCongeService.validateDemandeConge(this.newDemande, this.currentUser?.id).subscribe(
      () => {
        if (this.currentUser) {
          this.newDemande.user = this.currentUser;
          this.demandeCongeService.saveDemandeConge(this.formatDemande(this.newDemande)).subscribe(() => {
            this.loadDemandesUser();
            this.successMessage = 'Demand added successfully';
            this.newDemande = new DemandeConge();
            this.createNotification();
            setTimeout(() => {
              this.successMessage = '';
            }, 3000);
          });
        }
      },
      (error: any) => {
        console.log('Received error response:', error); // Log error response
        this.errors = error || {};
        console.log('Processed errors:', this.errors);
      }
    );
  }

  private formatDemande(demande: DemandeConge): DemandeConge {
    if (demande.user && demande.user.roles) {
      demande.user.roles = demande.user.roles.map((role: any) => ({
        ...role,
        roleType: role.roleType.toString() // Ensure roleType is a string
      }));
    }
    if (demande.user && demande.user.fonctions) {
      demande.user.fonctions = demande.user.fonctions.map((fonction: any) => ({
        ...fonction,
        fonctionType: fonction.fonctionType.toString() // Ensure fonctionType is a string
      }));
    }
    return demande;
  }

  private formatNotification(titre: string, message: string, user: User): Notification {
    const notification: Notification = {
      id: 0, // Placeholder, will be set by the backend
      titre,
      message,
      dateHeure: new Date(),
      etat: EtatNotification.EN_ATTENTE, // Default state
      user
    };

    if (notification.user.roles) {
      notification.user.roles = notification.user.roles.map((role: any) => ({
        ...role,
        roleType: role.roleType.toString() // Ensure roleType is a string
      }));
    }
    if (notification.user.fonctions) {
      notification.user.fonctions = notification.user.fonctions.map((fonction: any) => ({
        ...fonction,
        fonctionType: fonction.fonctionType.toString() // Ensure fonctionType is a string
      }));
    }
    return notification;
  }

  private createNotification(): void {
    if (this.currentUser) {
      const titre = 'Leave Request';
      const message = `Leave request has been submitted successfully by ${this.currentUser.nom} ${this.currentUser.prenom}.`;

      const notification = this.formatNotification(titre, message, this.currentUser);
      this.notificationService.createNotification(notification.titre, notification.message, notification.user.id).subscribe();
    }
  }

  loadDemandesUser(): void {
    this.demandeCongeService.getDemandeCongeByUserId(this.authService.getCurrentUserFromToken().id).subscribe((data) => {
      this.demandes = data.map((demande: DemandeConge) => {
        if (demande.user) {
          demande.user.photo = `http://localhost:9090/rh/uploads/${demande.user.photo}`;
        }
        return demande;
      });
    }, error => {
      console.error('Error fetching demandes conge:', error);
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'APPROVED':
        return 'text-success';
      case 'REJECTED':
        return 'text-danger';
      case 'PENDING':
        return 'text-primary';
      default:
        return '';
    }
  }
}
