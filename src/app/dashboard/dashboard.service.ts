import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';


export interface ComplaintStats {
    totalComplaints: number;
    pending: number;
    inprogress: number;
    resolved: number;
}

@Injectable({
  providedIn: 'root'
})


export class DashboardService {
  
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/admin/complaints/statusCounts`;

  getStats() {
    return this.http.get<ComplaintStats>(this.apiUrl);
  }
}