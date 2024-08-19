import { Component } from '@angular/core';
import { ContractService } from '../../services/contract.service';
import { EmployeeService } from '../../services/employee.service';
import { EmployeeGetModel } from '../../models/EmployeeGetModel.model';
import { exit } from 'process';

@Component({
  selector: 'app-contractaddform',
  templateUrl: './contractaddform.component.html',
  styleUrl: './contractaddform.component.css'
})
export class ContractaddformComponent {

  constructor(
    private contractService: ContractService, private employeeService: EmployeeService
  ) { }

  employeeExists: boolean | null = null; // Status of employee existence check
 ContractExists: boolean | null = null; // Status of employee existence check



  CheckValidity(event: any): void {
    const id = event.target.value;
   
   if (id) {
   
      this.employeeService.checkEmployeeExistsID(Number(id)).subscribe({
        next: (response) => {
          
          this.employeeExists = true; 
        
          this.contractService.GetContractByEmployeeId(response.id).subscribe({
            next: (response) => {
              
                this.ContractExists = true;
                console.log(response);
              
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


}
