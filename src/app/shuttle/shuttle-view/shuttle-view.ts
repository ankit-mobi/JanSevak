import { CommonModule, Location } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ShuttleRoute, ShuttleService } from '../shuttle-service';


@Component({
  selector: 'app-shuttle-view',
  imports: [RouterLink, CommonModule],
  templateUrl: './shuttle-view.html',
  styleUrl: './shuttle-view.scss',
})


export class ShuttleView implements OnInit {

  private routeService = inject(ActivatedRoute); 
  private location = inject(Location);
  private shuttleService = inject(ShuttleService);

  route = signal<ShuttleRoute | undefined>(undefined);  

  ngOnInit(): void {
   
    const id = this.routeService.snapshot.paramMap.get('id');

    if(id){
      this.shuttleService.getRouteById(id).subscribe(data => {

        this.route.set(data as unknown as ShuttleRoute);
      })
    }
  }

  goBack(){
    this.location.back();
  }

  
}
