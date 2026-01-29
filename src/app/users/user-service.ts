import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { map } from 'rxjs';

// Unified Interface for the View
export interface User {
  _id: string;
  uid: string;
  name: string;
  email: string;
  avatar: string;
  createdAt: string;
  provider: string;
  roles: string[]; // Mapped from 'registrations'
  complaints: UserComplaint[]; // Mapped from complaint API
}

export interface UserComplaint {
  title: string;
  date: string;
  status: string;
}

export interface UserTableData {
  _id: string;
  uid: string;
  name: string;
  email: string;
  avatar: string;
  contactNumber: string;
  createdAt: string;
  role: string; // To track which API it came from
  extraInfo?: string; // For Company Name or Skills
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  // Base paths
  private adminUrl = `${environment.apiUrl}/admin`;
  private userUrl = `${environment.apiUrl}/admin/users`;
  private regUrl = `${environment.apiUrl}/admin/registrations`;

  // get all users
  getUsers() {
    return this.http.get<{status: number, data: any[]}>(this.userUrl).pipe(
      map(res => res.data.map(u => ({
        _id: u._id,
        uid: u.uid,
        name: u.name,
        email: u.email,
        avatar: u.avatar,
        contactNumber: u.contactNumber || 'N/A',
        createdAt: u.createdAt,
        role: 'Citizen'
      })))
    );
  }

  // 2. VOLUNTEERS (API returns 'user', we map it to 'uid')
  getVolunteers() {
    return this.http.get<{status: number, data: any[]}>(`${this.regUrl}/allvolunteers`).pipe(
      map(res => res.data.map(v => ({
        _id: v._id,
        uid: v.user, // <--- FIX: Map 'user' -> 'uid'
        name: v.fullName, // <--- FIX: Map 'fullName' -> 'name'
        email: 'N/A',
        avatar: 'assets/default-avatar.png',
        contactNumber: 'N/A',
        createdAt: '',
        role: 'Volunteer',
        extraInfo: v.skills ? v.skills.join(', ') : ''
      })))
    );
  }

 // 3. EMPLOYERS (API returns 'user', we map it to 'uid')
  getEmployers() {
    return this.http.get<{status: number, data: any[]}>(`${this.regUrl}/allemployers`).pipe(
      map(res => res.data.map(e => ({
        _id: e._id,
        uid: e.user, // <--- FIX: Map 'user' -> 'uid'
        name: e.fullName,
        email: 'N/A',
        avatar: 'assets/default-avatar.png',
        contactNumber: 'N/A',
        createdAt: '',
        role: 'Employer',
        extraInfo: e.companyName
      })))
    );
  }


 // 4. JOB SEEKERS (API returns 'user', we map it to 'uid')
  getJobSeekers() {
    return this.http.get<{status: number, data: any[]}>(`${this.regUrl}/alljobseekers`).pipe(
      map(res => res.data.map(j => ({
        _id: j._id,
        uid: j.user, 
        name: j.fullName,
        email: 'N/A',
        avatar: 'assets/default-avatar.png',
        contactNumber: 'N/A',
        createdAt: '',
        role: 'Job seeker',
        extraInfo: j.education
      })))
    );
  }

  // get user by uid
getUserDetails(uid: string) {
    return this.http.get<{success: boolean, data: any[]}>(`${this.regUrl}/${uid}`).pipe(
      map(res => {
        const userData = res.data[0];
        const rolesList = userData.registrations ? userData.registrations.map((r: any) => r.role) : [];
        
        return {
          _id: userData._id,
          uid: userData.uid,
          name: userData.name,
          email: userData.email,
          avatar: userData.avatar,
          createdAt: userData.createdAt,
          provider: userData.provider,
          roles: rolesList.length > 0 ? rolesList : ['Citizen'],
          complaints: [] 
        };
      })
    );
  }

  getUserComplaints(uid: string) {
    return this.http.get<{status: number, data: any[]}>(`${this.adminUrl}/complaints/user/${uid}`).pipe(
      map(res => {
        // Map backend complaint fields to UI fields
        return res.data.map(c => ({
          title: c.complaintType,        // Map 'complaintType' -> 'title'
          date: c.createdAt.split('T')[0], // Extract Date
          status: this.formatStatus(c.status)
        })) as UserComplaint[];
      })
    );
  }
  
  private formatStatus(status: string): string {
    if (!status) return 'Pending';
    const lower = status.toLowerCase();
    if (lower === 'resolved') return 'Resolved'; // Match your UI color logic
    if (lower === 'inprogress') return 'In-Progress';
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  }
  
}
