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


  // Pagination Signals
  currentPage = signal<number>(1);
  pageSize = signal<number>(5);
  totalPages = signal<number>(1);

ngOnInit() {
    this.complaintService.getComplaints().subscribe(data => {
      this.allComplaints = data;
      this.applyFilterAndPagination();
    });
  }


  // Filter Logic
 filterBy(status: string) {
    this.currentFilter.set(status);
    this.currentPage.set(1); // Reset to page 1 on filter change
    this.applyFilterAndPagination();
  }

  applyFilterAndPagination() {
    // 1. First, Filter
    let result = [...this.allComplaints];
    if (this.currentFilter() !== 'All') {
      result = result.filter(c => c.status === this.currentFilter());
    }

    // 2. Calculate Total Pages
    this.totalPages.set(Math.ceil(result.length / this.pageSize()));

    // 3. Slice for Pagination
    const startIndex = (this.currentPage() - 1) * this.pageSize();
    const endIndex = startIndex + this.pageSize();
    
    this.filteredComplaints.set(result.slice(startIndex, endIndex));
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      this.applyFilterAndPagination();
    }
  }

  // helper for badge colors
  getStatusColor(status: string): string {
    switch(status) {
      case 'Resolved': return 'bg-success-subtle text-success';
      case 'Inprogress': return 'bg-warning-subtle text-warning';
      case 'Pending': return 'bg-danger-subtle text-danger';
      default: return 'bg-light text-dark';
    }
  }
}
