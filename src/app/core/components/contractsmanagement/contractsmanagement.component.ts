import { Component } from '@angular/core';
import { ContractService } from '../../services/contract.service';
import { ContractsModel } from '../../models/ContractsModel.model';
import { EmployeeModel } from '../../models/EmployeeModel.model';
import { EmployeeService } from '../../services/employee.service';
@Component({
  selector: 'app-contractsmanagement',
  templateUrl: './contractsmanagement.component.html',
  styleUrl: './contractsmanagement.component.css'
})
export class ContractsmanagementComponent {

  constructor(
    private contractService: ContractService, private employeeService: EmployeeService
  ) { }

  Contracts : ContractsModel[] = []; 

     CombinedData: { contract: ContractsModel, employee: EmployeeModel }[] = []; // New array to store combined data



  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    
    this.fetchContracts();
  }

 


  fetchContracts() {

    this.contractService.getContracts().subscribe(
      (contracts) => {
        this.Contracts = contracts;
        contracts.forEach(contract => {
          this.employeeService.getemployeebyrealid(contract.employeeId).subscribe(
            (employee) => {
              this.CombinedData.push({ contract, employee }); // Combine contract and employee data
            },
            (error) => {
              console.error(`Error fetching employee with ID ${contract.employeeId}:`, error);
            });});

      },
      (error) => {
        console.error(error);
      }
    );
  
  
  }

}
