import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DemandeConge} from "../../../core/model/demande-conge.model";
import {DemandeCongeService} from "../../../core/service/demande-conge.service";


@Component({
  selector: 'app-list-conge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-conge.component.html',
  styleUrls: ['./list-conge.component.css']
})
export class ListCongeComponent implements OnInit {
  demandes: DemandeConge[] = [];

  constructor(private demandeCongeService: DemandeCongeService) {}


  ngOnInit(): void {
    this.loadDemandes();
    this.demandeCongeService.getDemandesConge().subscribe(data => {
      this.demandes = data.map(demande => {
        demande.user.photo = `http://localhost:9090/rh/uploads/${demande.user.photo}`;
        return demande;
      });
    });
  }

  loadDemandes(): void {
    this.demandeCongeService.getDemandesConge().subscribe(data => {
      this.demandes = data;
    }, error => {
      console.error('Error fetching demandes conge:', error);
    });
  }
}
