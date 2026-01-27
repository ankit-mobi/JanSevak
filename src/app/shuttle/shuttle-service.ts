import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, of } from 'rxjs';
import { environment } from '../../environments/environment';


export interface ShuttleRoute{
  _id: string;
  routeName: string;
  serviceTimings: string
  operationalDays: string;
  frequency: string;
  pickupAndDropPoints: string[];
}

@Injectable({
  providedIn: 'root',
})


export class ShuttleService {

  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/admin/erickshaw`;
  

  // Get all routes
  getRoutes() {
    return this.http.get<{ status: number, data: ShuttleRoute[]}>(`${this.baseUrl}/allroutes`).pipe(map(response => response.data)); // Extract just the array
  }

  // Get by ID
  getRouteById(id: string) {
    return this.http.get<{ status: number, data: ShuttleRoute[]}>(`${this.baseUrl}/route/${id}`).pipe(map(response => response.data));
  }


  // new route
  createRoute(formData: any){
    const payload = {
      route: formData.name,
      timings: formData.serviceTime,
      operatingDays: formData.operatingDays,
      frequency: formData.frequency,
      pickUpAndDropPoints: formData.stops
    };

    return this.http.post(`${this.baseUrl}/route`, payload);
  }

  // update route
  updateRoute(id: string, formData: any){
    const payload = {
    routeName: formData.name,
    serviceTimings: formData.serviceTime,
    operationalDays: formData.operatingDays,
    frequency: formData.frequency,
    pickupAndDropPoints: formData.stops
    };

    return this.http.patch(`${this.baseUrl}/route/update/${id}`, payload);
  };

  // Mock Save/Update
  saveRoute(route: any) {
    console.log('Saving Route:', route);
    return of({ success: true });
  }

  
}
