import { Component } from '@angular/core';
import { NavigationStateServiceService } from '../../services/navigation-state-service.service';
import { EmployeeGetModel } from '../../models/EmployeeGetModel.model';
import { ContractsModel } from '../../models/ContractsModel.model';
import { Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { ContractService } from '../../services/contract.service';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-contractrenewform',
  templateUrl: './contractrenewform.component.html',
  styleUrl: './contractrenewform.component.css'
})
export class ContractrenewformComponent {

  CombinedData: any = {};
 
  Employee : EmployeeGetModel = {id:0, nom: '', prenom: '', poste: '', adresse: '', dateNaissance: new Date(), lieuNaissance: '', cin: '', dateCin: new Date(), categoriePro: ''}; // Employee data
  Contracts: ContractsModel[] = [];
  FormValid: boolean | null = null; // Status of form validity check
  ContractTypes : string[] = ['CDI', 'CDD', 'CIVP',];
  Postes : string[] = ['Developer', 'Network administrator', 'Data analyst','...',];
  Catpro : string[] = ['HR', 'IT', 'CIT','FINANCE'];
  Contract : ContractsModel = { type:'', datedeb: new Date(), dateFin: new Date(), employeeId: 0}; // Contract data
  OldOne : ContractsModel = { type:'', datedeb: new Date(), dateFin: new Date(), employeeId: 0}; // Contract data
  id : number = -1;

 
  
constructor(
  private navigationStateService : NavigationStateServiceService,
   private employeeservice : EmployeeService, private router: Router, 
   private contractservice : ContractService ,
   private alerservice : AlertService
){

}

ngOnInit(): void {
  //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
  //Add 'implements OnInit' to the class.
  this.CombinedData = this.navigationStateService.getItemToRenew();
  console.log(this.CombinedData);

  this.Employee = this.CombinedData.employee;
  this.Contracts = this.CombinedData.contracts;
  this.OldOne = this.Contracts[0];
 


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
  console.log(this.Employee);
  console.log(this.Contract);
  this.Employee.salaireb = this.Contract.salaireb;
  this.Employee.salairen = this.Contract.salairen;
  
  if (this.Contract.type === 'CDI') {
    this.Contract.dateFin = new Date(2040, 1, 1); // January 1, 2040
  }

    if (this.isFormValid()){

      this.contractservice.Renewcontract( this.Employee.id, this.Contract).subscribe({
        next: (response :string) => {
         

          this.employeeservice.UpdateEmployee(this.Employee).subscribe({
            next: (response :string) => {
              
              console.log(this.OldOne.id);
              this.alerservice.deleteallalertforContractId(this.OldOne.id || 0).subscribe({
                next: (response :string) => {
                 
                },
                error: (error) => {
                 console.error('Error alert:', error.status);  // Log HTTP status code
                }
              })

              this.navigationStateService.setContRenewed(true);
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
