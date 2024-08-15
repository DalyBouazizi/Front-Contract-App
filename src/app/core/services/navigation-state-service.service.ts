import { Injectable } from '@angular/core';
import { EmployeeModel } from '../models/EmployeeModel.model';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class NavigationStateServiceService {

  constructor() { }
  private addedUser: boolean = false;
  private addedEmp: boolean = false;
  private UpdatedEmp: boolean = false;
  private employeeToUpdate: EmployeeModel = {  nom: '', prenom: '', poste: '', adresse: '', dateNaissance: new Date(), lieuNaissance: '', cin: '', dateCin: new Date(), categoriePro: '' };

  setUserAdded(state: boolean) {
    this.addedUser = state;}

  isUserAdded(): boolean {
    return this.addedUser;}

  setEmpAdded(state: boolean) {
    this.addedEmp = state;}

  isEmpAdded(): boolean {
    return this.addedEmp;}

  setEmpUpdated(state: boolean) {
    this.UpdatedEmp = state;}

  isEmpUpdated(): boolean {
    return this.UpdatedEmp;}


    setEmployeeToUpdate(employee: EmployeeModel) {
      this.employeeToUpdate = employee;
    }
   
    getEmployeeToUpdate(): EmployeeModel {
      return this.employeeToUpdate;
    }

   

}
