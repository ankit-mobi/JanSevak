import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ComplaintStats, DashboardService } from './dashboard.service';
import { CommonModule } from '@angular/common';
import { Complaint } from '../complaints/complaint-service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {

  private dashboardService = inject(DashboardService);

  recentComplaints = signal<any[]>([]);
  allEvents = signal<any[]>([]);
  selectedDate = signal<string>(new Date().toISOString().split('T')[0]);

  stats = signal<ComplaintStats>({
    totalComplaints: 0,
    pending: 0,
    inprogress: 0,
    resolved: 0,
  });

  
  
  // Computed signal to filter events based on selectedDate
filteredEvents = computed(() => {
    const selected = this.selectedDate();
    return this.allEvents().filter(event => {
      const eventDate = event.startDate.split('T')[0]; //
      return eventDate === selected;
    });
  });

  ngOnInit() {
    this.loadStats();
    this.loadRecentComplaints();
    this.loadAllEvents();
  }

  loadAllEvents() {
    this.dashboardService.getAllEvents().subscribe({
      next: (data) => this.allEvents.set(data), //
      error: (err) => console.error('Error loading events:', err)
    });
  }

  onDateClick(newDate: string) {
    this.selectedDate.set(newDate);
  }

  // Helper to format the display date in the header
 getFormattedHeaderDate(): string {
    return new Date(this.selectedDate()).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'long',
      day: 'numeric'
    });
  }

  loadStats() {
    this.dashboardService.getStats().subscribe({
      next: (response) => {
        if (response && response.data) this.stats.set(response.data);
      }
    });
  }

  loadRecentComplaints() {
    this.dashboardService.getRecentComplaints().subscribe({
      next: (data) => {
        this.recentComplaints.set(data);
      },
      error: (err) => console.error('Error fetching recent complaints:', err)
    });
  }

  getStatusClass(status: string): string {
    const s = status.toLowerCase();
    if (s === 'resolved' || s === 'completed') return 'status-completed';
    if (s === 'inprogress') return 'status-inprogress';
    return 'status-pending';
  }

}
