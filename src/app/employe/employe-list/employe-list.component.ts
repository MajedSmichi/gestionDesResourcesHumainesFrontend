import { Component, OnInit } from '@angular/core';
import { User } from '../../model/user.model';
import { UserService } from '../../service/user.service';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-employe-list',
  templateUrl: './employe-list.component.html',
  styleUrls: ['./employe-list.component.css'],
  standalone: true,
  imports: [HttpClientModule, CommonModule],
  providers: [UserService]
})
export class EmployeListComponent implements OnInit {
  employes: User[] = [];

  constructor(private employeService: UserService) { }

  ngOnInit(): void {
    this.employeService.getAllEmployes().subscribe(data => {
      this.employes = data;
    });
  }
}
