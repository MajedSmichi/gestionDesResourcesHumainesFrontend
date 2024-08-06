import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../core/service/user.service';
import { User } from '../../core/model/user.model';
import { FormsModule, NgForm } from '@angular/forms';
import { NgForOf, NgIf } from "@angular/common";

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail-component.component.html',
  styleUrls: ['./user-detail-component.component.css'],
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    NgForOf
  ]
})
export class UserDetailComponent implements OnInit {
  user: User | undefined;
  isEditMode: boolean = false;
  editButtonText: string = 'Edit';
  postes: string[] = [];
  roles: string[] = [];
  fonctions: string[] = [];
  selectedPoste: string = '';
  selectedRole: string = '';
  selectedFonction: string = '';
  errors: any = {};

  constructor(private route: ActivatedRoute, private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = this.route.snapshot.queryParamMap.get('edit') === 'true';
    this.editButtonText = this.isEditMode ? 'Save' : 'Edit';
    if (userId) {
      this.userService.getUserById(+userId).subscribe(user => {
        user.photo = `http://localhost:9090/rh/uploads/${user.photo}`;
        this.user = user;
        this.selectedPoste = user.postes[0]?.posteType || '';
        this.selectedRole = user.roles[0]?.roleType || '';
        this.selectedFonction = user.fonctions[0]?.fonctionType || '';
        this.fetchPostes();
        this.fetchRoles();
        this.fetchFonctions();
      });
    }
  }

  toggleEditMode(form: NgForm): void {
    if (this.isEditMode) {
      // Clear all errors
      this.clearAllErrors();

      this.userService.validateEditUser(this.user!).subscribe(
        () => {
          // Save changes
          this.user!.postes[0].posteType = this.selectedPoste;
          this.user!.roles[0].roleType = this.selectedRole;
          this.user!.fonctions[0].fonctionType = this.selectedFonction;
          this.userService.updateUserById(this.user!.id, this.user!).subscribe(
            () => {
              this.isEditMode = false;
              this.editButtonText = 'Edit';
            },
            error => {
              console.error('Error updating user:', error);
              this.errors = error.error;
            }
          );
        },
        error => {
          this.errors = error.error;
        }
      );
    } else {
      this.isEditMode = true;
      this.editButtonText = 'Save';
      this.fetchPostes();
      this.fetchRoles();
      this.fetchFonctions();
    }
  }

  fetchPostes(): void {
    this.userService.getPostes().subscribe(data => {
      this.postes = data;
    });
  }

  fetchRoles(): void {
    this.userService.getRoles().subscribe(data => {
      this.roles = data;
    });
  }

  fetchFonctions(): void {
    this.userService.getFonctions().subscribe(data => {
      this.fonctions = data;
    });
  }

  clearError(field: string): void {
    if (this.errors[field]) {
      delete this.errors[field];
    }
  }

  clearAllErrors(): void {
    this.errors = {};
  }

  returnToUserList(): void {
    this.router.navigate(['/user-list']);
  }
}
