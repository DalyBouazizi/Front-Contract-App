import { Component,ViewChild, } from '@angular/core';
import { EmployeeService } from '../../services/employee.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NavigationStateServiceService } from '../../services/navigation-state-service.service';
import { EmployeeModel } from '../../models/EmployeeModel.model';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { EmployeeDetailDialogComponent } from '../employee-detail-dialog/employee-detail-dialog.component';
import { Config } from 'datatables.net';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-employeemanagement',
  templateUrl: './employeemanagement.component.html',
  styleUrl: './employeemanagement.component.css'
})
export class EmployeemanagementComponent {
  emps: EmployeeModel[] = [];
  dtOptions: Config = {};

  @ViewChild(DataTableDirective, {static: false})
  dtElement!: DataTableDirective;
  jobPositions: string[] = ['Developer', 'Designer', 'Manager', 'Analyst']; // Job positions for dropdown
  dtTrigger:Subject<any> = new Subject<any>();
  
  constructor(private employeeservice: EmployeeService, private router: Router,public dialog: MatDialog,
    private snackBar: MatSnackBar, private navigationStateService: NavigationStateServiceService,) { }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.dtOptions = {

      pagingType: 'full_numbers',
      pageLength: 15, // Set the default number of entries per page
      lengthMenu: [5, 10, 25, 50], // Provide options for users to select the number of entries per page
      // Additional DataTables options here

      language: {
        lengthMenu: '_MENU_ : Numbers of Employees per page  ',
        search: 'Keyword', // Custom search label
      }
      
        
      
    };
  


    

    


   this.fetchEmployees(); 

       if (this.navigationStateService.isEmpAdded()) {
        console.log('here')
         this.snackBar.open('Employee added successfully!', 'Close', {
           duration: 3000,
           verticalPosition: 'top',
           panelClass: ['success-snackbar']
         });
         this.navigationStateService.setEmpAdded(false); // Reset state
       }
       if (this.navigationStateService.isEmpUpdated()) {
        console.log('here')
         this.snackBar.open('Employee updated successfully!', 'Close', {
           duration: 3000,
           verticalPosition: 'top',
           panelClass: ['success-snackbar']
         });
         this.navigationStateService.setEmpUpdated(false); // Reset state
       }

  }

  ngAfterViewInit(): void {
    this.dtTrigger.next(0);
  }
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
  rerender(): void {
    this.dtElement.dtInstance.then(dtInstance => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next(0);
    });
  }

    fetchEmployees(){
      this.employeeservice.getEmployees().subscribe(
        (data) => {
          this.emps = data;
          this.dtTrigger.next(0);
        },
        (error) => {
          console.error('Error fetching employees', error);
        }
      );
    } // Refresh the user list

    deleteEmployee(matricule: number) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent);

      dialogRef.afterClosed().subscribe(result => {
        if (result){
              this.employeeservice.deleteEmployee(matricule)
              .subscribe({
                next: (response :string) => {
                  console.log(response);
                  
                    this.snackBar.open('Employee deleted successfully!', 'Close', {
                      duration: 3000,verticalPosition: 'top', panelClass:['success-snackbar'], });

                  this.router.navigate(['/EmployeeCP']);
                  this.fetchEmployees();
          
                },
              error: (error) => {
                console.error('Error status:', error.status);  // Log HTTP status code
                console.error('Error message:', error.message); // Log error message
                
              } })} });}
  openEmployeeDetailDialog(employee: EmployeeModel): void {
    this.dialog.open(EmployeeDetailDialogComponent, {
      data: employee,
      panelClass: 'custom-dialog-container', // Add custom class here
    });
  }

  navigateToUpdate(employee: EmployeeModel) {
    
    this.navigationStateService.setEmployeeToUpdate(employee);
    this.router.navigate(['/EmployeeUpdate']);
  }




  

}
