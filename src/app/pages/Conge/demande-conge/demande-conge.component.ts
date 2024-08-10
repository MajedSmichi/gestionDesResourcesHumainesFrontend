import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { DemandeConge } from '../../../core/model/demande-conge.model';
import { DemandeCongeService } from '../../../core/service/demande-conge.service';
import { AuthService } from '../../../core/service/auth.service';
import { User } from '../../../core/model/user.model';

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

  constructor(
    private demandeCongeService: DemandeCongeService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.setMinDate();
    this.setCurrentUser();
    this.setDefaultDates();
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
    this.errors = {}; // Réinitialiser les erreurs avant de soumettre

    this.demandeCongeService.validateDemandeConge(this.newDemande, this.currentUser?.id).subscribe(
      () => {
        if (this.currentUser) {
          this.newDemande.user = this.currentUser;
          this.demandeCongeService.saveDemandeConge(this.newDemande).subscribe(() => {
            this.newDemande = new DemandeConge();
            console.log('Demande de congé ajoutée avec succès');
          });
        }
      },
      (error: any) => {
        console.log('Received error response:', error); // Log la réponse d'erreur
        this.errors = error || {};
        console.log('Processed errors:', this.errors);
      }
    );
  }
}
