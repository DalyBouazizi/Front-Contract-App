import { Component, OnInit } from '@angular/core';
import { UserserviceService } from '../../services/userservice.service';
import { Router } from '@angular/router';
import { UserGetModel } from '../../models/UserGetModel.model';


@Component({
  selector: 'app-useraddform',
  templateUrl: './useraddform.component.html',
  styleUrl: './useraddform.component.css'
})
export class UseraddformComponent implements OnInit{
  //Declarations
  employeeExists: boolean | null = null;
  userExists: boolean | null = null;
  passwordStrengthMessage: string = '';
  passwordStrengthColor: string = '';
  passwordStrengthClass: string = '';
  password: string = '';
  model: UserGetModel = { matricule: 0 , nom: '', prenom: '', password:'' };;

  //Rest of code
  constructor(private userService: UserserviceService, private router: Router) { }
  
  ngOnInit(): void {}


            
              checkmatricule(event: any): void {
                const id = event.target.value;
                if (id) {
                  this.userService.checkEmployeeExists(Number(id)).subscribe({
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

              checkuser(event: any): void {
                const id = event.target.value;
                if (id) {
                  this.userService.checkUserExists(Number(id)).subscribe({
                    next: (response) => {
                      this.userExists = true; 
                    },
                    error: (error) => {
                      this.userExists = false; // Assume employee does not exist if error occurs
                    }
                  });
                } else {
                  this.userExists = null; // Clear status if input is empty
                }}

                checkPasswordStrength(event: any): void {
                  this.password = event.target.value;
                  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
                  const mediumPasswordRegex = /^(?=.*\d)[A-Za-z\d]{4,}$/;
                  if (strongPasswordRegex.test( this.password)) {
                    this.passwordStrengthMessage = 'Strong password';
                    this.passwordStrengthColor = 'green';
                    this.passwordStrengthClass = 'strong';
                  } else if (mediumPasswordRegex.test( this.password)) {
                    this.passwordStrengthMessage = 'Medium strength password';
                    this.passwordStrengthColor = 'orange';
                    this.passwordStrengthClass = 'medium';
                  } else {
                    this.passwordStrengthMessage = 'Weak password';
                    this.passwordStrengthColor = 'red';
                    this.passwordStrengthClass = 'weak';
                }}
    
                onFormSubmit(){

                  this.userService.addUser(this.model)
                  .subscribe({
                    next: (response :string) => {
                      console.log(response)  ;
                    
                      // console.log('this was successful')
                      this.router.navigate(['/userCP']);
              
                    },
                    error: (error) => {
                      console.error('Error status:', error.status);  // Log HTTP status code
                      console.error('Error message:', error.message); // Log error message
                      console.log(this.model)  
                    }
                  })
          }
    
    
    }
