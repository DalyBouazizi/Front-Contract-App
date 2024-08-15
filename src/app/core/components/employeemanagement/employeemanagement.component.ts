import { Component } from '@angular/core';
import { EmployeeService } from '../../services/employee.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NavigationStateServiceService } from '../../services/navigation-state-service.service';
import { EmployeeModel } from '../../models/EmployeeModel.model';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { EmployeeDetailDialogComponent } from '../employee-detail-dialog/employee-detail-dialog.component';

@Component({
  selector: 'app-employeemanagement',
  templateUrl: './employeemanagement.component.html',
  styleUrl: './employeemanagement.component.css'
})
export class EmployeemanagementComponent {
  emps: EmployeeModel[] = [];
  
   
  constructor(private employeeservice: EmployeeService, private router: Router,public dialog: MatDialog,
    private snackBar: MatSnackBar, private navigationStateService: NavigationStateServiceService,) { }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
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

  }

    fetchEmployees(){
      this.employeeservice.getEmployees().subscribe(
        (data) => {
          this.emps = data;
         
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

                  // console.log('this was successful')
                  this.router.navigate(['/EmployeeCP']);
                  this.fetchEmployees();
          
                },
              error: (error) => {
                console.error('Error status:', error.status);  // Log HTTP status code
                console.error('Error message:', error.message); // Log error message
                
              }
      })

      }
    });
    
  }



  openEmployeeDetailDialog(employee: EmployeeModel): void {
    this.dialog.open(EmployeeDetailDialogComponent, {
      data: employee,
      panelClass: 'custom-dialog-container', // Add custom class here
    });
  }

}
