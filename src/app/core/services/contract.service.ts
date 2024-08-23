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
  getLatestContracts(): Observable<ContractsModel[]> {
    return this.http.get<ContractsModel[]>(`${this.apiUrl}GetAllLatestContracts`);
  }
  GetContractByEmployeeId(id : number): Observable<ContractsModel[]> {
    return this.http.get<ContractsModel[]>(`${this.apiUrl}GetContractByEmployeeId?EmployeeId=${id}`);
  }
  GetContractsByEndingThisMonth(): Observable<ContractsModel[]> {
    return this.http.get<ContractsModel[]>(`${this.apiUrl}GetContractsEndingInOneMonth`);
  }
  GetContractByContractId(id : number): Observable<ContractsModel> {
    return this.http.get<ContractsModel>(`${this.apiUrl}GetContractById?idContract=${id}`);
  }
  GetLatestContractByEmpid(id : number): Observable<ContractsModel> {
    return this.http.get<ContractsModel>(`${this.apiUrl}GetLatestByEmpId?EmployeeID=${id}`);
  }

  addContract(contract : ContractsModel ) : Observable<string> {
    return this.http.post<string>(`${this.apiUrl}AddContract`, contract , { responseType: 'text' as 'json' })   }

  UpdateContract(contract : ContractsModel ) : Observable<string> {
    return this.http.put<string>(`${this.apiUrl}UpdateContract`, contract , { responseType: 'text' as 'json' })   }

  Renewcontract(employeeId: number, newContract: ContractsModel ) : Observable<any> {
    const payload = {
      employeeId: employeeId,
      newContract: newContract
    };
    console.log(payload);
    return this.http.post<string>(`${this.apiUrl}RenewContract`, payload , { responseType: 'text' as 'json' })   }

    deleteContract(id: number): Observable<string> {
      const url = `${this.apiUrl}DeleteContract?IdContract=${id}`;
      return this.http.delete<string>(url,  { responseType: 'text' as 'json' });
}
    deleteAllContracts(id: number): Observable<string> {
      const url = `${this.apiUrl}DeleteAllContractsByEmployeeId?employeeId=${id}`;
      return this.http.delete<string>(url,  { responseType: 'text' as 'json' });
}
}