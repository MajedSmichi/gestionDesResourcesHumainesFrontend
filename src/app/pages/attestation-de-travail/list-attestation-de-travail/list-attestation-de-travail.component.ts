import { Component, OnInit } from '@angular/core';
import { AttestationDeTravailService } from "../../../core/service/attestationDeTravail.service";
import { AttestationDeTravail } from "../../../core/model/AttestationDeTravail.model";
import {DatePipe, NgClass, NgForOf, NgIf} from "@angular/common";
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-list-attestation-de-travail',
  standalone: true,
  imports: [
    DatePipe,
    NgForOf,
    NgIf,
    NgClass
  ],
  templateUrl: './list-attestation-de-travail.component.html',
  styleUrls: ['./list-attestation-de-travail.component.css']
})
export class ListAttestationDeTravailComponent implements OnInit {
  attestation: AttestationDeTravail[] = [];

  constructor(private attestationService: AttestationDeTravailService) {
  }

  ngOnInit() {
    this.loadAttestations();
  }

  loadAttestations(): void {
    this.attestationService.getAllAttestationDeTravail().subscribe(
      (data: AttestationDeTravail[]) => {
        this.attestation = data.map(attestation => {
          attestation.user.photo = `http://localhost:9090/rh/uploads/${attestation.user.photo}`;
          attestation.dateDemande = this.convertToValidDateFormat(attestation.dateDemande);
          return attestation;
        });
      },
      error => {
        console.error('Error fetching attestation de travail:', error);
      }
    );
  }

  convertToValidDateFormat(dateString: Date | string): string {
    if (typeof dateString === "string") {
      const [day, month, year] = dateString.split('/');
      return `${year}-${month}-${day}`;
    }
    return dateString.toString();
  }

  acceptAttestation(attestation: AttestationDeTravail): void {
    this.attestationService.acceptAttestation(attestation.id).subscribe(() => {
      console.log('Accepting attestation:', attestation);
      this.loadAttestations();
      this.generatePDF(attestation);
    });
  }

  refuseAttestation(attestation: AttestationDeTravail): void {
    this.attestationService.refuseAttestation(attestation.id).subscribe(() => {
      console.log('Refusing attestation:', attestation);
      this.loadAttestations();
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

  generatePDF(attestation: AttestationDeTravail): void {
    const htmlContent = `
    <div class="container">
        <div class="header">
            <h1>Attestation de Travail</h1>
            <h2>SAMOBAY</h2>
        </div>
        <div class="content">
            <p>Je soussigné(e), <strong>[Nom et Prénom du responsable]</strong>, en qualité de <strong>[Titre du responsable]</strong> chez <strong>SAMOBAY</strong>, certifie par la présente que <strong>${attestation.user.nom} ${attestation.user.prenom}</strong> est employé(e) au sein de notre entreprise depuis le <strong>[Date d'embauche]</strong> en tant que <strong>[Poste occupé]</strong>.</p>
            <p>Au cours de sa période de travail, <strong>${attestation.user.nom}</strong> a fait preuve de professionnalisme, de sérieux et de compétences dans l'exécution de ses tâches. Il/Elle a contribué activement au bon fonctionnement de notre service <strong>[Nom du service ou département]</strong> et a su s'adapter aux exigences du poste.</p>
            <p>La présente attestation est délivrée à la demande de l'intéressé(e) pour servir et valoir ce que de droit.</p>
        </div>
        <div class="signature">
            <div class="date">
                <p>Fait à [Ville], le [Date]</p>
            </div>
            <div class="sign">
                <p>[Nom et Prénom du signataire]</p>
                <p>[Fonction du signataire]</p>
            </div>
        </div>
    </div>
  `;

    const container = document.createElement('div');
    container.innerHTML = htmlContent;
    document.body.appendChild(container);

    html2canvas(container).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const doc = new jsPDF();
      const imgProps = doc.getImageProperties(imgData);
      const pdfWidth = doc.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      doc.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      doc.save('work_certificate.pdf');
      document.body.removeChild(container);
    });
  }
}
