import {Component, OnInit} from '@angular/core';
import {FicheDePaie} from "../../../core/model/FicheDePaie.model";
import {FicheDePaieService} from "../../../core/service/ficheDePaie.service";
import {FormsModule} from "@angular/forms";
import {User} from "../../../core/model/user.model";
import {AuthService} from "../../../core/service/auth.service";
import {NotificationService} from "../../../core/service/notification.service";
import {Notification} from "../../../core/model/notification.model";
import {EtatNotification} from "../../../core/model/etatNotification.model";
import {DatePipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {DemandeCongeStatus} from "../../../core/model/demande-conge-status.enum";

@Component({
  selector: 'app-fiche-de-paie',
  standalone: true,
  imports: [
    FormsModule,
    DatePipe,
    NgForOf,
    NgIf,
    NgClass
  ],
  templateUrl: './fiche-de-paie.component.html',
  styleUrls: ['./fiche-de-paie.component.css']
})
export class FicheDePaieComponent implements OnInit {
  ficheDePaie: FicheDePaie = new FicheDePaie();
  minDate: string | undefined;
  currentUser: User | undefined;
  demandes: FicheDePaie[] = [];

  ngOnInit(): void {
    this.setMinDate();
    this.setCurrentUser();
    this.loadUserPayslip();
  }

  constructor(private ficheDePaieService: FicheDePaieService,
              private authService: AuthService,
              private notificationService: NotificationService) {}


  addFicheDePaie() {

    this.ficheDePaie.user = this.authService.getCurrentUserFromToken();
    this.ficheDePaie.dateDeCreation = new Date();
    this.ficheDePaie.statut = DemandeCongeStatus.PENDING;
    console.log('Fiche de paie:', this.ficheDePaie);
    this.ficheDePaieService.addFicheDePaie(this.formatFicheDePaie(this.ficheDePaie)).subscribe(response => {
      console.log('Fiche de paie added:', response);
     this.createNotification();
      this.loadUserPayslip();
    }, error => {
      console.error('Error adding fiche de paie:', error);
    });
  }

  onDateChange(field: string, event: Event): void {
    const input = event.target as HTMLInputElement;
    console.log(`${field} selected:`, input.value);
  }

  setMinDate(): void {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
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

  setCurrentUser(): void {
    this.currentUser = this.authService.getCurrentUserFromToken();
  }

  private createNotification(): void {
    if (this.currentUser) {
      const titre = 'Request Pay Slip';
      const message = `Request Pay Slip has been added  by ${this.currentUser.nom} ${this.currentUser.prenom}.`;

      const notification = this.formatNotification(titre, message, this.currentUser);
      this.notificationService.createNotification(notification.titre, notification.message, notification.user.id).subscribe();
    }
  }

  private formatFicheDePaie(ficheDePaie: FicheDePaie): FicheDePaie {
    if (ficheDePaie.user && ficheDePaie.user.roles) {
      ficheDePaie.user.roles = ficheDePaie.user.roles.map(role => ({
        ...role,
        roleType: role.roleType.toString() // Ensure roleType is a string
      }));
    }
    if (ficheDePaie.user && ficheDePaie.user.fonctions) {
      ficheDePaie.user.fonctions = ficheDePaie.user.fonctions.map(fonction => ({
        ...fonction,
        fonctionType: fonction.fonctionType.toString() // Ensure fonctionType is a string
      }));
    }
    return ficheDePaie;
  }

  convertToValidDateFormat(dateString: Date | string | undefined): string | undefined {
    if (typeof dateString === "string") {
      const [day, month, year] = dateString.split('/');
      return `${year}-${month}-${day}`;
    }
    return dateString ? dateString.toString() : dateString;
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

  loadUserPayslip(): void {
    this.ficheDePaieService.getFicheDePaieByUserId(this.authService.getCurrentUserFromToken().id).subscribe(
      (data: FicheDePaie[]) => {
        this.demandes = data.map((demande: FicheDePaie) => {
          if (demande.user) {
            demande.user.photo = `http://localhost:9090/rh/uploads/${demande.user.photo}`;
          }

          demande.dateDeCreation = this.convertToValidDateFormat(demande.dateDeCreation);
          return demande;
        });
      },
      (error) => {
        console.error('Error fetching demandes conge:', error);
      }
    );
  }
}
