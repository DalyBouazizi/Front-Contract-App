import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  
  constructor(private router: Router) { } 
  logout() {
    // Remove the token from local storage
    localStorage.removeItem('authtoken');

    // Optionally, you might want to also invalidate the session on the server side
    // this.authService.logout().subscribe();

    // Redirect to the login page
    this.router.navigate(['/login']);
  }

}
