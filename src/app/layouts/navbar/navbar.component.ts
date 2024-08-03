import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/service/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  standalone: true
})
export class NavbarComponent implements OnInit {
  loggedUserName: string = '';
  userImage: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.loadToken();
    this.loggedUserName = this.authService.loggedUser;
    console.log('User Image Path:', this.authService.userImage); // Vérifie la valeur
    this.userImage = this.authService.userImage ? `http://localhost:9090/rh/uploads/${this.authService.userImage}` : 'default-image-url';
  }


  onLogout() {
    this.authService.logout();
  }
}

