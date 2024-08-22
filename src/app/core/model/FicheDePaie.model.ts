import {User} from "./user.model";
import {DemandeCongeStatus} from "./demande-conge-status.enum";

export class FicheDePaie {
  id?: number;
  dateDeCreation: Date | string | undefined;
  dateUpdate: Date | undefined;
  user: User;
  statut: DemandeCongeStatus;


  constructor(
    statut?: DemandeCongeStatus,
    dateDeCreation?: Date,
    dateUpdate?: Date,
    user?: User,
  ) {

   this.statut = statut|| DemandeCongeStatus.PENDING;
    this.dateDeCreation = dateDeCreation;
    this.dateUpdate = dateUpdate;
    this.user = user || new User();
  }
}
