import { Component, OnInit } from '@angular/core';
import {FormsModule, NgForm} from '@angular/forms';
import { UserService } from '../../core/service/user.service';
import {NgForOf, NgIf} from "@angular/common";
import {Router} from "@angular/router";

@Component({
  selector: 'app-add-employe',
  templateUrl: './add-user.component.html',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    NgForOf
  ],
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {
  postes: string[] = [];
  roles: string[] = [];
  fonctions: string[] = [];
  selectedPoste: string = '';
  selectedRole: string = '';
  selectedFonction: string = '';
  selectedFile: File | null = null;
  progress = 0;
  errors: any = {};
  successMessage: string = '';

  constructor(private userService: UserService,private router: Router) {}

  ngOnInit(): void {
    this.fetchPostes();
    this.fetchRoles();
    this.fetchFonctions();
  }

  onFileChange(event: any): void {
    this.selectedFile = event.target.files[0];
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

  onRoleChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedRole = target.value;
  }

  onPosteChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedPoste = target.value;
  }

  onFonctionChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedFonction = target.value;
  }

  onSubmit(form: NgForm): void {
    this.errors = {}; // Réinitialiser les erreurs

    const user = {
      ...form.value,
      roles: [this.selectedRole],
      postes: [this.selectedPoste],
      fonctions: [this.selectedFonction]
    };

    this.userService.validateUser(user).subscribe(
      () => {
        const formData = new FormData();
        formData.append('user', new Blob([JSON.stringify(user)], { type: 'application/json' }));

        if (this.selectedFile) {
          formData.append('file', this.selectedFile);
        }

        this.userService.createUser(formData).subscribe(response => {
          console.log('User created successfully', response);
          this.successMessage ='User added successfully';
          form.resetForm();
          setTimeout(() => {
            this.router.navigate(['/user-list']);
          }, 2000);
        }, error => {
          console.error('Error creating user', error);
        });
      },
      error => {
        this.errors = error.error;
      }
    );
  }
}
