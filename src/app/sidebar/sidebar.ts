import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})

export class Sidebar {

private router = inject(Router);

isCollapsed = signal(false);
showMobileMenu = signal(false);

toggleCollapse(){
  this.isCollapsed.update(val => !val);
}

toggleMobile(){
  this.showMobileMenu.update(val => !val);
}

logout(){
  localStorage.removeItem('authToken');
  this.router.navigate(['/login']);
}

}
