import {DemandeCongeStatus} from "./demande-conge-status.enum";
import {User} from "./user.model";


export class AttestationDeTravail{
  id!: number;
  dateDemande!: Date| string;
  statut: DemandeCongeStatus;
  dateTraitement!: Date | null;
  user: User;
  raison: string;

  constructor(
    dateDemande?: Date,
    statut?: DemandeCongeStatus,
    dateTraitement?: Date,
    user?: User,
    raison?: string
  ) {
    this.dateDemande = dateDemande || new Date();
    this.statut = statut|| DemandeCongeStatus.PENDING;
    this.user = user || new User();
    this.dateTraitement = dateTraitement || null;
    this.raison = raison || '';
  }

}
