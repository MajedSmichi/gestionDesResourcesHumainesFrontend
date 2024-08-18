import { Component, OnInit } from '@angular/core';
import { AttestationDeTravail } from '../../../core/model/AttestationDeTravail.model';
import { DemandeCongeStatus } from '../../../core/model/demande-conge-status.enum';
import { FormsModule } from '@angular/forms';
import { DatePipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { AttestationDeTravailService } from '../../../core/service/attestationDeTravail.service';
import { User } from '../../../core/model/user.model';
import { AuthService } from '../../../core/service/auth.service';
import {Notification} from "../../../core/model/notification.model";
import {EtatNotification} from "../../../core/model/etatNotification.model";
import {NotificationService} from "../../../core/service/notification.service";

@Component({
  selector: 'app-attestation-de-travail',
  templateUrl: './attestation-de-travail.component.html',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    NgIf,
    DatePipe,
    NgClass
  ],
  styleUrls: ['./attestation-de-travail.component.css']
})
export class AttestationDeTravailFormComponent implements OnInit {
  currentUser: User | undefined;
  minDate: string | undefined;
  attestation: AttestationDeTravail = new AttestationDeTravail();
  raisonError: string | null = null;
  demandes: AttestationDeTravail[] = [];

  ngOnInit(): void {
    this.setDefaultDates();
    this.setMinDate();
    this.setCurrentUser();
    this.loadUserAttestationDeTravail();
  }

  constructor(private attestationDeTravailService: AttestationDeTravailService, private authService: AuthService,private notificationService: NotificationService) {}

  setMinDate(): void {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
  }

  setCurrentUser(): void {
    this.currentUser = this.authService.getCurrentUserFromToken();
  }

  onDateChange(field: string, event: Event): void {
    const input = event.target as HTMLInputElement;
    console.log(`${field} selected:`, input.value);
  }

  onRaisonFocus(): void {
    this.raisonError = null;
  }

  onSubmit(): void {
    if (!this.attestation.raison) {
      this.raisonError = 'Raison is required';
      return;
    }

    if (this.currentUser) {
      this.attestation.user = this.currentUser;
    }
    this.attestation.dateTraitement = null;
    this.attestation.statut = DemandeCongeStatus.PENDING;
    this.attestationDeTravailService.saveAttestationDeTravail(this.formatAttestation(this.attestation)).subscribe(() => {
      this.attestation = new AttestationDeTravail();
      this.loadUserAttestationDeTravail();
      this.createNotification();
    });
  }

  setDefaultDates(): void {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    this.attestation.dateDemande = formattedDate;
  }

  loadUserAttestationDeTravail(): void {
    this.attestationDeTravailService.getAllAttestationDeTravailByUserId(this.authService.getCurrentUserFromToken().id).subscribe(
      (data) => {
        this.demandes = data.map((demande: AttestationDeTravail) => {
          if (demande.user) {
            demande.user.photo = `http://localhost:9090/rh/uploads/${demande.user.photo}`;
          }
          // Convert dateDemande to a valid format
          demande.dateDemande = this.convertToValidDateFormat(demande.dateDemande);
          return demande;
        });
      }, error => {
        console.error('Error fetching demandes conge:', error);
      });
  }

  convertToValidDateFormat(dateString: Date | string): string {
    if (typeof dateString === "string") {
      const [day, month, year] = dateString.split('/');
      return `${year}-${month}-${day}`;
    }
    return dateString.toString();
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
      const titre = 'Request Work Certificate';
      const message = `Request Work Certificate has been added  by ${this.currentUser.nom} ${this.currentUser.prenom}.`;

      const notification = this.formatNotification(titre, message, this.currentUser);
      this.notificationService.createNotification(notification.titre, notification.message, notification.user.id).subscribe();
    }
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

  private formatAttestation(attestation: AttestationDeTravail): AttestationDeTravail {
    if (attestation.user && attestation.user.roles) {
      attestation.user.roles = attestation.user.roles.map(role => ({
        ...role,
        roleType: role.roleType.toString() // Ensure roleType is a string
      }));
    }
    if (attestation.user && attestation.user.fonctions) {
      attestation.user.fonctions = attestation.user.fonctions.map(fonction => ({
        ...fonction,
        fonctionType: fonction.fonctionType.toString() // Ensure fonctionType is a string
      }));
    }
    // if (attestation.user && attestation.user.postes) {
    //   attestation.user.postes = attestation.user.postes.map(poste => ({
    //     ...poste,
    //     posteType: poste.posteType.toString() // Ensure posteType is a string
    //   }));
    // }
    return attestation;
  }
}
