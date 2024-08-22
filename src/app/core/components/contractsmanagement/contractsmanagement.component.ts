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
import { error } from 'node:console';
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
  today = new Date();


  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    
    this.fetchContracts();
    
    if (this.navigationStateService.isContAdded()) {
     
       this.snackBar.open('Employee added successfully!', 'Close', {
         duration: 6000,
         verticalPosition: 'top',
         panelClass: ['success-snackbar']
       });
       this.navigationStateService.setContAdded(false); // Reset state
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
        if (this.navigationStateService.isContUpdated()) {
          console.log('here')
           this.snackBar.open('Contract renewed successfully!', 'Close', {
             duration: 6000,
             verticalPosition: 'top',
             panelClass: ['success-snackbar']
           });
           this.navigationStateService.setContUpdated(false); // Reset state
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

  
deleteContract(idcontract: number , idemployee: number) {
  const dialogRef = this.dialog.open(ConfirmDialogComponent);

  dialogRef.afterClosed().subscribe(result => {
    if (result){
          this.contractService.deleteContract(idcontract)
          .subscribe({
            next: (response :string) => {

              this.employeeService.getemployeebyrealid(idemployee).subscribe(
                (employee) => {
                    employee.salaireb = undefined;
                    employee.salairen = undefined;

                    this.employeeService.UpdateEmployee(employee).subscribe({
                      next: (response) => {
                        
                      },
                      error: (error) => {
                        
                      }
                    });

                },error => {

                });
              
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
          navigateToUpdate(item :any) {
            const convertedItem = {
              contracts: [item.contract], // Convert single contract to an array of contracts
              employee: item.employee
          };
            
            this.navigationStateService.setContractToUpdate(convertedItem);
            this.router.navigate(['/ContractUpdate']);
          }



          getContractColorClass(endDate: Date): string {
            const contractEndDate = new Date(endDate);
            const timeDiff = contractEndDate.getTime() - this.today.getTime();
            const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
        
            if (daysDiff >= 30) {
              return 'Valid'; // Ending in 1 month or more
            } else if (daysDiff > 0) {
              return 'UnderOneMonth'; // Ending in less than 1 month but not yet ended
            } else if (daysDiff >= -30) {
              return 'EndedEarlier'; // Ended less than 1 month ago
            } else {
              return 'LongGone'; // Ended 1 month or more ago
            }
          }
}

