import { Role } from './role.model';
import { Poste } from './poste.model';
import { Fonction } from './fonction.model';

export class User {
  id!: number;
  nom!: string;
  prenom!: string;
  motDePasse!: string;
  email!: string;
  telephone!: number;
  soldeConges!: number;
  active!: boolean;
  photo!: string;
  roles!: Role[];
  postes!: Poste[];
  fonctions!: Fonction[];
}
