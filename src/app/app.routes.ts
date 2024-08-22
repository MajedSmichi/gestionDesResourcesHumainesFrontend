import { Routes } from '@angular/router';
import { ProfileComponent } from './pages/profile/profile.component';
import { HomeComponent } from './layouts/home/home.component';
import { DashboardComponent } from './layouts/dashboard/dashboard.component';
import { UserListComponent } from './pages/user/user-list/user-list.component';
import { AddUserComponent } from './pages/user/add-user/add-user.component';
import { LoginComponent } from './account/login/login.component';
import { UserDetailComponent } from './pages/user/user-detail-component/user-detail-component.component';
import {DemandeCongeComponent} from "./pages/Conge/demande-conge/demande-conge.component";
import {ListCongeComponent} from "./pages/Conge/list-conge/list-conge.component";
import {AttestationDeTravailFormComponent} from "./pages/attestation-de-travail/Add-attestation-de-travail/attestation-de-travail.component";
import {
  ListAttestationDeTravailComponent
} from "./pages/attestation-de-travail/list-attestation-de-travail/list-attestation-de-travail.component";
import {FicheDePaieComponent} from "./pages/fiche-de-paie/add-fiche-de-paie/fiche-de-paie.component";
import {FicheDePaieListComponent} from "./pages/fiche-de-paie/fiche-de-paie-list/fiche-de-paie-list.component";

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'user-list', component: UserListComponent },
  { path: 'add-user', component: AddUserComponent },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'user-detail/:id', component: UserDetailComponent },
  { path: 'demandConge',component: DemandeCongeComponent},
  { path: 'list-conge', component: ListCongeComponent },
  { path: 'work-certificate', component:AttestationDeTravailFormComponent},
  { path: 'list-Work-certificate', component:ListAttestationDeTravailComponent},
  { path: 'payslip', component:FicheDePaieComponent},
  { path: 'payslip-list', component:FicheDePaieListComponent},
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];
