import { Injectable } from '@angular/core';
import { EmployeeModel } from '../models/EmployeeModel.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private http :  HttpClient) {

  }
   apiUrl  = "http://localhost:5008/api/";

   // Get all users
 getEmployees(): Observable<EmployeeModel[]> {
   return this.http.get<EmployeeModel[]>(`${this.apiUrl}Employee/GetAllEmployees`);
 }
//  GetEmployeesByPoste(poste : string): Observable<EmployeeModel[]> {
//    return this.http.get<EmployeeModel[]>(`${this.apiUrl}Employee/GetEmployeesByPoste?role=${poste}`);
//  }
 checkEmployeeExists(id: number): Observable<EmployeeModel> {
   const url = `${this.apiUrl}Employee/GetEmpployeeById?IdEmployee=${id}`;
   return this.http.get<EmployeeModel>(url);
 }
 checkCinEmployeeExists(Cin: number): Observable<EmployeeModel> {
  const url = `${this.apiUrl}Employee/GetEmpployeeByCin?Cin=${Cin}`;
  return this.http.get<EmployeeModel>(url);
}
 deleteEmployee(id: number): Observable<string> {
   const url = `${this.apiUrl}Employee/DeleteEmployee?IdEmployee=${id}`;
   return this.http.delete<string>(url,  { responseType: 'text' as 'json' });
 }
 addUser(employee : EmployeeModel ) : Observable<string> {
   return this.http.post<string>(`${this.apiUrl}Employee/AddEmployee`, employee , { responseType: 'text' as 'json' })   }
 UpdateEmployee(employee : EmployeeModel ) : Observable<string> {
   return this.http.put<string>(`${this.apiUrl}Employee/Updateemployee`, employee , { responseType: 'text' as 'json' })   }

  fetchFilteredEmployees(filterCriteria: any): Observable<EmployeeModel[]> {
    return this.http.get<EmployeeModel[]>(`${this.apiUrl}Employee/filter`, { params: filterCriteria });
  }
}
  
