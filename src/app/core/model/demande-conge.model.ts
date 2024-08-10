import { User } from './user.model';
import { DemandeCongeStatus } from './demande-conge-status.enum';

export class DemandeConge {
  id?: number;
  dateDebut: string | Date;
  dateFin: string | Date;
  raison: string;
  status: DemandeCongeStatus;
  user: User;
  soldeConge: number;
  type: string;

  constructor(
    dateDebut?: string,
    dateFin?: string,
    raison?: string,
    status?: DemandeCongeStatus,
    user?: User,
    soldeConge?: number,
    type?: string
  ) {
    this.dateDebut = dateDebut || new Date();
    this.dateFin = dateFin || new Date();
    this.raison = raison || '';
    this.status = status || DemandeCongeStatus.PENDING;
    this.user = user || new User();
    this.soldeConge = soldeConge || 0;
    this.type = type || '';
  }
}
