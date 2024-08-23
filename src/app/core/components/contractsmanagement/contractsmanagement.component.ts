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
import { AlertService } from '../../services/alert.service';
import { ContractFilterCriteria } from '../../models/ContractFilterCriteriaModel.model';
import { HttpParams } from '@angular/common/http';
@Component({
  selector: 'app-contractsmanagement',
  templateUrl: './contractsmanagement.component.html',
  styleUrl: './contractsmanagement.component.css'
})
export class ContractsmanagementComponent {

  constructor(
    private contractService: ContractService, private employeeService: EmployeeService, private navigationStateService: NavigationStateServiceService,
    public dialog: MatDialog, private snackBar: MatSnackBar,private router: Router,
    private alerservice : AlertService
    
  ) { }

  Contracts : ContractsModel[] = []; 
  CombinedData: { contract: ContractsModel, employee: EmployeeGetModel }[] = []; // New array to store combined data
  today = new Date();

  selectedTypes: string[] = [];
  Types: string[] = ['CDD', 'CDI', 'CIVP'];
  selectedStatus: string[] = [];
  Status: string[] = ['Recently Ended', 'Expiring Soon', 'Active', 'Expired'];
  FilterStartDate: Date | null = null;
  FilterEndDate: Date | null = null;

  dropdownSettings = {
    singleSelection: false,
    idField: 'item_id',
    textField: 'item_text',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    allowSearchFilter:false,
    itemsShowLimit: 0,
  };

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
          this.contractService.deleteAllContracts(idemployee)
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


          isDateGreaterThan2039(date: Date): boolean {
            const endDate = new Date(date);
            const cutoffDate = new Date('2039-11-31T23:59:59');
            return endDate > cutoffDate;
          }


          //---------Filtering----------------

          applyFilters() {
            // Create an instance of ContractFilterCriteria
            const filters: ContractFilterCriteria = {
                types: this.selectedTypes, // Array of selected types
                isActive: this.selectedStatus.includes('Active') ? true : undefined,
                isEndingSoon: this.selectedStatus.includes('Expiring Soon') ? true : undefined,
                isEndedRecently: this.selectedStatus.includes('Recently Ended') ? true : undefined,
                EndedOverOneMonth: this.selectedStatus.includes('Expired') ? true : undefined,
                startDate: this.FilterStartDate ? this.FilterStartDate : undefined,
                endDate: this.FilterEndDate ? this.FilterEndDate : undefined
            };
        
                          let queryParams = [];

                  if (filters.types && filters.types.length > 0) {
                      queryParams.push(`Types=${filters.types.join(',')}`);
                  }
                  if (filters.isActive !== undefined) {
                      queryParams.push(`IsActive=${filters.isActive}`);
                  }
                  if (filters.isEndingSoon !== undefined) {
                      queryParams.push(`IsEndingSoon=${filters.isEndingSoon}`);
                  }
                  if (filters.isEndedRecently !== undefined) {
                      queryParams.push(`IsEndedRecently=${filters.isEndedRecently}`);
                  }
                  if (filters.EndedOverOneMonth !== undefined) {
                      queryParams.push(`EndedOverOneMonth=${filters.EndedOverOneMonth}`);
                  }
                  if (filters.startDate) {
                      queryParams.push(`StartDate=${filters.startDate}`);
                  }
                  if (filters.endDate) {
                      queryParams.push(`EndDate=${filters.endDate}`);
                  }

                  const queryString = queryParams.join('&');

                  // Use HttpParams to handle query parameters
                  let params = new HttpParams();
                  queryParams.forEach(param => {
                      const [key, value] = param.split('=');
                      params = params.append(key, value);
                  });

                  console.log('queryString', queryString);
                  console.log('params', params);

                  this.fetchFilteredContracts(params);
        }
        
          
          
         
          resetFilters() {
            this.selectedTypes = [];
            this.selectedStatus = [];
            this.FilterStartDate = null;
            this.FilterEndDate = null;
            this.CombinedData = [];
            this.fetchContracts();
          }

          fetchFilteredContracts(filters?: any) {
            this.contractService.fetchFilteredContracts(filters).subscribe(
              (contracts) => {
                this.Contracts = contracts;
                this.CombinedData = [];
                contracts.forEach(contract => {
                  this.employeeService.getemployeebyrealid(contract.employeeId).subscribe(
                    (employee) => {
                      this.CombinedData.push({ contract, employee });
                    },
                    (error) => {
                      console.error(`Error fetching employee with ID ${contract.employeeId}:`, error);
                    }
                  );
                });
              },
              (error) => {
                console.error(error);
                this.CombinedData = [];
              }
            );
          }
        


}

