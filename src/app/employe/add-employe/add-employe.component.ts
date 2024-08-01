import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule, NgForm } from '@angular/forms';
import { NgForOf } from "@angular/common";

@Component({
  selector: 'app-add-employe',
  templateUrl: './add-employe.component.html',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf
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

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchPostes();
    this.fetchRoles();
    this.fetchFonctions();
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

  onSubmit(form: NgForm): void {
    const formData = form.value;
    this.http.post('http://localhost:9090/rh/api/users/create', formData)
      .subscribe(response => {
        console.log('User created successfully', response);

        // Ensure selectedRole is set before making the request
        if (this.selectedRole) {
          this.http.post('http://localhost:9090/rh/api/users/addRoleToUser', null, {
            params: {
              email: formData.email,
              roleType: this.selectedRole
            }
          }).subscribe(roleResponse => {
            console.log('Role added to user successfully', roleResponse);
          }, error => {
            console.error('Error adding role to user', error);
          });
        } else {
          console.error('No role selected');
        }
      }, error => {
        console.error('Error creating user', error);
      });
  }
}
