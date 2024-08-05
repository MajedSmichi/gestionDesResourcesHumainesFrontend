import { Component } from '@angular/core';
import { AuthService } from '../../core/service/auth.service';
import { Router } from '@angular/router';
import { User } from '../../core/model/user.model';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [
    FormsModule,
    NgIf
  ],
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  user: User = new User();
  errorMessage: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  onLoggedin() {
    this.authService.login(this.user).subscribe({
      next: (response) => {
        try {
          if (response.body) {
            const jsonResponse = JSON.parse(response.body as string);
            console.log("Login successful", jsonResponse);
          } else {
            console.log("Login successful", response.body);
          }
          this.router.navigate(['/dashboard']);
        } catch (e) {
          console.log("Login successful", response.body);
          this.router.navigate(['/dashboard']);
        }
      },
      error: (error: HttpErrorResponse) => {
        console.error("Login error", error);
        if (error.status === 401) {
          this.errorMessage = "Credentials not correct.";
        } else if (error.status === 404) {
          this.errorMessage = "Email not registered yet.";
        }
      }
    });
  }
}
