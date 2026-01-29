import { Component, inject, OnInit, signal } from '@angular/core';
import { EventService, AppEvent } from '../event-service';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-event-list',
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './event-list.html',
  styleUrl: './event-list.scss',
})
export class EventList implements OnInit {
 private eventService = inject(EventService);
  events = signal<AppEvent[]>([]);

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents() {
    this.eventService.getEvents().subscribe({
      next: (data) => {
        const today = new Date();

        today.setHours(0, 0, 0, 0);

        const activeEvents = data.filter(event => {
          const eventEndDate = new Date(event.endDate);

          return eventEndDate >= today;
        });

        
        this.events.set(activeEvents);
      },
      error: (err) => console.error('Failed to load events', err)
    });
  }
}