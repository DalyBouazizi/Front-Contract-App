import { Component } from '@angular/core';
import { NavigationStateServiceService } from '../../services/navigation-state-service.service';
import { EmployeeGetModel } from '../../models/EmployeeGetModel.model';
import { ContractsModel } from '../../models/ContractsModel.model';
import { Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { ContractService } from '../../services/contract.service';

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
  id : number = -1;
  
constructor(
  private navigationStateService : NavigationStateServiceService, private employeeservice : EmployeeService, private router: Router, private contractservice : ContractService 
){

}

ngOnInit(): void {
  //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
  //Add 'implements OnInit' to the class.
  this.CombinedData = this.navigationStateService.getItemToRenew();
  this.Employee = this.CombinedData.employee;
  this.Contracts = this.CombinedData.contract;
  console.log(this.Employee);
  
  console.log(this.Contracts);

  this.Contracts.forEach(contract => console.log(contract.type));
  this.FormValid = false;
}

isFormValid(): boolean {
  return this.Employee.salaireb !== null && 
  this.Employee.salaireb !== undefined &&
  this.Employee.salairen !== null &&
  this.Employee.salairen !== undefined &&
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
  console.log(this.isFormValid());

    if (this.isFormValid()){

      this.contractservice.Renewcontract( this.Employee.id, this.Contract).subscribe({
        next: (response :string) => {
         

          this.employeeservice.UpdateEmployee(this.Employee).subscribe({
            next: (response :string) => {
              


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
