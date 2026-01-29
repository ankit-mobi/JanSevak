import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
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

onLinkClick() {
  // If we are on a small screen, close the mobile menu after clicking a link
  if (window.innerWidth <= 768) {
    this.showMobileMenu.set(false); // or however you update your state
  }
}

}
