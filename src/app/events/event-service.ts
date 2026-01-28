import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { environment } from '../../environments/environment';

export interface AppEvent {
  _id: string;
  eventTitle: string;       // Matches API
  eventDescription: string; // Matches API
  startDate: string;
  endDate: string;
  bannerImage: string;
  address: string;
  contactNo: string;
  emailId: string;
  websiteUrl?: string;
  __v?: number;
}

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/admin/events`;
  private assetUrl = environment.apiUrl.replace('/api', '');


  private transformData(item: any): AppEvent {
    return {
      ...item,
      // Fix: Prepend the backend URL to the relative path provided by the API
      bannerImage: item.bannerImage 
        ? `${this.assetUrl}/${item.bannerImage}` 
        : 'assets/placeholder-event.jpg'
    };
  }

 // 1. GET ALL EVENTS
  getEvents() {
    return this.http.get<{status: number, data: any[]}>(`${this.baseUrl}/allevents`)
      .pipe(
        map(res => res.data.map(item => this.transformData(item)))
      );
  }

  // 2. GET EVENT BY ID
getEventById(id: string) {
    return this.http.get<{status: number, data: any}>(`${this.baseUrl}/event/${id}`)
      .pipe(
        map(res => this.transformData(res.data))
      );
  }


// 3. CREATE EVENT (FormData + ISO Dates)
 createEvent(formValue: any, file: File) {
    const formData = new FormData();
    formData.append('bannerImage', file);
    formData.append('title', formValue.title);
    formData.append('description', formValue.description);
    formData.append('address', formValue.address);
    formData.append('contactNo', formValue.contactNo);
    formData.append('emailId', formValue.emailId);
    
    if (formValue.webUrl) formData.append('webUrl', formValue.webUrl);

    const startIso = new Date(formValue.startDate).toISOString();
  const endIso = new Date(formValue.endDate).toISOString();
    
    formData.append('startDate', startIso);
    formData.append('endDate', endIso);

    return this.http.post(`${this.baseUrl}/event`, formData);
  }

  // 4. UPDATE EVENT (Partial JSON Update)
updateEvent(id: string, changedData: any) {
    const payload = { ...changedData };

    if (payload.startDate) {
    payload.startDate = new Date(payload.startDate).toISOString();
  }
  if (payload.endDate) {
    payload.endDate = new Date(payload.endDate).toISOString();
  }

    if (payload.title) {
      payload.eventTitle = payload.title;
      delete payload.title;
    }
    if (payload.description) {
      payload.eventDescription = payload.description;
      delete payload.description;
    }
    
    return this.http.patch(`${this.baseUrl}/event/update/${id}`, payload);
  }
}