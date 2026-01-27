import { CommonModule, Location } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../event-service';

@Component({
  selector: 'app-event-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './event-form.html',
  styleUrl: './event-form.scss',
})
export class EventForm implements OnInit{

  private fb = inject(FormBuilder)
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private location = inject(Location);
  private eventService = inject(EventService);

  form: FormGroup;
  isEditMode = false;
  eventId: string | null = null;

  // To handle file upload preview
  selectedFile: File | null = null;
  imagePreview: string | null = null;

// To track original data for "Partial Update" logic
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
    if(this.eventId){
      this.isEditMode = true;
      this.loadEventData(this.eventId);
    }
  }

  loadEventData(id: string) {
    this.eventService.getEventById(id).subscribe(data => {
      // 1. Store original data (mapped to form keys)
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

      // 2. Patch form
      this.form.patchValue(this.originalData);

      // 3. Show existing image
      if (data.bannerImage) {
        // Assuming backend sends full path or relative path
        this.imagePreview = data.bannerImage; 
      }
    });
  }

  // Helper: Convert ISO string (2026-01-25T10...) to Input format (2026-01-25)
  private formatDateForInput(isoDate: string): string {
    if (!isoDate) return '';
    return isoDate.split('T')[0];
  }

  // Handle File Selection
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

onSubmit() {
    // 1. DEBUG: Check if form is invalid
    if (this.form.invalid) {
      console.log('Form is invalid:', this.form.errors);
      // Log specific controls to see which one is failing
      Object.keys(this.form.controls).forEach(key => {
        const controlErrors = this.form.get(key)?.errors;
        if (controlErrors) {
          console.log(`Key: ${key}, Errors:`, controlErrors);
        }
      });
      
      this.form.markAllAsTouched();
      alert('Please check the form for errors (e.g., 10-digit phone number)');
      return;
    }

    if (this.isEditMode && this.eventId) {
      // --- UPDATE LOGIC ---
      
      // 1. Get changed values (These use Form Keys: title, description...)
      const formChanges = this.getChangedValues(this.form.value, this.originalData);
      
      if (Object.keys(formChanges).length === 0 && !this.selectedFile) {
        alert('No changes made.');
        return;
      }

      // 2. MAP KEYS: Convert Form Keys -> Backend Keys
      const apiPayload: any = {};

      // Loop through changes and rename keys if necessary
      Object.keys(formChanges).forEach(key => {
        if (key === 'title') apiPayload['eventTitle'] = formChanges[key];
        else if (key === 'description') apiPayload['eventDescription'] = formChanges[key];
        else if (key === 'webUrl') apiPayload['websiteUrl'] = formChanges[key];
        else apiPayload[key] = formChanges[key]; // Other keys (address, contactNo) match
      });

      console.log('Sending Update Payload:', apiPayload);

      this.eventService.updateEvent(this.eventId, apiPayload).subscribe({
        next: () => {
          alert('Event Updated Successfully');
          this.router.navigate(['/events']);
        },
        error: (err) => console.error('Update Error:', err)
      });

    }else {
    if (!this.selectedFile) {
      alert('Please select a banner image');
      return;
    }

    // Pass the form value to the service
    this.eventService.createEvent(this.form.value, this.selectedFile).subscribe({
      next: () => {
        alert('Event Created Successfully');
        this.router.navigate(['/events']);
      },
      error: (err) => {
        // IMPROVED ERROR HANDLING:
        // This will extract the specific Mongoose error string you see in the console
        const errorMessage = err.error?.error || err.message || 'Server Error';
        alert('Failed to create event: ' + errorMessage);
        console.error('Full Error Object:', err);
      }
    });
  }
}

private getChangedValues(formValue: any, originalValue: any): any {
    const changes: any = {};
    Object.keys(formValue).forEach(key => {
      if (formValue[key] !== originalValue[key]) {
        changes[key] = formValue[key];
      }
    });
    return changes;
  }

  goBack() {
    this.location.back();
  }


}
