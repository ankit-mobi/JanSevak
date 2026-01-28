import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Complaint, ComplaintService } from '../complaint-service';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';


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
selectedFile = signal<File | null>(null);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadComplaint(id);
    }
  }

  loadComplaint(id: string) {
    this.complaintService.getComplaintById(id).subscribe({
      next: (data) => {
        this.complaint.set(data);
        this.selectedStatus = data.status; // Sets the dropdown to current status
      },
      error: (err) => console.error(err)
    });
  }


  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
     this.selectedFile.set(file);
    }
  }

 submitUpdates() {
    const complaintId = this.complaint()?.id;
    if (!complaintId) return;

    this.complaintService.updateComplaint(complaintId, this.selectedStatus, this.selectedFile() || undefined)
      .subscribe({
        next: (res) => {
          Swal.fire({
            html: `
              <div class="py-4">
                <div class="mb-3">
                  <i class="bi bi-check-circle text-success" style="font-size: 5rem;"></i>
                </div>
                <h4 class="fw-bold text-dark">Complaint Status Updated Successfully</h4>
              </div>
            `,
            showConfirmButton: false,
            timer: 2000,
            customClass: { popup: 'rounded-4' }
          }).then(() => {
            this.goBack();
          });
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Update Failed',
            text: 'Could not update the complaint. Please check your connection.',
            confirmButtonColor: '#ff6b00'
          });
        }
      });
  }

  
  goBack(){
    this.location.back();
  }
}
