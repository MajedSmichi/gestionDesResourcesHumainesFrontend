import { Component, OnInit } from '@angular/core';
import { Employe } from '../model/employe.model';
import { EmployeService } from '../service/employe.service';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-employe-list',
  templateUrl: './employe-list.component.html',
  styleUrls: ['./employe-list.component.css'],
  standalone: true,
  imports: [HttpClientModule, CommonModule],
  providers: [EmployeService]
})
export class EmployeListComponent implements OnInit {
  employes: Employe[] = [];

  constructor(private employeService: EmployeService) { }

  ngOnInit(): void {
    this.employeService.getAllEmploye().subscribe(data => {
      this.employes = data;
    });
  }
}
