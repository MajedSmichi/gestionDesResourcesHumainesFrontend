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
  demandes: DemandeConge[] = [];
  dateError: boolean = false;
  minDate: string | undefined;
  currentUser: User | undefined;

  constructor(
    private demandeCongeService: DemandeCongeService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.setMinDate();
    this.setCurrentUser();
  }



  setMinDate(): void {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
  }

  validateDates(): void {
    const currentDate = new Date();
    this.dateError = this.newDemande.dateDebut < currentDate || this.newDemande.dateFin < currentDate;
  }

  setCurrentUser(): void {
    this.currentUser = this.authService.getCurrentUserFromToken();
  }

  onSubmit(): void {
    if (!this.dateError && this.currentUser) {
      this.newDemande.user = this.currentUser;
      console.log('id', this.currentUser.id);
      console.log(this.currentUser);
      console.log(this.newDemande);
      this.demandeCongeService.saveDemandeConge(this.newDemande).subscribe(() => {
        this.newDemande = new DemandeConge();
        console.log('Demande de congé ajoutée avec succès');

      });
    }
  }
}
