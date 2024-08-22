import { Component } from '@angular/core';
import { EmailService } from '../../services/email.service';
import { ContractService } from '../../services/contract.service';
import { EmployeeService } from '../../services/employee.service';
import { EmployeeGetModel } from '../../models/EmployeeGetModel.model';
import { ContractsModel } from '../../models/ContractsModel.model';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-contract-notifier',
  templateUrl: './contract-notifier.component.html',
  styleUrl: './contract-notifier.component.css'
})
export class ContractNotifierComponent {

  CombinedData: { contract: ContractsModel, employee: EmployeeGetModel }[] = []; 
  Employee : EmployeeGetModel = {id:0, nom: '', prenom: '', poste: '', adresse: '', dateNaissance: new Date(), lieuNaissance: '', cin: '', dateCin: new Date(), categoriePro: ''}; // Employee data
  Contract : ContractsModel = { type:'', datedeb: new Date(), dateFin: new Date(), employeeId: 0}; // Contract data
  private intervalId: any;
  emailBody = ''; // Email body

  constructor(private emailSerevices :EmailService,private contractService: ContractService, private employeeService: EmployeeService,) {}

  ngOnInit(): void {
     // Trigger sendContractsEmail every 10 seconds
     this.intervalId = setInterval(() => {
      this.sendContractsEmail();
    }, 10000); // 10000ms = 10 seconds
  }
  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId); // Clear the interval when the component is destroyed
    }
  }
  sendContractsEmail() {
    this.emailSerevices.getContractsEndingInOneMonth().subscribe({
      next: (contracts) => {
        const employeeRequests = contracts.map(contract => 
          this.employeeService.getemployeebyrealid(contract.employeeId).pipe(
            map(employee => ({ contract, employee }))
          )
        );

        forkJoin(employeeRequests).subscribe({
          next: (combinedData) => {
            this.CombinedData = combinedData;
            if (this.CombinedData.length > 0) {
              this.emailBody = this.formatEmailBody(this.CombinedData);
            
              this.emailSerevices.sendEmail('bouazizimedali50@gmail.com', 'Contracts Ending This Month', this.emailBody)
                .subscribe(response => {
              
                }, error => {
                 
                });
            }
          },
          error: (error) => {
            
          }
        });
      },
      error: (error) => {
      
      }
    });
  }
  formatEmailBody(CombinedData: any[]): string {

    let body = `
    <html>
      <body style="font-family: Arial, sans-serif; color: #333;">
        <h2 style="color: #4CAF50;">Contracts Ending This Month</h2>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead>
            <tr>
              <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2;">Contract ID</th>
              <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2;">Employee Name</th>
              <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2;">End Date</th>
              <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2;">Contract Type</th>
            </tr>
          </thead>
          <tbody>
  `;




    CombinedData.forEach(item => {
    body += `
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px;">${item.contract.id}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${item.employee.nom} ${item.employee.prenom}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${new Date(item.contract.dateFin).toLocaleDateString()}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${item.contract.type}</td>
      </tr>
    `;
  });

  body += `
          </tbody>
        </table>
        <div style="text-align: center;">
          <a href="http://localhost:4200/SendEmail" 
             style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">
            View More Details
          </a>
        </div>
      </body>
    </html>
  `;



    return body;
  }


  // if (contracts.length > 0) {

        






  //   const emailBody = this.formatEmailBody(contracts);
  //   this.emailSerevices.sendEmail('x@x.x', 'Contracts Ending This Month', emailBody)
  //     .subscribe(response => {
  //       console.log('Email sent successfully:', response);
  //     }, error => {
  //       console.error('Error sending email:', error);
  //     });
  // } else {
  //   console.log('No contracts ending this month.');
  // }



}
