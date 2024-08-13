import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserLoginModel } from '../models/UserLoginModel.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  apiUrl  = "http://localhost:5008/api/"

  constructor(private http : HttpClient) { }

 
  Login(userLogin: UserLoginModel): Observable<{ token: string }> {
    const url = `${this.apiUrl}User/Login?Matricule=${userLogin.matricule}&Password=${userLogin.password}`;
    return this.http.post<{ token: string }>(url, { responseType: 'text' as 'json' });
}
}
