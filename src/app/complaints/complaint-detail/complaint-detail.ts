import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Complaint, ComplaintService } from '../complaint-service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-complaint-detail',
  imports: [CommonModule, FormsModule],
  templateUrl: './complaint-detail.html',
  styleUrl: './complaint-detail.scss',
})
export class ComplaintDetail implements OnInit {

  private route = inject(ActivatedRoute);
  private location = inject(Location);
  private complaintService = inject(ComplaintService);

  complaint = signal<Complaint | undefined >(undefined);

  selectedStatus: string = '';
  newComment: string = '';

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if(id){
      this.loadComplaint(id);
    }
  }

  loadComplaint(id: string){
    this.complaintService.getComplaintById(id).subscribe(data => {
      if(data){
        this.complaint.set(data);
        this.selectedStatus = data.status;
      }
    });
  }

  submitUpdates() {
const complaintId = this.complaint()?.id;

const submissionData = {
      status: this.selectedStatus,
      comment: this.newComment,

      };
console.log('Submitting Updates for', complaintId, submissionData);


alert(`Form Submitted!\n\nNew Status: ${this.selectedStatus}\nComment: "${this.newComment}"\n\n(API integration required to save permanently)`);

// Here you would call your service:
    // this.complaintService.updateComplaint(complaintId, submissionData).subscribe(...)
}

  
  goBack(){
    this.location.back();
  }
}
