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
  
  // Current date shown in the grid (changes when clicking arrows)
  viewDate = signal<Date>(new Date());
  // The specific date selected by the user
  selectedDate = signal<string>(new Date().toISOString().split('T')[0]);

  stats = signal<ComplaintStats>({
    totalComplaints: 0,
    pending: 0,
    inprogress: 0,
    resolved: 0,
  });

  // Calendar Grid Generation logic
  calendarDays = computed(() => {
    const viewDate = this.viewDate();
    const startOfMonth = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
    const endOfMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0);
    
    const days = [];
    const startDay = startOfMonth.getDay(); // 0 (Sun) to 6 (Sat)
    
    // Fill previous month days to start from Sunday
    const prevMonthEnd = new Date(viewDate.getFullYear(), viewDate.getMonth(), 0);
    for (let i = startDay - 1; i >= 0; i--) {
      days.push(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, prevMonthEnd.getDate() - i));
    }

    // Fill current month days
    for (let i = 1; i <= endOfMonth.getDate(); i++) {
      days.push(new Date(viewDate.getFullYear(), viewDate.getMonth(), i));
    }

    // Fill next month days to complete a 6-week grid (42 days)
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, i));
    }
    
    return days;
  });

  filteredEvents = computed(() => {
    const selected = this.selectedDate();
    return this.allEvents().filter(event => event.startDate.split('T')[0] === selected);
  });

  ngOnInit() {
    this.loadStats();
    this.loadRecentComplaints();
    this.loadAllEvents();
  }

  // --- New Calendar Methods ---
  
  changeMonth(offset: number) {
    const current = this.viewDate();
    this.viewDate.set(new Date(current.getFullYear(), current.getMonth() + offset, 1));
  }

  onDateSelect(date: Date) {
    const dateStr = date.toISOString().split('T')[0];
    this.selectedDate.set(dateStr);
  }

  isToday(date: Date): boolean {
    return new Date().toDateString() === date.toDateString();
  }

  isSelected(date: Date): boolean {
    return this.selectedDate() === date.toISOString().split('T')[0];
  }

  isSameMonth(date: Date): boolean {
    return date.getMonth() === this.viewDate().getMonth();
  }

  hasEvents(date: Date): boolean {
    const dateStr = date.toISOString().split('T')[0];
    return this.allEvents().some(e => e.startDate.split('T')[0] === dateStr);
  }

  // --- Existing Methods ---

  getFormattedHeaderDate(): string {
    return new Date(this.selectedDate()).toLocaleDateString('en-US', {
      weekday: 'short', month: 'long', day: 'numeric'
    });
  }

  loadAllEvents() {
    this.dashboardService.getAllEvents().subscribe({
      next: (data) => this.allEvents.set(data),
      error: (err) => console.error('Error loading events:', err)
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
      next: (data) => this.recentComplaints.set(data),
      error: (err) => console.error('Error fetching recent complaints:', err)
    });
  }

  getStatusClass(status: string): string {
    const s = status.toLowerCase();
    if (s === 'resolved') return 'status-Resolved';
    if (s === 'inprogress') return 'status-inprogress';
    return 'status-pending';
  }
}