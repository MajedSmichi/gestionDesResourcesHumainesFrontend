import { Component, OnInit } from '@angular/core';
import { AttestationDeTravailService } from "../../../core/service/attestationDeTravail.service";
import { AttestationDeTravail } from "../../../core/model/AttestationDeTravail.model";
import {DatePipe, NgClass, NgForOf, NgIf} from "@angular/common";
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import {NotificationService} from "../../../core/service/notification.service";
import {AuthService} from "../../../core/service/auth.service";

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

  constructor(private attestationService: AttestationDeTravailService,private authService: AuthService,private notificationService: NotificationService) {
  }

  ngOnInit() {
    this.loadAttestations();
  }

  loadAttestations(): void {
    console.log("userAuth",this.authService.getCurrentUserFromToken())
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
    const currentDate = new Date().toLocaleDateString(); // Get the current date
    const dateEmbauche = new Date(attestation.user.dateCreation).toLocaleDateString(); // Format the hire date

    const logoURL = 'assets/img/samobay.png'; // Ensure this path is correct and the image is accessible

    const htmlContent = `
    <div class="container" style="width: 100%; padding: 20px; box-sizing: border-box;">
        <div class="content" style="text-align: justify; margin-top: 20px;">
            <div style="text-align: center; margin-bottom: 20px;">
                <img src="${logoURL}" alt="Logo SAMOBAY" style="width: 150px; height: auto;">
                <br>
                <br>
                <h1>Attestation de Travail</h1>
                <br>

            </div>
            <p>Je soussigné(e), <strong>${this.authService.getCurrentUserFromToken().nom} ${this.authService.getCurrentUserFromToken().prenom}</strong>, en qualité de <strong>${this.authService.getCurrentUserFromToken().postes?.[0]?.posteType}</strong> chez <strong>SAMOBAY</strong>, certifie par la présente que <strong>${attestation.user.nom} ${attestation.user.prenom}</strong> est employé(e) au sein de notre entreprise depuis le <strong>${dateEmbauche}</strong> en tant que <strong>${attestation.user.postes?.[0]?.posteType}</strong>.</p>
            <p>Au cours de sa période de travail, <strong>${attestation.user.nom}</strong> a fait preuve de professionnalisme, de sérieux et de compétences dans l'exécution de ses tâches. Il/Elle a contribué activement au bon fonctionnement de notre service et a su s'adapter aux exigences du poste.</p>
            <p>La présente attestation est délivrée à la demande de l'intéressé(e) pour servir et valoir ce que de droit.</p>
        </div>
        <div class="signature" style="margin-top: 40px; margin-left: 30px;  text-align: left;">
            <div class="date">
                <p>Fait à MANNOUBA, le ${currentDate}</p>
            </div>
            <div class="sign">
                <p>${this.authService.getCurrentUserFromToken().nom} ${this.authService.getCurrentUserFromToken().prenom}</p>
                <p>${this.authService.getCurrentUserFromToken().fonctions?.[0]?.fonctionType}</p>
            </div>
        </div>
    </div>
  `;

    const container = document.createElement('div');
    container.innerHTML = htmlContent;
    container.style.width = '210mm'; // Ajustement pour A4
    container.style.minHeight = '297mm'; // Ajustement pour A4
    container.style.padding = '20px'; // Marges internes
    container.style.boxSizing = 'border-box'; // Pour inclure les marges internes dans la largeur
    document.body.appendChild(container);

    html2canvas(container, { scale: 2 }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const doc = new jsPDF();
      const pdfWidth = doc.internal.pageSize.getWidth();
      const pdfHeight = doc.internal.pageSize.getHeight();
      const imgProps = doc.getImageProperties(imgData);

      const canvasWidth = imgProps.width;
      const canvasHeight = imgProps.height;
      const ratio = Math.min(pdfWidth / canvasWidth, pdfHeight / canvasHeight);

      // Calculer les marges pour centrer l'image
      const xOffset = (pdfWidth - canvasWidth * ratio) / 2;
      const yOffset = (pdfHeight - canvasHeight * ratio) / 2;

      // Ajouter l'image de la page
      doc.addImage(imgData, 'PNG', xOffset, yOffset, canvasWidth * ratio, canvasHeight * ratio);

      // Dessiner un cadre autour de la page
      doc.setLineWidth(1); // Épaisseur du cadre
      doc.rect(10, 10, pdfWidth - 20, pdfHeight - 20); // Coordonnées et dimensions du cadre

      doc.save('work_certificate.pdf');
      document.body.removeChild(container);
    });
  }


}
