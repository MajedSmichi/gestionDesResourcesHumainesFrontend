import { Component, OnInit } from '@angular/core';
import { User } from '../../../core/model/user.model';
import { UserService } from '../../../core/service/user.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/service/auth.service';
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'app-employe-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule],
  providers: [UserService]
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  authenticatedUserId: number | null = null;
  postes: string[] = [];
  selectedPoste: string = '';
  noEmployeesMessage: string = '';

  constructor(private userService: UserService, private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    this.userService.getAllUser().subscribe(data => {
      this.users = data.map(user => {
        user.photo = `http://localhost:9090/rh/uploads/${user.photo}`;
        return user;
      });
      this.filteredUsers = this.users;
    });
    this.fetchPostes();
  }

  fetchPostes(): void {
    this.userService.getPostes().subscribe(data => {
      this.postes = data;
    });
  }

  searchUsers(searchTerm: string): void {
    if (searchTerm) {
      this.filteredUsers = this.users.filter(user => user.email.toLowerCase().includes(searchTerm.toLowerCase()));
    } else {
      this.filteredUsers = this.users;
    }
    // Reset the message when searching
    this.noEmployeesMessage = this.filteredUsers.length === 0 ? 'Aucun employé ne correspond à ce critère de recherche.' : '';
  }

  filterByPoste(selectedPoste: string): void {
    if (selectedPoste) {
      this.filteredUsers = this.users.filter(user =>
        user.postes.some(poste => poste.posteType === selectedPoste)
      );
      this.noEmployeesMessage = this.filteredUsers.length === 0 ? 'Aucun employé ne correspond à ce poste.' : '';
    } else {
      this.filteredUsers = this.users;
      this.noEmployeesMessage = '';
    }
  }

  onPosteChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedPoste = target.value;
    this.filterByPoste(this.selectedPoste);
  }

  deleteUser(id: number) {
    this.userService.deleteUser(id).subscribe(() => {
      this.users = this.users.filter(e => e.id !== id);
      this.filteredUsers = this.filteredUsers.filter(e => e.id !== id);
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
      this.filteredUsers = this.filteredUsers.map(user => {
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
      this.filteredUsers = this.filteredUsers.map(user => {
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
