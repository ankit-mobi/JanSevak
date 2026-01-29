import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ShuttleService } from '../shuttle-service';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-shuttle-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './shuttle-form.html',
  styleUrl: './shuttle-form.scss',
})
export class ShuttleForm implements OnInit {

  fb = inject(FormBuilder);
  route = inject(ActivatedRoute);
  router = inject(Router);
  location = inject(Location);
  shuttleService = inject(ShuttleService);

  form: FormGroup;
  isEditMode = false;
  routeId: string | null = null;

  constructor() {
    this.form = this.fb.group({
  name: ['', Validators.required],
  fromTime: ['', Validators.required],
  toTime: ['', Validators.required],
  operatingDays: ['Everyday', Validators.required],
  frequency: ['', Validators.required],
  stops: this.fb.array([])
});

  }

  get stopsArray() {
    return this.form.get('stops') as FormArray;
  }

  ngOnInit(): void {
    this.routeId = this.route.snapshot.paramMap.get('id');
    
    if (this.routeId) {
      this.isEditMode = true;
      this.loadRouteData(this.routeId);
    } else {
      // If new, add one empty stop by default
      this.addStop();
    }
  }


loadRouteData(id: string) {
    // FIX: Explicitly type 'data' as 'any' or 'ShuttleRoute' to stop the Array error
    this.shuttleService.getRouteById(id).subscribe((data: any) => {
      if (data) {
        
        // Note: If data is actually an array at runtime, grab the first item:
        // const routeData = Array.isArray(data) ? data[0] : data;
        const routeData = data; 
        
        this.form.patchValue({
  name: routeData.routeName,
  fromTime: routeData.serviceTimings?.split(' to ')[0],
  toTime: routeData.serviceTimings?.split(' to ')[1],
  operatingDays: routeData.operationalDays,
  frequency: routeData.frequency
});


        this.stopsArray.clear();
        // FIX: Add type '(stop: string)' to fix TS7006 error
        if (routeData.pickupAndDropPoints) {
            routeData.pickupAndDropPoints.forEach((stop: string) => this.addStop(stop));
        }
      }
    });
  }

  onSubmit() {
  if (this.form.valid) {

    const payload = {
      ...this.form.value,
      serviceTime: `${this.form.value.fromTime} to ${this.form.value.toTime}`
    };

    delete payload.fromTime;
    delete payload.toTime;

    const request = this.isEditMode && this.routeId
      ? this.shuttleService.updateRoute(this.routeId, payload)
      : this.shuttleService.createRoute(payload);

    request.subscribe({
      next: () => this.showSuccessPopup(),
      error: () => Swal.fire('Error', 'Something went wrong!', 'error')
    });

  } else {
    Swal.fire('Warning', 'Please fill all required fields', 'warning');
  }
}


  showSuccessPopup() {
    const actionText = this.isEditMode ? 'updated' : 'Created';
    
    Swal.fire({
      title: `<span style="font-size: 24px;">Your E-Riksha shuttle has been ${actionText} successfully</span>`,
      icon: 'success',
      iconColor: '#28a745', // Green color from your UI
      confirmButtonText: 'OK',
      confirmButtonColor: '#5cb85c',
      customClass: {
        popup: 'rounded-15', // You can style this in your SCSS
      },
      buttonsStyling: true,
      showConfirmButton: true,
      timer: 3000 // Optional: Auto-close after 3 seconds
    }).then(() => {
      this.router.navigate(['/shuttle']);
    });
  }


  addStop(value: string = '') {
    this.stopsArray.push(this.fb.control(value, Validators.required));
  }

  removeStop(index: number) {
    this.stopsArray.removeAt(index);
  }

  goBack() {
    this.location.back();
  }
}