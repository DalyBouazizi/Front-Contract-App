import { Component } from '@angular/core';
import { UserLoginModel } from '../../models/UserLoginModel.model';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'] // Corrected from 'styleUrl' to 'styleUrls'
})
export class LoginComponent {

  constructor(private authService: AuthService, private router: Router) { }
  user: UserLoginModel = { };
  FailedLogin: string | null = null;

  login() {
    this.authService.Login(this.user).subscribe(
      response => {
        if (response && response.token) {
          localStorage.setItem('authtoken', response.token);
          this.router.navigate(['/dashboard']); // Redirect to the dashboard
        }
      },
      error => {
        console.log(error.error.message);

        // Check the type of the error message and update FailedLogin accordingly
        if (typeof error.error.message=== 'string') {
          if (error.error.message.includes('Password')) {
            this.FailedLogin = 'Incorrect password.';
          } else if (error.error.message.includes('User')) {
            this.FailedLogin = 'User not found.';
          } else {
            this.FailedLogin = 'Login failed. Please try again.';
          }
        } else {
          this.FailedLogin = 'An unexpected error occurred. Please try again later.';
        }
      }
    );
  }
}
