import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule, NgForm } from '@angular/forms';
import { NgForOf, NgIf, NgStyle } from "@angular/common";
import { UploadFileService } from '../../core/service/upload-file.service';

@Component({
  selector: 'app-add-employe',
  templateUrl: './add-employe.component.html',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    NgStyle,
    NgIf
  ],
  styleUrls: ['./add-employe.component.css']
})
export class AddEmployeComponent implements OnInit {
  postes: string[] = [];
  roles: string[] = [];
  fonctions: string[] = [];
  selectedPoste: string = '';
  selectedRole: string = '';
  selectedFonction: string = '';
  selectedFile: File | null = null;
  progress = 0;
  errors: any = {};

  constructor(private http: HttpClient, private uploadService: UploadFileService) {}

  ngOnInit(): void {
    this.fetchPostes();
    this.fetchRoles();
    this.fetchFonctions();
  }

  onFileChange(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  fetchPostes(): void {
    this.http.get<string[]>('http://localhost:9090/rh/api/users/postes')
      .subscribe(data => {
        this.postes = data;
      });
  }

  fetchRoles(): void {
    this.http.get<string[]>('http://localhost:9090/rh/api/users/roles')
      .subscribe(data => {
        this.roles = data;
      });
  }

  fetchFonctions(): void {
    this.http.get<string[]>('http://localhost:9090/rh/api/users/fonctions')
      .subscribe(data => {
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
    this.errors = {}; // Reset errors
    if (form.invalid) {
      console.log('Form is invalid');
      return;
    }

    const formData = new FormData();
    formData.append('user', new Blob([JSON.stringify(form.value)], { type: 'application/json' }));
    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }

    this.http.post('http://localhost:9090/rh/api/saisie/validate', form.value)
      .subscribe({
        next: () => {
          this.http.post('http://localhost:9090/rh/api/users/create', formData)
            .subscribe(response => {
              console.log('User created successfully', response);
            }, error => {
              console.error('Error creating user', error);
            });
        },
        error: (errorResponse) => {
          console.log('Validation errors:', errorResponse.error);
          this.errors = errorResponse.error;
        }
      });
  }
}
