import { User } from './user.model';
import {EtatNotification} from "./etatNotification.model";

export class Notification {
  id!: number;
  titre!: string;
  message!: string;
  dateHeure!: Date;
  etat: EtatNotification = EtatNotification.EN_ATTENTE;
  user!: User;

  constructor() {
    this.dateHeure = new Date();
  }

  toString(): string {
    return `Notification{id=${this.id}, titre='${this.titre}', message='${this.message}', dateHeure=${this.dateHeure}, etat=${this.etat}, user=${this.user}}`;
  }
}
