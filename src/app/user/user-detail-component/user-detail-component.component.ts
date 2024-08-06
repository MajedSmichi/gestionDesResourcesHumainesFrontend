// user-detail-component.component.ts
import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { UserService } from '../../core/service/user.service';
import { User } from '../../core/model/user.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail-component.component.html',
  styleUrls: ['./user-detail-component.component.css'],
  standalone: true,
  imports: [
    FormsModule
  ]
})
export class UserDetailComponent implements OnInit {
  user!: User;

  constructor(private route: ActivatedRoute, private userService: UserService,private router:Router) { }

  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) {
      this.userService.getUserById(+userId).subscribe(user => {
        user.photo = `http://localhost:9090/rh/uploads/${user.photo}`;
        this.user = user;
        console.log(this.user);
      });
    }
  }
  returnToUserList(): void {
    this.router.navigate(['/user-list']);
  }
}
