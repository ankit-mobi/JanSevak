import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../event-service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './event-form.html',
  styleUrl: './event-form.scss'
})
export class EventForm implements OnInit {
 private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private location = inject(Location);
  private eventService = inject(EventService);

  form: FormGroup;
  isEditMode = false;
  eventId: string | null = null;
  
  // File Upload
  selectedFile: File | null = null;
  imagePreview: string | null = null;

  // Store original data to detect changes
  private originalData: any = {};

  constructor() {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      address: ['', Validators.required],
      contactNo: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      emailId: ['', [Validators.required, Validators.email]],
      webUrl: ['']
    });
  }

  ngOnInit(): void {
    this.eventId = this.route.snapshot.paramMap.get('id');
    if (this.eventId) {
      this.isEditMode = true;
      this.loadEventData(this.eventId);
    }
  }

  loadEventData(id: string) {
    this.eventService.getEventById(id).subscribe(data => {
      // 1. Map API keys to Form Keys
      this.originalData = {
        title: data.eventTitle,
        description: data.eventDescription,
        startDate: this.formatDateForInput(data.startDate),
        endDate: this.formatDateForInput(data.endDate),
        address: data.address,
        contactNo: data.contactNo,
        emailId: data.emailId,
        webUrl: data.websiteUrl || ''
      };

      // 2. Fill Form
      this.form.patchValue(this.originalData);

      // 3. Show Image
      if (data.bannerImage) {
        this.imagePreview = data.bannerImage;
      }
    });
  }

  // --- ACTIONS ---

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      
      // Preview logic
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
     Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please fill all required fields correctly.',
        confirmButtonColor: '#ff6b00' // Match your orange theme
      });
      return;
    }

    if (this.isEditMode && this.eventId) {
      // UPDATE: Only send changed fields
      const changes = this.getChangedValues(this.form.value, this.originalData);

      if (Object.keys(changes).length === 0) {
Swal.fire('Info', 'No changes made.', 'info');
        return;
      }

     this.eventService.updateEvent(this.eventId, changes).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Updated!',
            text: 'Your Event has been updated successfully',
            showConfirmButton: false,
            timer: 2000
          }).then(() => this.router.navigate(['/events']));
        },
        error: (err) => Swal.fire('Error', 'Update Failed', 'error')
      });

    } else {
      if (!this.selectedFile) {
        Swal.fire('Image Required', 'Please upload a banner image.', 'warning');
        return;
      }

     this.eventService.createEvent(this.form.value, this.selectedFile).subscribe({
        next: () => {
          // Using the specific style from your screenshot
          Swal.fire({
            html: `
              <div class="py-4">
                <div class="mb-3">
                  <i class="bi bi-check-circle-fill text-success" style="font-size: 5rem;"></i>
                </div>
                <h4 class="fw-bold">Your Event has been Created successfully</h4>
              </div>
            `,
            showConfirmButton: false,
            timer: 2500,
            customClass: {
              popup: 'rounded-4'
            }
          }).then(() => this.router.navigate(['/events']));
        },
        error: (err) => Swal.fire('Error', 'Failed to create event', 'error')
      });
    }
  }

  // --- HELPERS ---

  private getChangedValues(formValue: any, originalValue: any): any {
    const changes: any = {};
    Object.keys(formValue).forEach(key => {
      if (formValue[key] !== originalValue[key]) {
        changes[key] = formValue[key];
      }
    });
    return changes;
  }



private formatDateForInput(isoDate: string): string {
  if (!isoDate) return '';
  const date = new Date(isoDate);
  
  // This creates the YYYY-MM-DDTHH:mm format required by datetime-local
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

  goBack() {
    this.location.back();
  }
}