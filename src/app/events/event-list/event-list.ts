import { Component, inject, OnInit, signal } from '@angular/core';
import { EventService, AppEvent } from '../event-service';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

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

  loadEvents(){
    this.eventService.getEvents().subscribe(data => this.events.set(data));
  }

  deleteEvent(id: string){
    if(confirm('Are you sure you want to delete this event?')){
      this.eventService.deleteEvent(id).subscribe(() => {
        this.loadEvents();
      })
    }
  }
}
