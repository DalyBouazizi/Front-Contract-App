import { Component } from '@angular/core';
import { ContractService } from '../../services/contract.service';
import { ContractsModel } from '../../models/ContractsModel.model';
import { EmployeeModel } from '../../models/EmployeeModel.model';
import { EmployeeService } from '../../services/employee.service';
import { NavigationStateServiceService } from '../../services/navigation-state-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { Router } from '@angular/router';
import { EmployeeGetModel } from '../../models/EmployeeGetModel.model';
@Component({
  selector: 'app-contractsmanagement',
  templateUrl: './contractsmanagement.component.html',
  styleUrl: './contractsmanagement.component.css'
})
export class ContractsmanagementComponent {

  constructor(
    private contractService: ContractService, private employeeService: EmployeeService, private navigationStateService: NavigationStateServiceService,
    public dialog: MatDialog, private snackBar: MatSnackBar,private router: Router
    
  ) { }

  Contracts : ContractsModel[] = []; 

     CombinedData: { contract: ContractsModel, employee: EmployeeGetModel }[] = []; // New array to store combined data



  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    
    this.fetchContracts();
    if (this.navigationStateService.isContAdded()) {
      console.log('here')
       this.snackBar.open('Employee added successfully!', 'Close', {
         duration: 6000,
         verticalPosition: 'top',
         panelClass: ['success-snackbar']
       });
       this.navigationStateService.setEmpAdded(false); // Reset state
      }
      if (this.navigationStateService.isContRenewed()) {
        console.log('here')
         this.snackBar.open('Contract renewed successfully!', 'Close', {
           duration: 6000,
           verticalPosition: 'top',
           panelClass: ['success-snackbar']
         });
         this.navigationStateService.setContRenewed(false); // Reset state
        }
  }

 


  fetchContracts() {

    this.contractService.getLatestContracts().subscribe(
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

  
deleteContract(idcontract: number) {
  const dialogRef = this.dialog.open(ConfirmDialogComponent);

  dialogRef.afterClosed().subscribe(result => {
    if (result){
          this.contractService.deleteContract(idcontract)
          .subscribe({
            next: (response :string) => {
              
                this.snackBar.open('Contract deleted successfully!', 'Close', {
                  duration: 3000,verticalPosition: 'top', panelClass:['success-snackbar'], });
                  this.CombinedData = [];
                  this.fetchContracts();
              this.router.navigate(['/ContractsManagement']);
              
              
              // this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
              //   dtInstance.clear(); // Clear the table
              //   dtInstance.rows.add(this.emps); // Add the filtered data
      
              //   dtInstance.draw(); // Redraw the table
              // });
      
            },
          error: (error) => {
            console.error('Error status:', error.status);  // Log HTTP status code
            console.error('Error message:', error.message); // Log error message
            
          } })} });}


          navigateToRenew(item :any) {
            
            const convertedItem = {
              contracts: [item.contract], // Convert single contract to an array of contracts
              employee: item.employee
          };
            this.navigationStateService.setItemToRenew(convertedItem);
            this.router.navigate(['/ContractRenew']);
          }
          
}
