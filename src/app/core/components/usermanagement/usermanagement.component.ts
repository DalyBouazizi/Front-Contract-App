import { Component, ViewEncapsulation } from '@angular/core';
import { UserserviceService } from '../../services/userservice.service';
import { UserGetModel } from '../../models/UserGetModel.model';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { NavigationStateServiceService } from '../../services/navigation-state-service.service';

@Component({
  selector: 'app-usermanagement',
  templateUrl: './usermanagement.component.html',
  styleUrl: './usermanagement.component.css',
  encapsulation: ViewEncapsulation.None
})

export class UsermanagementComponent {
  users: UserGetModel[] = [];
  
   
  constructor(private userService: UserserviceService, private router: Router,public dialog: MatDialog,
    private snackBar: MatSnackBar, private navigationStateService: NavigationStateServiceService,) { }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
   this.fetchUsers(); 

       if (this.navigationStateService.isUserAdded()) {
        console.log('here')
         this.snackBar.open('User added successfully!', 'Close', {
           duration: 3000,
           verticalPosition: 'top',
           panelClass: ['success-snackbar']
         });
         this.navigationStateService.setUserAdded(false); // Reset state
       }

  }

    fetchUsers(){
      this.userService.getUsers().subscribe(
        (data) => {
          this.users = data;
         
        },
        (error) => {
          console.error('Error fetching users', error);
        }
      );
    } // Refresh the user list

    deleteUser(matricule: number) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent);

      dialogRef.afterClosed().subscribe(result => {
        if (result){
              this.userService.deleteUser(matricule)
              .subscribe({
                next: (response :string) => {
                  console.log(response);

                  this.snackBar.open('User deleted successfully!', 'Close', {
                    duration: 3000,verticalPosition: 'top', panelClass:['success-snackbar'], });

                  // console.log('this was successful')
                  this.router.navigate(['/userCP']);
                  this.fetchUsers();
          
                },
              error: (error) => {
                console.error('Error status:', error.status);  // Log HTTP status code
                console.error('Error message:', error.message); // Log error message
                
              }
      })

      }
    });
    
  }

}  

