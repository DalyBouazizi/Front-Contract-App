import { Component } from '@angular/core';
import { ContractService } from '../../services/contract.service';
import { EmployeeService } from '../../services/employee.service';
import { EmployeeGetModel } from '../../models/EmployeeGetModel.model';
import { DatePipe } from '@angular/common';
import { ContractsModel } from '../../models/ContractsModel.model';
import { Router } from '@angular/router';
import { NavigationStateServiceService } from '../../services/navigation-state-service.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-contractaddform',
  templateUrl: './contractaddform.component.html',
  styleUrl: './contractaddform.component.css'
})
export class ContractaddformComponent {

  constructor(
    private contractService: ContractService, private employeeService: EmployeeService,
    private datePipe: DatePipe,private router: Router, private navigationStateService: NavigationStateServiceService,public dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) { }

  employeeExists: boolean | null = null; // Status of employee existence check
 ContractExists: boolean | null = null; // Status of employee existence check
 FormValid: boolean | null = null; // Status of form validity check
 formattedDateNaissance = '';
 formattedDateCin = '';
 Employee : EmployeeGetModel = {id:0, nom: '', prenom: '', poste: '', adresse: '', dateNaissance: new Date(), lieuNaissance: '', cin: '', dateCin: new Date(), categoriePro: ''}; // Employee data
Contract : ContractsModel = { type:'', datedeb: new Date(), dateFin: new Date(), employeeId: 0}; // Contract data
CombinedData: any = {};
ContractTypes : string[] = ['CDI', 'CDD', 'CIVP',]; // Contract types for dropdown

  CheckValidity(event: any): void {
    const id = event.target.value;
   
   if (id) {
   
      this.employeeService.checkEmployeeExistsID(Number(id)).subscribe({
        next: (response) => {
          this.Employee = response;
          this.Employee.salaireb = undefined;
          this.Employee.salairen = undefined;
          this.employeeExists = true; 
            // Transform dates using DatePipe
     this.formattedDateNaissance = this.datePipe.transform(this.Employee.dateNaissance, 'yyyy-MM-dd') || '';
     this.formattedDateCin = this.datePipe.transform(this.Employee.dateCin, 'yyyy-MM-dd') || '';
        
          this.contractService.GetContractByEmployeeId(response.id).subscribe({
            next: (response) => {
            this.CombinedData.employee =this.Employee
            this.CombinedData.contract = response;
            console.log(this.CombinedData);
                this.ContractExists = true;
          
              
            },
            error: (error) => {
              this.ContractExists = false;
            }
          });
          
        },
        error: (error) => {
          this.ContractExists = null; // Reset contract existence check
          this.employeeExists = false; // Assume employee does not exist if error occurs
        }
      });
    } else {
      this.employeeExists = null; // Clear status if input is empty
      this.ContractExists = null;
    }
  

}

clearinput(){
  this.Employee.nom = '';
  this.Employee.prenom = '';
  this.Employee.poste = '';
  this.Employee.adresse = '';
  this.Employee.dateNaissance = new Date();
  this.Employee.lieuNaissance = '';
  this.Employee.cin = '';
  this.Employee.dateCin = new Date();
  this.Employee.categoriePro = '';



}

isFormValid(): boolean {
  return this.Contract.salaireb !== null && 
  this.Contract.salaireb !== undefined &&
  this.Contract.salairen !== null &&
  this.Contract.salairen !== undefined &&
  this.Contract.type.trim() !== '' &&
  this.Contract.datedeb !== null &&  
  this.Contract.datedeb !== undefined &&
  this.Contract.dateFin !== null &&  
  this.Contract.dateFin !== undefined;
}


onFormSubmit(){
  this.Employee.dateNaissance = new Date(this.formattedDateNaissance);
  this.Employee.dateCin = new Date(this.formattedDateCin);
  this.Employee.salaireb = this.Contract.salaireb;
  this.Employee.salairen = this.Contract.salairen;
  if (this.isFormValid()){
  this.employeeService.UpdateEmployee(this.Employee)
  .subscribe({
    next: (response :string) => {
     

      this.Contract.employeeId = this.Employee.id;
      this.contractService.addContract(this.Contract).subscribe({
        next: (response) => {
           this.navigationStateService.setContAdded(true);
      this.router.navigate(['/ContractsManagement'] , { state: { added: true } });
        },
        error: (error) => {
          console.error('Error status from Contract:', error.status);  // Log HTTP status code
          console.error('Error message:', error.message); // Log error message
        }
      });
      // this.navigationStateService.setEmpAdded(true);
      // this.router.navigate(['/EmployeeCP'] , { state: { added: true } });

    },
    error: (error) => {
      console.error('Error status From Employee:', error.status);  // Log HTTP status code
      console.error('Error message:', error.message); // Log error message
    }
  })
  }else{
    // Handle the case where the form is not valid
    this.FormValid = false;
}
}
navigateToRenew() {
  this.navigationStateService.setItemToRenew(this.CombinedData);
  this.router.navigate(['/ContractRenew']);
}




}
