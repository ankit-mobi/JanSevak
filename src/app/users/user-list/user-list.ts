import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import {  UserService, UserTableData } from '../user-service';

@Component({
  selector: 'app-user-list',
  standalone: true, // Assuming standalone based on your previous messages
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './user-list.html',
  styleUrl: './user-list.scss',
})
export class UserList implements OnInit {
 private userService = inject(UserService);

  // Stores the data for the Table
  users = signal<UserTableData[]>([]);
  
  // Tracks current Tab
  currentRole = signal<string>('Citizen');
  
  // Loading state
  isLoading = signal<boolean>(false);

  ngOnInit(): void {
    // Load default (Citizen) on start
    this.setRole('Citizen');
  }

  setRole(role: string) {
    this.currentRole.set(role);
    this.isLoading.set(true);
    this.users.set([]); // Clear table while loading

    let apiCall$;

    // Switch case to decide which API to call
    switch (role) {
      case 'Volunteer':
        apiCall$ = this.userService.getVolunteers();
        break;
      case 'Employer':
        apiCall$ = this.userService.getEmployers();
        break;
      case 'Job seeker':
        apiCall$ = this.userService.getJobSeekers();
        break;
      case 'Citizen':
      default:
        apiCall$ = this.userService.getUsers();
        break;
    }

    // Execute the call
    apiCall$.subscribe({
      next: (data) => {
        this.users.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(`Error fetching ${role}:`, err);
        this.isLoading.set(false);
      }
    });
  }
}