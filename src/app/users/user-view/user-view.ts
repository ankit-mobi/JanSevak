import { CommonModule, DatePipe, Location } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { User, UserService } from '../user-service';

@Component({
  selector: 'app-user-view',
  imports: [CommonModule, DatePipe],
  templateUrl: './user-view.html',
  styleUrl: './user-view.scss',
})
export class UserView implements OnInit {
  private route = inject(ActivatedRoute);
  private location = inject(Location);
  private userService = inject(UserService);

  user = signal<User | undefined>(undefined);
  isLoading = signal<boolean>(true);

  ngOnInit(): void {
    const uid = this.route.snapshot.paramMap.get('uid');
    
    if (uid) {
      // Use forkJoin to run both requests in parallel
      forkJoin({
        userDetails: this.userService.getUserDetails(uid),
        userComplaints: this.userService.getUserComplaints(uid)
      }).subscribe({
        next: (results) => {
          // Merge the results
          const finalUser: User = {
            ...results.userDetails,
            complaints: results.userComplaints
          };
          
          this.user.set(finalUser);
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('Error fetching user data', err);
          this.isLoading.set(false);
        }
      });
    }
  }

  goBack(){
    this.location.back();
  }
}