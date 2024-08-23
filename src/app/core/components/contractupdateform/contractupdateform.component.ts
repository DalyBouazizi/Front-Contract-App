import { Component } from '@angular/core';
import { NavigationStateServiceService } from '../../services/navigation-state-service.service';
import { EmployeeService } from '../../services/employee.service';
import { Router } from '@angular/router';
import { ContractService } from '../../services/contract.service';
import { EmployeeGetModel } from '../../models/EmployeeGetModel.model';
import { ContractsModel } from '../../models/ContractsModel.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-contractupdateform',
  templateUrl: './contractupdateform.component.html',
  styleUrl: './contractupdateform.component.css'
})
export class ContractupdateformComponent {

  CombinedData: any = {};
 
  Employee : EmployeeGetModel = {id:0, nom: '', prenom: '', poste: '', adresse: '', dateNaissance: new Date(), lieuNaissance: '', cin: '', dateCin: new Date(), categoriePro: ''}; // Employee data
  Contracts: ContractsModel[] = [];
  FormValid: boolean | null = null; // Status of form validity check
  ContractTypes : string[] = ['CDI', 'CDD', 'CIVP',];
  Postes : string[] = ['Developer', 'Network administrator', 'Data analyst','...',];
  Catpro : string[] = ['HR', 'IT', 'CIT','FINANCE'];
  Contract : ContractsModel = { type:'', datedeb: new Date(), dateFin: new Date(), employeeId: 0}; // Contract data
  id : number = -1;
  formattedDateDeb = '';
  formattedDateFin = '';
  
constructor(
  private navigationStateService : NavigationStateServiceService, private employeeservice : EmployeeService, private router: Router,
   private contractservice : ContractService ,private datePipe: DatePipe,
){

}

ngOnInit(): void {
  //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
  //Add 'implements OnInit' to the class.
 

  this.CombinedData = this.navigationStateService.getContractToUpdate();
  this.Employee = this.CombinedData.employee;
  this.Contracts = this.CombinedData.contract;
  this.loadData(this.Employee.id);
 
  this.Contract = this.Contracts[0];
  this.formattedDateDeb = this.datePipe.transform(this.Contract.datedeb, 'yyyy-MM-dd') || '';
  this.formattedDateFin = this.datePipe.transform(this.Contract.dateFin, 'yyyy-MM-dd') || '';
  this.FormValid = false;
}

isFormValid(): boolean {
  return this.Contract.salaireb !== null && 
  this.Contract.salaireb !== undefined &&
  this.Contract.salairen !== null &&
  this.Contract.salairen !== undefined &&
  this.Employee.poste !== '' &&
  this.Employee.categoriePro !== '' &&
  this.Contract.type !== '' &&
  this.Contract.datedeb !== null &&
  this.Contract.dateFin !== null;
  

}
loadData(id:number){
  this.contractservice.GetLatestContractByEmpid(id).subscribe({
    next: (response) => {
      this.Contract = response;
      
    },
    error: (error) => {
      console.error('Error status:', error.status);  // Log HTTP status code
      console.error('Error message:', error.message); // Log error message
    }
  });
}
// clearinput(){
  
//   this.Employee.poste = '';
//   this.Employee.categoriePro = '';
//   this.Employee.salaireb = 0;
//   this.Employee.salairen = 0;
//   this.Contract.type = '';
//   this.Contract.datedeb = new Date();
//   this.Contract.dateFin = new Date();
// }
onsubmit() {
  this.Employee.salaireb = this.Contract.salaireb;
  this.Employee.salairen = this.Contract.salairen;
  this.Contract.datedeb = new Date(this.formattedDateDeb);
  this.Contract.dateFin = new Date(this.formattedDateFin);

  if (this.Contract.type === 'CDI') {
    this.Contract.dateFin = new Date(2040, 0, 1); // January 1, 2040
  }


    if (this.isFormValid()){

      this.contractservice.UpdateContract(this.Contract).subscribe({
        next: (response :string) => {
         

          this.employeeservice.UpdateEmployee(this.Employee).subscribe({
            next: (response :string) => {
              


              this.navigationStateService.setContUpdated(true);
              this.router.navigate(['/ContractsManagement']);
      
            },
            error: (error) => {
              console.error('Error status:', error.status);  // Log HTTP status code
              console.error('Error message:', error.message); // Log error message
            }
          })

         
        },
        error: (error) => {
          console.error('Error status:', error.status);  // Log HTTP status code
          console.error('Error message:', error.message); // Log error message
        }
      });



   
    
    }else{
      console.log('Form is not valid');
      this.FormValid = false;
}

}





}
