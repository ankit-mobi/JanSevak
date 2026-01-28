import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Complaint, ComplaintService } from '../complaint-service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-complaint-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './complaint-list.html',
  styleUrl: './complaint-list.scss',
})

export class ComplaintList implements OnInit {

private complaintService = inject(ComplaintService);

allComplaints: Complaint[] = [];
  filteredComplaints = signal<Complaint[]>([]);
  currentFilter = signal<string>('All');

ngOnInit() {
    this.complaintService.getComplaints().subscribe(data => {
      this.allComplaints = data;
      this.filteredComplaints.set(data);
    });
  }


  // Filter Logic
 filterBy(status: string) {
    this.currentFilter.set(status);

    if (status === 'All') {
      this.filteredComplaints.set(this.allComplaints);
    } else {
      // The service now guarantees "Inprogress" matches "Inprogress"
      const filtered = this.allComplaints.filter(c => c.status === status);
      this.filteredComplaints.set(filtered);
    }
  }


  // helper for badge colors
  getStatusColor(status: string): string {
    switch(status) {
      case 'Completed': return 'bg-success-subtle text-success';   
      case 'Resolved': return 'bg-success-subtle text-success';
      case 'Inprogress': return 'bg-warning-subtle text-warning';
      case 'Pending': return 'bg-danger-subtle text-danger';
      default: return 'bg-light text-dark';
    }
  }
}
