import { Component } from '@angular/core';
import { AuthService } from '../../core/service/auth.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../../core/model/user.model';
import {NgIf} from "@angular/common";

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
  err: number = 0;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  onLoggedin() {
    this.authService.login(this.user).subscribe({
      next: (data) => {
        let jwToken = data.headers.get('Authorization')!;
        this.authService.saveToken(jwToken);
        this.router.navigate(['/dashboard']);
      },
      error: (err: any) => {
        this.err = 1;
      }
    });
  }
}
