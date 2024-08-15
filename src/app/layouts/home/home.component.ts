import { Component, OnInit } from '@angular/core';
import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import bootstrap5Plugin from '@fullcalendar/bootstrap5';
import { DemandeCongeService } from '../../core/service/demande-conge.service';
import { UserService } from '../../core/service/user.service';
import { DemandeConge } from '../../core/model/demande-conge.model';
import { User } from '../../core/model/user.model';
import { NgIf, NgStyle } from '@angular/common';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  imports: [NgIf, NgStyle],
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  hoveredEvent: any = null; // Propriété pour stocker l'événement survolé

  constructor(
    private demandeCongeService: DemandeCongeService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.initializeCalendar();
    this.initializePieChart();
  }

  private initializeCalendar(): void {
    var calendarEl = document.getElementById('calendar');

    if (calendarEl) {
      var calendar = new Calendar(calendarEl, {
        plugins: [dayGridPlugin, timeGridPlugin, listPlugin, bootstrap5Plugin],
        timeZone: 'UTC',
        themeSystem: 'bootstrap5',
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth'
        },
        weekNumbers: true,
        dayMaxEvents: true,
        events: [],
        eventMouseEnter: (info) => {
          this.hoveredEvent = {
            title: info.event.title,
            raison: info.event.extendedProps['raison'],
            type: info.event.extendedProps['type'],
            photo: info.event.extendedProps['photo'],
            start: info.event.start ? new Date(info.event.start).toLocaleDateString() : 'N/A',
            end: info.event.end ? new Date(info.event.end).toLocaleDateString() : 'N/A',
            position: { left: info.jsEvent.pageX, top: info.jsEvent.pageY } // Position du curseur
          };
        },
        eventMouseLeave: () => {
          this.hoveredEvent = null; // Réinitialiser l'événement survolé
        }
      });

      this.demandeCongeService.getApprovedDemandesConge().subscribe((demandes: DemandeConge[]) => {
        const events = demandes.map(demande => ({
          title: `${demande.user.nom} ${demande.user.prenom}`,
          start: demande.dateDebut,
          end: demande.dateFin,
          allDay: true,
          extendedProps: {
            raison: demande.raison,
            type: demande.type,
            photo: `http://localhost:9090/rh/uploads/${demande.user.photo}` // Adjust the URL as needed
          }
        }));
        calendar.addEventSource(events);
        calendar.render();
      });

    }
  }

  private initializePieChart(): void {
    this.userService.getAllUser().subscribe((users: User[]) => {
      const posteCounts = users.reduce((acc: { [key: string]: number }, user) => {
        // Handle first poste or customize to aggregate multiple postes
        if (user.postes.length > 0) {
          const posteType = user.postes[0].posteType;
          acc[posteType] = (acc[posteType] || 0) + 1;
        }
        return acc;
      }, {});

      const labels = Object.keys(posteCounts);
      const data = Object.values(posteCounts);

      const pieChartElement = document.getElementById("chartjs-pie");
      if (pieChartElement) {
        new Chart(pieChartElement as HTMLCanvasElement, {
          type: "pie",
          data: {
            labels: labels,
            datasets: [{
              data: data,
              backgroundColor: [
                "#007bff", // primary
                "#ffc107", // warning
                "#dc3545", // danger
                "#28a745", // success
                "#17a2b8", // info
                "#6c757d", // secondary
                "#343a40", // dark
                "#f8f9fa"  // light
              ],
              borderColor: "transparent"
            }]
          },
          options: {
            maintainAspectRatio: false
          }
        });
      }
    });
  }
}
