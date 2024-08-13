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
  checkEmployeeExists(id: number): Observable<any> {
    const url = `${this.apiUrl}Employee/GetEmpployeeById?IdEmployee=${id}`;
    return this.http.get<any>(url);
  }
  checkUserExists(id: number): Observable<any> {
    const url = `${this.apiUrl}User/GetUserById?IdUser=${id}`;
    return this.http.get<any>(url);
  }
  addUser(user : UserGetModel ) : Observable<string> {
    return this.http.post<string>(`${this.apiUrl}User/AddUser`, user , { responseType: 'text' as 'json' })   }
}
