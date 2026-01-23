import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})

export class Sidebar {
// adminName: string = 'Ankit Baghel';
// menuItems: string[] = ['Dashboard', 'Users', 'Settings', 'Logout'];

private router = inject(Router);

logout(){
  localStorage.removeItem('authToken');
  this.router.navigate(['/login']);
}
}
