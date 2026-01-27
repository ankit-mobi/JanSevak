import { Injectable } from '@angular/core';
import { of } from 'rxjs';

export interface Complaint{
   id: string;
  title: string;
  location: string;
  date: string;
  description: string;
  reporter: string;
  contact: string;
  status: 'Pending' | 'In-Progress' | 'Completed';
  image: string;
}

@Injectable({
  providedIn: 'root',
})

export class ComplaintService {
  // Mock Data matching your screenshot
  private mockComplaints: Complaint[] = [
    {
      id: 'C001',
      title: 'Street Lights',
      location: 'Datta Mandir Chowk',
      date: '2026-01-05',
      description: 'Street light not working for the past 3 days, creating safety concerns.',
      reporter: 'Rajesh Kumar',
      contact: '+91 9995327484',
      status: 'Completed',
      image: 'https://via.placeholder.com/150/333' // Placeholder image
    },
    {
      id: 'C002',
      title: 'Garbage Collection',
      location: 'Symbiosis Junction',
      date: '2026-01-06',
      description: 'Garbage not collected for 2 days, accumulating near main road.',
      reporter: 'Priya Sharma',
      contact: '+91 7386532748',
      status: 'In-Progress',
      image: 'https://via.placeholder.com/150/333'
    },
    {
      id: 'C003',
      title: 'Pothole Repair',
      location: 'Viman Nagar Main Rd',
      date: '2026-01-07',
      description: 'Large pothole causing traffic jam.',
      reporter: 'Amit Singh',
      contact: '+91 9876543210',
      status: 'Pending',
      image: 'https://via.placeholder.com/150/333'
    }
  ];


  
  getComplaints() {
    return of(this.mockComplaints); // Returns data like an API
  }
  
  // We will need this later for the Detail View
  getComplaintById(id: string) {
    const complaint = this.mockComplaints.find(c => c.id === id);
    return of(complaint);
  }
}
