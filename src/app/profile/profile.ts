import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Location } from '@angular/common';

@Component({
  selector: 'app-profile',
  imports: [FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {

  private location = inject(Location);

  profile = {
    name: '',
    email: '',
    phone: '',
    bio: ''
  };


  goBack() {
    this.location.back();
  }

}
