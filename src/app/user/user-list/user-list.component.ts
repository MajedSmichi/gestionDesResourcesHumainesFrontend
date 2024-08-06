// user-list.component.ts
import { Component, OnInit } from '@angular/core';
import { User } from '../../core/model/user.model';
import { UserService } from '../../core/service/user.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/service/auth.service';

@Component({
  selector: 'app-employe-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
  standalone: true,
  imports: [HttpClientModule, CommonModule],
  providers: [UserService]
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  authenticatedUserId: number | null = null;

  constructor(private userService: UserService, private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    this.userService.getAllUser().subscribe(data => {
      this.users = data.map(user => {
        user.photo = `http://localhost:9090/rh/uploads/${user.photo}`;
        return user;
      });
    });
  }

  deleteUser(id: number) {
    this.userService.deleteUser(id).subscribe(data => {
      this.users = this.users.filter(e => e.id !== id);
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/user-list']);
      });
    });
  }

  enableUser(id: number) {
    this.userService.enableUser(id).subscribe(() => {
      this.users = this.users.map(user => {
        if (user.id === id) {
          user.active = true;
        }
        return user;
      });
    });
  }

  disableUser(id: number) {
    this.userService.disableUser(id).subscribe(() => {
      this.users = this.users.map(user => {
        if (user.id === id) {
          user.active = false;
        }
        return user;
      });
    });
  }

  viewUser(user: User) {
    this.router.navigate(['/user-detail', user.id]);
  }


  editUser(user: User) {
    this.router.navigate(['/user-detail', user.id], { queryParams: { edit: true } });
  }
}
