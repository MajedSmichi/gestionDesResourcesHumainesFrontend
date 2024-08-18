import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/service/auth.service';
import { UserService } from '../../core/service/user.service';
import { User } from '../../core/model/user.model';
import { FormsModule, NgForm, ReactiveFormsModule } from "@angular/forms";
import {formatDate, NgClass, NgForOf, NgIf} from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";
import {error} from "@angular/compiler-cli/src/transformers/util";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    NgClass
  ],
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {
  user: User | undefined;
  tempUser: Partial<User> = {};
  isEditMode: boolean = false;
  editButtonText: string = 'Edit';
  postes: string[] = [];
  roles: string[] = [];
  fonctions: string[] = [];
  selectedPoste: string = '';
  selectedRole: string = '';
  selectedFonction: string = '';
  errors: any = {};
  formattedDateCreation: string = '';
  formattedDateUpdate: string = '';
  currentPassword: string | undefined;
  newPassword: string | undefined;
  confirmPassword: string | undefined;
  showPassword: boolean = false; // Toggle for password visibility
  successMessage: string | undefined; // Success message
  passwordErrors: any = {}; // To store password validation errors
  passwordErrors1: any = {};


  constructor(private route: ActivatedRoute, private authService: AuthService, private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    const userId = this.authService.getCurrentUserFromToken().id;

    this.editButtonText = this.isEditMode ? 'Save' : 'Edit';
    if (userId) {
      this.userService.getUserById(+userId).subscribe(user => {
        user.photo = `http://localhost:9090/rh/uploads/${user.photo}`;
        this.user = user;
        this.tempUser = { ...user };
        this.selectedPoste = user.postes[0]?.posteType || '';
        this.selectedRole = user.roles[0]?.roleType || '';
        this.selectedFonction = user.fonctions[0]?.fonctionType || '';
        this.fetchPostes();
        this.fetchRoles();
        this.fetchFonctions();
        this.updateFormattedDates();
      });
    }
  }

  toggleEditMode(form: NgForm): void {
    if (this.isEditMode) {
      this.clearAllErrors();
      this.userService.validateEditUser(this.tempUser as User).subscribe(
        () => {
          this.user = { ...this.tempUser } as User;
          this.user!.postes[0].posteType = this.selectedPoste;
          this.user!.roles[0].roleType = this.selectedRole;
          this.user!.fonctions[0].fonctionType = this.selectedFonction;
          this.user!.dateUpdate = new Date().toISOString();
          this.userService.updateUserById(this.user!.id, this.user!).subscribe(
            () => {
              this.isEditMode = false;
              this.editButtonText = 'Edit';
              this.updateFormattedDates();
            },
            error => {
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

  formatDate(timestamp: Date | string | undefined): string {
    if (!timestamp) {
      return '';
    }
    const date = new Date(timestamp);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    };
    return date.toLocaleString('fr-FR', options);
  }

  updateFormattedDates(): void {
    if (this.user) {
      this.formattedDateCreation = this.formatDate(this.user.dateCreation);
      this.formattedDateUpdate = this.formatDate(this.user.dateUpdate);
    }
  }



  validatePasswords(form: NgForm): boolean {
    this.passwordErrors = {};
    this.passwordErrors1 = {};

    const { currentPassword, newPassword, confirmPassword } = form.value;
    let isValid = true;

    if (!currentPassword) {
      this.passwordErrors.currentPassword = "Current password is required.";
      isValid = false;
    }
    if (!newPassword) {
      this.passwordErrors.newPassword = "New password is required.";
      isValid = false;
    }
    if (!confirmPassword) {
      this.passwordErrors.confirmPassword = "Confirm password is required.";
      isValid = false;
    } else if (newPassword !== confirmPassword) {
      this.passwordErrors1.confirmPassword = "New password and confirm password do not match.";
      isValid = false;
    }

    return isValid;
  }

  updatePassword(form: NgForm): void {
    if (!this.validatePasswords(form)) {
      return; // Stop form submission if validation fails
    }

    const { currentPassword, newPassword } = form.value;
    const userId = this.user?.id;

    if (userId) {
      this.authService.updatePassword(userId, currentPassword, newPassword).subscribe(
        (response: string) => {
          console.log("Response from server:", response);

          if (response === 'Password updated successfully') {
            this.successMessage = 'Password updated successfully';
            setTimeout(() => {
              this.successMessage = '';
            }, 5000);
            form.resetForm();
            this.clearAllErrors();
          } else {
            console.log("Unexpected response:", response);
          }
        },
        error => {
          console.log("Backend error response:", error);
          if (error.status === 401) {
            this.passwordErrors1.currentPassword = "Current password is incorrect";
          } else {
            this.passwordErrors1.general = "An error occurred while updating the password";
          }
        }
      );
    }
  }








  clearPasswordError(field: string): void {
    if (this.passwordErrors[field]) {
      delete this.passwordErrors[field];
    }
  }


}
