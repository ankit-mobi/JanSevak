import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { environment } from '../../environments/environment';


// Interface your UI uses
export interface Complaint {
  id: string;
  title: string;
  location: string;
  date: string;
  description: string;
  reporter: string;
  contact: string;
  status: 'Pending' | 'Inprogress' | 'Resolved'; 
  image: string;
  resolvedPhoto?: string; 
}

//Interface the Backend sends
interface BackendComplaint {
  _id: string;
  user: string;
  locality: string;
  complaintType: string;
  complaintDescription: string;
  photo: string;
  location: string;
  status: string; 
  createdAt: string;
  reportedBy: string; 
  emailId: string;
  resolvedPhoto?: string;
}


@Injectable({
  providedIn: 'root',
})

export class ComplaintService {

  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/admin/complaints`;
  private assetUrl = environment.apiUrl.replace('/api', '');


  private transformData(item: BackendComplaint): Complaint {
    return {
      id: item._id,
      title: item.complaintType,          
      description: item.complaintDescription, 
      location: item.locality || item.location,
      date: item.createdAt.split('T')[0],
      // Fix: Prepend the backend URL to the relative path
      image: item.photo ? `${this.assetUrl}/${item.photo}` : 'assets/placeholder.jpg',
      resolvedPhoto: item.resolvedPhoto ? `${this.assetUrl}/${item.resolvedPhoto}` : '',
      status: this.formatStatus(item.status) as any,
     reporter: item.reportedBy || 'Citizen', 
      contact: item.emailId || 'N/A'
    };
  }

  getComplaints() {
    return this.http.get<{status: number, data: BackendComplaint[]}>(this.baseUrl).pipe(
      map(response => response.data.map(item => this.transformData(item)))
    );
  }
  
  // GET BY ID
 getComplaintById(id: string) {
    return this.http.get<{status: number, data: BackendComplaint}>(`${this.baseUrl}/complaint/${id}`).pipe(
      map(response => this.transformData(response.data))
    );
  }

  updateComplaint(id: string, status: string, file?: File) {
    const formData = new FormData();
    formData.append('_id', id);
    let backendStatus = status.toLowerCase();
    // if (backendStatus === 'completed') backendStatus = 'resolved';
    
    formData.append('status', backendStatus);
    if (backendStatus === 'resolved' && file) {
      formData.append('resolvedPhoto', file);
    }

    return this.http.patch(`${this.baseUrl}/updateStatus`, formData);
  }



private formatStatus(status: string): string {
    if (!status) return 'Pending';
    const lower = status.toLowerCase();
    if (lower === 'resolved') return 'Resolved';
    if (lower === 'inprogress') return 'Inprogress';
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  }

}
