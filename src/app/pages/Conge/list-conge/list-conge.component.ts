import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DemandeConge } from "../../../core/model/demande-conge.model";
import { DemandeCongeService } from "../../../core/service/demande-conge.service";
import { DemandeCongeStatus } from '../../../core/model/demande-conge-status.enum';

@Component({
  selector: 'app-list-conge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-conge.component.html',
  styleUrls: ['./list-conge.component.css']
})
export class ListCongeComponent implements OnInit {
  demandes: DemandeConge[] = [];

  constructor(private demandeCongeService: DemandeCongeService) {}

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
      this.loadDemandes();
    });
  }

  refuseDemande(demande: DemandeConge): void {
    this.demandeCongeService.refuseDemandeConge(demande.id, DemandeCongeStatus.REJECTED).subscribe(() => {
      console.log('Refusing demande:', demande);
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
}
