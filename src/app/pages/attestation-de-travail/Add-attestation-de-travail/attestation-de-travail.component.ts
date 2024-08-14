import { Component, OnInit } from '@angular/core';
import { AttestationDeTravail } from '../../../core/model/AttestationDeTravail.model';
import { DemandeCongeStatus } from '../../../core/model/demande-conge-status.enum';
import { FormsModule } from '@angular/forms';
import { DatePipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { AttestationDeTravailService } from '../../../core/service/attestationDeTravail.service';
import { User } from '../../../core/model/user.model';
import { AuthService } from '../../../core/service/auth.service';

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

  constructor(private attestationDeTravailService: AttestationDeTravailService, private authService: AuthService) {}

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
    this.attestationDeTravailService.saveAttestationDeTravail(this.attestation).subscribe(() => {
      this.attestation = new AttestationDeTravail();
      this.loadUserAttestationDeTravail();
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
