import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserGetModel } from '../models/UserGetModel.model';

@Injectable({
  providedIn: 'root'
})
export class UserserviceService {

  constructor(private http :  HttpClient) {

   }
    apiUrl  = "http://localhost:5008/api/";

    // Get all users
  getUsers(): Observable<UserGetModel[]> {
    return this.http.get<UserGetModel[]>(`${this.apiUrl}User/GetAllUsers`);
  }
}
