import { Component, Inject } from '@angular/core';
import { EmployeeModel } from '../../models/EmployeeModel.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EmployeeService } from '../../services/employee.service';
import { ContractService } from '../../services/contract.service';

@Component({
  selector: 'app-employee-detail-dialog',
  templateUrl: './employee-detail-dialog.component.html',
  styleUrl: './employee-detail-dialog.component.css'
})
export class EmployeeDetailDialogComponent {

  employeeData: any; // Define a property to hold the fetched data
  Contracts : any[] = [];


  constructor( public dialogRef: MatDialogRef<EmployeeDetailDialogComponent> ,@Inject(MAT_DIALOG_DATA) public data: EmployeeModel,private employeeService: EmployeeService, private contractservice : ContractService ){};// Inject the service) {}

  ngOnInit(): void {
    this.getContracts();
  }
  getContracts(): void {
    this.employeeService.getemployeebyid(this.data.matricule as number).subscribe(
      (response) => {
        this.employeeData = response;
        console.log(this.employeeData);

        this.contractservice.GetContractByEmployeeId(this.employeeData.id).subscribe(
          (response) => {
            
            this.Contracts = response;
            console.log(this.Contracts);
          },
          (error) => {
            console.error('Error fetching contract data', error);
          }
        );

      },
      (error) => {
        console.error('Error fetching employee data', error);
      }
    );
  }

  calculateDuration(startDate: string, endDate: string): string {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const durationInMilliseconds = end.getTime() - start.getTime();
    const durationInDays = durationInMilliseconds / (1000 * 3600 * 24);
    return `${durationInDays} days`;
  }
  onClose(): void {
    this.dialogRef.close();
  }

}
