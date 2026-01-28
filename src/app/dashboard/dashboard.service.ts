import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map } from 'rxjs';



export interface ComplaintStats {
    totalComplaints: number;
    pending: number;
    inprogress: number;
    resolved: number;
}


// Add this to match your API JSON structure
export interface ApiResponse {
  status: number;
  message: string;
  data: ComplaintStats;
}

@Injectable({
  providedIn: 'root'
})


export class DashboardService {
  
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/admin/complaints/statusCounts`;
  private complaintsUrl = `${environment.apiUrl}/admin/complaints`;
  private eventsUrl = `${environment.apiUrl}/admin/events/allevents`;

  getStats() {
    return this.http.get<ApiResponse>(this.apiUrl);
  }

  getRecentComplaints() {
    return this.http.get<{status: number, data: any[]}>(this.complaintsUrl).pipe(
      map(res => res.data.slice(0, 3)) // Take only the latest 3
    );
  }

  getAllEvents() {
    return this.http.get<{status: number, data: any[]}>(this.eventsUrl).pipe(
      map(res => res.data)
    );
  }
}