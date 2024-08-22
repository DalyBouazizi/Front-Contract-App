import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from '../../services/alert.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  
  alertCount: number = 0;

  constructor(private router: Router, private alertService: AlertService
    , private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.alertService.getAlertCount().subscribe(count => {
      this.alertCount = count;
      this.cdr.detectChanges(); // Manually trigger change detection
    });
  }
  logout() {
    // Remove the token from local storage
    localStorage.removeItem('authtoken');

    // Optionally, you might want to also invalidate the session on the server side
    // this.authService.logout().subscribe();

    // Redirect to the login page
    this.router.navigate(['/login']);
  }

}
