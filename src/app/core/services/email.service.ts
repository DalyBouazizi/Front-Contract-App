import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ContractsModel } from '../models/ContractsModel.model';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor(private http: HttpClient) {
   }


   ContractsApiUrl = 'http://localhost:5008/api/Contract/';
   EmployeeApiUrl = 'http://localhost:5008/api/Employee/';
   EmailApiUrl = 'http://localhost:5008/api/Employee/';



  // Method to get contracts ending in one month
  getContractsEndingInOneMonth(): Observable<ContractsModel[]> {
    return this.http.get<ContractsModel[]>(`${this.ContractsApiUrl}GetContractsEndingInOneMonth`);
  }

  // Method to send an email
  sendEmail(to: string, subject: string, body: string): Observable<any> {
    const payload = {
      to,
      subject,
      body
    };
    return this.http.post(`${this.EmailApiUrl}/SendEmail`, payload);
  }

}
