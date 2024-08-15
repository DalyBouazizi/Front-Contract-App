import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserLoginModel } from '../models/UserLoginModel.model';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt'; // Import JwtHelperService

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  apiUrl  = "http://localhost:5008/api/"

  constructor(private http : HttpClient, private jwtHelper : JwtHelperService) { }


  Login(userLogin: UserLoginModel): Observable<{ token: string  }> {
    const url = `${this.apiUrl}User/Login?Matricule=${userLogin.matricule}&Password=${userLogin.password}`;
    return this.http.post<{ token: string  }>(url, { responseType: 'text' as 'json' });



}


isAuthenticated(): boolean {
  if (typeof window !== 'undefined') {
  const Mytoken =  localStorage.getItem('authtoken') ;
  if (!Mytoken) {
    // Token does not exist
    return false;
  }

  return !this.jwtHelper.isTokenExpired(Mytoken);
}else{
  return false; 
}
}
}
