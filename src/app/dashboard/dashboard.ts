import { Component, inject, OnInit, signal } from '@angular/core';
import { ComplaintStats, DashboardService } from './dashboard.service';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {

  private dashboardService = inject(DashboardService);

  stats = signal<ComplaintStats>({
    totalComplaints: 0,
    pending: 0,
    inprogress: 0,
    resolved: 0,
  });

  ngOnInit() {
    this.loadStats();
  }

  loadStats(){
    this.dashboardService.getStats().subscribe({
      next: (data) => {
        this.stats.set(data);
      },
     
      
    });
  }
}
