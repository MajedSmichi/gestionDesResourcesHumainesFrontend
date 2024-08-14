import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { DemandeConge } from '../../../core/model/demande-conge.model';
import { DemandeCongeService } from '../../../core/service/demande-conge.service';
import { AuthService } from '../../../core/service/auth.service';
import { User } from '../../../core/model/user.model';
import {Router} from "@angular/router";

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
    private router: Router
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
    this.errors = {}; // Réinitialiser les erreurs avant de soumettre

    this.demandeCongeService.validateDemandeConge(this.newDemande, this.currentUser?.id).subscribe(
      () => {
        if (this.currentUser) {
          this.newDemande.user = this.currentUser;
          this.demandeCongeService.saveDemandeConge(this.newDemande).subscribe(() => {
            this.loadDemandesUser();
             this.successMessage ='Demand added successfully';
             this.newDemande = new DemandeConge();
             setTimeout(() => {
                this.successMessage = '';
            //   this.router.navigate(['/user-conge-list']);
             }, 2000);
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

  loadDemandesUser(): void {
    this.demandeCongeService.getDemandeCongeByUserId(this.authService.getCurrentUserFromToken().id).subscribe((data ) => {
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
