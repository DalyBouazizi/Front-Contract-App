import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserGetModel } from '../models/UserGetModel.model';
import { EmployeeModel } from '../models/EmployeeModel.model';

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
  checkEmployeeExists(id: number): Observable<EmployeeModel> {
    const url = `${this.apiUrl}Employee/GetEmpployeeById?IdEmployee=${id}`;
    return this.http.get<EmployeeModel>(url);
  }
  checkUserExists(id: number): Observable<any> {
    const url = `${this.apiUrl}User/GetUserById?IdUser=${id}`;
    return this.http.get<any>(url);
  }
  deleteUser(id: number): Observable<string> {
    const url = `${this.apiUrl}User/DeleteUser?IdUser=${id}`;
    return this.http.delete<string>(url,  { responseType: 'text' as 'json' });
  }
  addUser(user : UserGetModel ) : Observable<string> {
    return this.http.post<string>(`${this.apiUrl}User/AddUser`, user , { responseType: 'text' as 'json' })   }
}
