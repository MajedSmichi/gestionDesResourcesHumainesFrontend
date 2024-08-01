import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  standalone: true
})
export class NavbarComponent implements OnInit {
  loggedUserName: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.loadToken();
    this.loggedUserName = this.authService.loggedUser;
    console.log("loggedUserName: " + this.loggedUserName);
  }

  onLogout() {
    this.authService.logout();
  }
}
