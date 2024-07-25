import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { FooterComponent } from '../footer/footer.component';
import { MainContentComponent } from '../main-content/main-content.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    NgOptimizedImage,
    NavbarComponent,
    SidebarComponent,
    FooterComponent,
    MainContentComponent
  ],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent {}
