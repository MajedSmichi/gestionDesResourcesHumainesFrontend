import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../core/service/user.service';
import { User } from '../../core/model/user.model';
import { FormsModule } from '@angular/forms';
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

  toggleEditMode(): void {
    if (this.isEditMode) {
      // Save changes
      this.user!.postes[0].posteType = this.selectedPoste;
      this.user!.roles[0].roleType = this.selectedRole;
      this.user!.fonctions[0].fonctionType = this.selectedFonction;
      console.log('Updating user:', this.user); // Debug log
      this.userService.updateUserById(this.user!.id, this.user!).subscribe(
        () => {
          console.log('User updated successfully'); // Debug log
          this.isEditMode = false;
          this.editButtonText = 'Edit';
        },
        error => {
          console.error('Error updating user:', error); // Debug log
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

  returnToUserList(): void {
    this.router.navigate(['/user-list']);
  }
}
