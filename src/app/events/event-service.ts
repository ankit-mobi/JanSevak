import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { map } from 'rxjs';


export interface AppEvent{
  _id: string;
  eventTitle: string;
  eventDescription: string;
  startDate: string;
  endDate: string;
  bannerImage: string;
  address: string;
  contactNo: string;
  emailId: string;
  websiteUrl?: string;
}

@Injectable({
  providedIn: 'root',
})


export class EventService {

  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/admin/events`;


  // get all
  getEvents(){
    return this.http.get<{status: number, data: AppEvent[]}>(`${this.baseUrl}/allevents`).pipe(map(res => res.data));
  }
  
  // get by id
    getEventById(id: string){
     return this.http.get<{status: number, data: AppEvent}>(`${this.baseUrl}/event/${id}`).pipe(map(res => res.data));
    }

    // 3. CREATE EVENT (POST with FormData)
createEvent(formValue: any, file: File) {
  const formData = new FormData();
  
  // 1. File
  formData.append('bannerImage', file);

  // 2. Map Text Fields correctly
  formData.append('eventTitle', formValue.title); 
  formData.append('eventDescription', formValue.description);
  
  // 3. DATE TRANSFORMATION (Crucial for Mongoose)
  // This converts "2026-01-25" (from HTML) to "2026-01-25T00:00:00.000Z" (Postman style)
  if (formValue.startDate) {
    formData.append('startDate', new Date(formValue.startDate).toISOString());
  }
  if (formValue.endDate) {
    formData.append('endDate', new Date(formValue.endDate).toISOString());
  }
  
  // 4. Other fields
  formData.append('address', formValue.address);
  formData.append('contactNo', formValue.contactNo);
  formData.append('emailId', formValue.emailId);

  if (formValue.webUrl) {
    formData.append('websiteUrl', formValue.webUrl);
  }

  return this.http.post(`${this.baseUrl}/event`, formData);
}

  // 4. UPDATE EVENT (PATCH with JSON - Partial Updates)
  updateEvent(id: string, changedData: any) {
    // changedData will only contain { contactNo: "..." } etc.
    return this.http.patch(`${this.baseUrl}/event/update/${id}`, changedData);
  }

 

  deleteEvent(id: string){
      return this.http.delete(`${this.baseUrl}/${id}`);
   }
  
}
