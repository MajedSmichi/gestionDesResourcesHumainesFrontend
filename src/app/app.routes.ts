import { Routes } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import {EmployeListComponent} from "./employe-list/employe-list.component";

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'employe-list', component: EmployeListComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];
