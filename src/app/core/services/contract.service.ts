import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EmployeeModel } from '../models/EmployeeModel.model';
import { Observable } from 'rxjs';
import { ContractsModel } from '../models/ContractsModel.model';

@Injectable({
  providedIn: 'root'
})
export class ContractService {

  constructor(private http :  HttpClient) { }

  apiUrl  = "http://localhost:5008/api/Contract/";

  getContracts(): Observable<ContractsModel[]> {
    return this.http.get<ContractsModel[]>(`${this.apiUrl}GetAllContracts`);
  }
  GetContractByEmployeeId(id : number): Observable<ContractsModel[]> {
    return this.http.get<ContractsModel[]>(`${this.apiUrl}GetContractByEmployeeId?EmployeeId=${id}`);
  }

  addContract(contract : ContractsModel ) : Observable<string> {
    return this.http.post<string>(`${this.apiUrl}AddContract`, contract , { responseType: 'text' as 'json' })   }
}
