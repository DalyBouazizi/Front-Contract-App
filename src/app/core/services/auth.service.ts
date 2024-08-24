import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserLoginModel } from '../models/UserLoginModel.model';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  apiUrl  = "http://localhost:5008/api/";

  constructor(private http: HttpClient, private jwtHelper: JwtHelperService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  Login(userLogin: UserLoginModel): Observable<{ token: string }> {
    const url = `${this.apiUrl}User/Login?Matricule=${userLogin.matricule}&Password=${userLogin.password}`;
    return this.http.post<{ token: string }>(url, { responseType: 'text' as 'json' });
  }

  isAuthenticated(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('authtoken');
      if (!token) {
        return false;
      }
      return !this.jwtHelper.isTokenExpired(token);
    }
    return false;
  }
}
