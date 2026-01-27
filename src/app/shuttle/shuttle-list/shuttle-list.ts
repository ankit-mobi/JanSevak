import { Component, inject, OnInit, signal } from '@angular/core';
import { ShuttleRoute, ShuttleService } from '../shuttle-service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-shuttle-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './shuttle-list.html',
  styleUrl: './shuttle-list.scss',
})

export class ShuttleList implements OnInit {

  private shuttleService = inject(ShuttleService);
  routes = signal<ShuttleRoute[]>([]);

  ngOnInit(): void {
    this.shuttleService.getRoutes().subscribe(data => this.routes.set(data));
  }
}
