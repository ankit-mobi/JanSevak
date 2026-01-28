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
        console.log('Events Loaded:', data);
        this.events.set(data);
      },
      error: (err) => console.error('Failed to load events', err)
    });
  }
}