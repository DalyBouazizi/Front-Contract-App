import { Component } from '@angular/core';
import { UserLoginModel } from '../../models/UserLoginModel.model';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  constructor(private authService: AuthService) { }
  user: UserLoginModel = { };

  login() {
    this.authService.Login(this.user).subscribe(
      response => {
        if (response && response.token) {
          localStorage.setItem('authtoken', response.token);
        }
      },
      error => {
        console.error('Login failed', error);
      }
    );
  }
}
