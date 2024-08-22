import {Component, OnInit} from '@angular/core';
import {DatePipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {FicheDePaieService} from "../../../core/service/ficheDePaie.service";
import {AuthService} from "../../../core/service/auth.service";
import {NotificationService} from "../../../core/service/notification.service";
import {FicheDePaie} from "../../../core/model/FicheDePaie.model";
import {jsPDF} from 'jspdf';
import 'jspdf-autotable';

@Component({
  selector: 'app-fiche-de-paie-list',
  standalone: true,
  imports: [
    DatePipe,
    NgForOf,
    NgIf,
    NgClass
  ],
  templateUrl: './fiche-de-paie-list.component.html',
  styleUrl: './fiche-de-paie-list.component.css'
})
export class FicheDePaieListComponent implements OnInit{

  attestation: FicheDePaie[] = [];

  ngOnInit(): void {
    this.loadPayslip()
  }

  constructor(private ficheDePaieService: FicheDePaieService,
              private authService: AuthService,
              private notificationService: NotificationService) {}

  convertToValidDateFormat(dateString: Date | string | undefined): string | undefined {
    if (!dateString) return undefined; // Si la date n'est pas définie, renvoyer undefined

    if (typeof dateString === "string" && dateString.includes('/')) {
      const [day, month, year] = dateString.split('/');
      return `${year}-${month}-${day}`;
    } else if (dateString instanceof Date) {
      const year = dateString.getFullYear();
      const month = String(dateString.getMonth() + 1).padStart(2, '0');
      const day = String(dateString.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }

    return dateString.toString(); // Si la date est déjà au bon format, la renvoyer telle quelle
  }

  loadPayslip(): void {
    this.ficheDePaieService.getAllFicheDePaie().subscribe(
      (data: FicheDePaie[]) => {
        this.attestation = data.map(attestation => {
          attestation.user.photo = `http://localhost:9090/rh/uploads/${attestation.user.photo}`;
          attestation.dateDeCreation = this.convertToValidDateFormat(attestation.dateDeCreation);
          return attestation;
        });
      },
      error => {
        console.error('Error fetching attestation de travail:', error);
      }
    );
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

  acceptDemand (demand: FicheDePaie): void {
    this.ficheDePaieService.acceptDemand(demand.id).subscribe(() => {
      console.log('Accepting attestation:', demand);
      this.loadPayslip();
      this.generateFICHEDEPAIE(demand); // Génération du fichier après acceptation
    });
  }

  refuseDemand(demand: FicheDePaie): void {
    this.ficheDePaieService.refuseDemand(demand.id).subscribe(() => {
      console.log('Refusing attestation:', demand);
      this.loadPayslip();
    });
  }

  generateFICHEDEPAIE(demand: FicheDePaie): void {
    const doc = new jsPDF();

    // Vérification du type de dateDeCreation
    console.log('Type de dateDeCreation:', typeof demand.dateDeCreation);
    console.log('Valeur de dateDeCreation:', demand.dateDeCreation);

    // Conversion du timestamp (chaîne de caractères) en objet Date
    let formattedDate = 'Date non disponible';

    if (typeof demand.dateDeCreation === 'string' && !isNaN(Number(demand.dateDeCreation))) {
      const date = new Date(Number(demand.dateDeCreation)); // Conversion en nombre puis en Date
      formattedDate = date.toLocaleDateString(); // Format de date lisible (dd/mm/yyyy)
    } else if (typeof demand.dateDeCreation === 'number') {
      const date = new Date(demand.dateDeCreation);
      formattedDate = date.toLocaleDateString();
    }

    // Titre
    doc.setFontSize(18);
    doc.text('Fiche de Paie', 14, 22);

    // Informations sur l'employé
    doc.setFontSize(12);
    doc.text(`Nom: ${demand.user.nom}`, 14, 30);
    doc.text(`Prénom: ${demand.user.prenom}`, 14, 36);
    doc.text(`Date: ${formattedDate}`, 14, 42);

    // Tableau avec les détails de la fiche de paie
    (doc as any).autoTable({
      startY: 50,
      head: [['Détails', 'Montant (en TND)']],
      body: [
        ['Salaire de base', `${demand.user.salaireBase}`],
        ['Heures supplémentaires', '-'],
        ['Primes', `${demand.user.prime}`],
        ['Indemnités', '-'],
        ['Total Brut', '-'],
        ['Retenues', '-'],
        ['Salaire Net', `${demand.user.salaireNet}`]
      ],
      theme: 'grid',  // Style du tableau (vous pouvez personnaliser cela)
      headStyles: { fillColor: [22, 160, 133] },  // Couleur de l'en-tête
      styles: {
        fontSize: 11,
        cellPadding: 4,
      },
    });

    // Sauvegarde du fichier PDF
    doc.save(`fiche_de_paie_${demand.user.nom}_${formattedDate}.pdf`);
  }
}
