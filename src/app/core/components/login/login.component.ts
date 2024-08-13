import { Component } from '@angular/core';
import { UserLoginModel } from '../../models/UserLoginModel.model';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  user: UserLoginModel = { password : ''};

}
