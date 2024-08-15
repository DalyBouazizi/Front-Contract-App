import { Component, OnInit } from '@angular/core';
import { EmployeeModel } from '../../models/EmployeeModel.model';
import { Router } from '@angular/router';
import { NavigationStateServiceService } from '../../services/navigation-state-service.service';
import { DatePipe } from '@angular/common';
import { EmployeeService } from '../../services/employee.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-employeeupdateform',
  templateUrl: './employeeupdateform.component.html',
  styleUrl: './employeeupdateform.component.css'
})
export class EmployeeupdateformComponent implements OnInit {

  model: EmployeeModel = {  nom: '', prenom: '', poste: '', adresse: '', dateNaissance: new Date(), lieuNaissance: '', cin: '', dateCin: new Date(), categoriePro: '' };
  jobPositions: string[] = ['Developer', 'Designer', 'Manager', 'Analyst']; // Job positions for dropdown
  FormValid: boolean | null = null;
  employeeExists: boolean | null = null;
  CinExists: boolean | null = null;
  CinValid: boolean | null = null;
  formattedDateNaissance = '';
  formattedDateCin = '';

  constructor(private router: Router, private navigationStateService: NavigationStateServiceService,
    private datePipe: DatePipe, private employeeservice: EmployeeService, private snackBar: MatSnackBar
    
  )  { }

  ngOnInit(): void {
    // Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    // Add 'implements OnInit' to the class.
    this.model = this.navigationStateService.getEmployeeToUpdate();
     // Transform dates using DatePipe
     this.formattedDateNaissance = this.datePipe.transform(this.model.dateNaissance, 'yyyy-MM-dd') || '';
    this.formattedDateCin = this.datePipe.transform(this.model.dateCin, 'yyyy-MM-dd') || '';
   
 
    
  }

  checkCinExists(event: any): void {  
    const cin = event.target.value;
    const isAllDigits = /^\d+$/.test(cin); // Regular expression to check if the string is all digits

    if (cin) {
      if (cin.length != 8 || !isAllDigits) {
        this.CinValid = false;
        this.CinExists = null;
      } else {
        this.CinValid = true;
        this.employeeservice.checkCinEmployeeExists(Number(cin)).subscribe({
          next: (response) => {
            if (response.cin === cin) {
              this.CinExists = false; 
            }else{
              this.CinExists = true; 
            }
            
          },
          error: (error) => {
            this.CinExists = false; 
          }
        });
      }

     
        } else {
      this.CinExists = null;
      this.CinValid = null;
      }
}

isFormValid(): boolean {
  return this.model.nom.trim() !== '' &&
         this.model.prenom.trim() !== '' &&
         this.model.poste.trim() !== '' &&
         this.model.adresse.trim() !== '' &&
         this.model.lieuNaissance.trim() !== '' &&
         this.model.dateNaissance !== null &&
         this.model.dateCin !== null &&
         this.model.categoriePro.trim() !== ''&&
         this.model.salaireb !== null &&
         this.model.salairen!== null ;
}


  processUpdate(): void {
    this.model.dateNaissance = new Date(this.formattedDateNaissance);
    this.model.dateCin = new Date(this.formattedDateCin);
    if (this.isFormValid()){
    this.employeeservice.UpdateEmployee(this.model).subscribe({
      next: (response :string) => {
        this.navigationStateService.setEmpUpdated(true);
        this.router.navigate(['/EmployeeCP']);
      },
      error: (error) => {
        console.error('Error status:', error.status);  // Log HTTP status code
        console.error('Error message:', error.message); // Log error message
      }
    })
    
    }else{
      console.log('Form is not valid');
      this.FormValid = false;
    }
  
    // Continue with form submission or processing
  }

}