import { CommonModule, DatePipe, Location } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AppEvent, EventService } from '../event-service';

@Component({
  selector: 'app-event-view',
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './event-view.html',
  styleUrl: './event-view.scss',
})

export class EventView implements OnInit {

  private route= inject(ActivatedRoute);
  private eventService = inject(EventService);
  private location = inject(Location);

  event = signal<AppEvent | undefined>(undefined);


  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.eventService.getEventById(id).subscribe(data => this.event.set(data));
    }
  }

  goBack() {
    this.location.back();
  }
}
