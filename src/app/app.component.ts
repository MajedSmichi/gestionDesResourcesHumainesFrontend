import { Component } from '@angular/core';
import {Router, NavigationEnd, RouterOutlet} from '@angular/router';
import {SidebarComponent} from "./layouts/sidebar/sidebar.component";
import {NavbarComponent} from "./layouts/navbar/navbar.component";
import {MainContentComponent} from "./layouts/main-content/main-content.component";
import {FooterComponent} from "./layouts/footer/footer.component";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [
    SidebarComponent,
    NavbarComponent,
    MainContentComponent,
    FooterComponent,
    RouterOutlet,
    NgIf
  ],
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  showLayout: boolean = true;

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.showLayout = !['/login'].includes(event.urlAfterRedirects);
      }
    });
  }
}
