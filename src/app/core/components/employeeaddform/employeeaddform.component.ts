import { Component } from '@angular/core';
import { EmployeeService } from '../../services/employee.service';
import { EmployeeModel } from '../../models/EmployeeModel.model';
import { NavigationStateServiceService } from '../../services/navigation-state-service.service';
import { Router } from '@angular/router';
import { ContractService } from '../../services/contract.service';


@Component({
  selector: 'app-employeeaddform',
  templateUrl: './employeeaddform.component.html',
  styleUrl: './employeeaddform.component.css'
})
export class EmployeeaddformComponent {

  employeeExists: boolean | null = null;
  CinExists: boolean | null = null;
  CinValid: boolean | null = null;
  FormValid: boolean | null = null;
  model: EmployeeModel = {  nom: '', prenom: '', poste: '', adresse: '', dateNaissance: new Date(),lieuNaissance: '', cin: '', dateCin: new Date(), categoriePro: '' }; ;
  jobPositions: string[] = ['Developer', 'Designer', 'Manager', 'Analyst']; // Job positions for dropdown


constructor(private employeeservice : EmployeeService , private navigationStateService :NavigationStateServiceService , private contractserive : ContractService
  , private router: Router
) { }
  
checkmatricule(event: any): void {
    const id = event.target.value;
   
   if (id) {
      this.employeeservice.checkEmployeeExists(Number(id)).subscribe({
        next: (response) => {
          
          this.employeeExists = true; 
          
        },
        error: (error) => {
          
          this.employeeExists = false; // Assume employee does not exist if error occurs
        }
      });
    } else {
      this.employeeExists = null; // Clear status if input is empty
    }}
  
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
            this.CinExists = true; 
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

onFormSubmit(){
  if (this.isFormValid()){
  this.employeeservice.addUser(this.model)
  .subscribe({
    next: (response :string) => {
     
      this.navigationStateService.setEmpAdded(true);
      this.router.navigate(['/EmployeeCP'] , { state: { added: true } });

    },
    error: (error) => {
      console.error('Error status:', error.status);  // Log HTTP status code
      console.error('Error message:', error.message); // Log error message
    }
  })
  }else{
    // Handle the case where the form is not valid
    this.FormValid = false;
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
}












