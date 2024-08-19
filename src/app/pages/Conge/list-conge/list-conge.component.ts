import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DemandeConge } from "../../../core/model/demande-conge.model";
import { DemandeCongeService } from "../../../core/service/demande-conge.service";
import { DemandeCongeStatus } from '../../../core/model/demande-conge-status.enum';
import { User } from "../../../core/model/user.model";
import { Notification } from "../../../core/model/notification.model";
import { EtatNotification } from "../../../core/model/etatNotification.model";
import { NotificationService } from "../../../core/service/notification.service";

@Component({
  selector: 'app-list-conge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-conge.component.html',
  styleUrls: ['./list-conge.component.css']
})
export class ListCongeComponent implements OnInit {
  demandes: DemandeConge[] = [];
  currentUser: User | undefined;

  constructor(
    private demandeCongeService: DemandeCongeService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadDemandes();
  }

  loadDemandes(): void {
    this.demandeCongeService.getDemandesConge().subscribe(data => {
      this.demandes = data.map(demande => {
        demande.user.photo = `http://localhost:9090/rh/uploads/${demande.user.photo}`;
        return demande;
      });
    }, error => {
      console.error('Error fetching demandes conge:', error);
    });
  }

  acceptDemande(demande: DemandeConge): void {
    this.demandeCongeService.acceptDemandeConge(demande.id, DemandeCongeStatus.APPROVED).subscribe(() => {
      console.log('Accepting demande:', demande);
      const notification = this.formatNotification('Leave Request', 'Your leave request is ACCEPTED', demande.user);
      this.createNotification(notification.titre, notification.message, notification.user.id);
      this.loadDemandes();
    });
  }

  refuseDemande(demande: DemandeConge): void {
    this.demandeCongeService.refuseDemandeConge(demande.id, DemandeCongeStatus.REJECTED).subscribe(() => {
      console.log('Refusing demande:', demande);
      const notification = this.formatNotification('Leave Request', 'Your leave request is REJECTED', demande.user);
      this.createNotification(notification.titre, notification.message, notification.user.id);
      this.loadDemandes();
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

  private createNotification(titre: string, message: string, userId: number): void {
    this.notificationService.createNotification(titre, message, userId).subscribe(() => {
      console.log('Notification created for user:', userId);
    }, error => {
      console.error('Error creating notification:', error);
    });
  }
}
