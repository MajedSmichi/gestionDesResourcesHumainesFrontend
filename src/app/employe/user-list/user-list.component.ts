import { Component, OnInit } from '@angular/core';
import { User } from '../../core/model/user.model';
import { UserService } from '../../core/service/user.service';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import { CommonModule } from '@angular/common';
import {Router, RouterModule} from "@angular/router";

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

  constructor(private userService: UserService,private router:Router) { }

  ngOnInit(): void {
    this.userService.getAllUser().subscribe(data => {
      this.users = data;
    });
  }

  deleteUser(id: number) {
    this.userService.deleteUser(id).subscribe(data => {
      this.users = this.users.filter(e => e.id !== id);
      this.router.navigateByUrl('/',{skipLocationChange:true}).then(()=>{
        this.router.navigate(['/user-list']);
      });
    });
  }
}
