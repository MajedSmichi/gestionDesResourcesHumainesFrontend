import { Routes } from '@angular/router';
import { ProfileComponent } from './pages/profile/profile.component';
import { HomeComponent } from './layouts/home/home.component';
import { DashboardComponent } from './layouts/dashboard/dashboard.component';
import { EmployeListComponent } from './employe/employe-list/employe-list.component';
import { AddEmployeComponent } from './employe/add-employe/add-employe.component';
import { LoginComponent } from './account/login/login.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'employe-list', component: EmployeListComponent },
  { path: 'add-employe', component: AddEmployeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Redirect to login page by default
  { path: '**', redirectTo: '/login' }
];
