import { Component } from '@angular/core';
import { EmailService } from '../../services/email.service';
import { ContractService } from '../../services/contract.service';
import { EmployeeService } from '../../services/employee.service';
import { EmployeeGetModel } from '../../models/EmployeeGetModel.model';
import { ContractsModel } from '../../models/ContractsModel.model';

@Component({
  selector: 'app-contract-notifier',
  templateUrl: './contract-notifier.component.html',
  styleUrl: './contract-notifier.component.css'
})
export class ContractNotifierComponent {

  CombinedData: any = {};
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
      next: (response) => {
        response.forEach(contract => {
          this.employeeService.getemployeebyrealid(contract.employeeId).subscribe({
            next: (employee) => {
              this.CombinedData.push({ contract, employee });
              
            },
            error: (error) => {
              // Handle error
            }
          });
        });
      },
      error: (error) => {
        // Handle error
      }
    });
    if (this.CombinedData) {
      console.log(this.CombinedData);
      console.log('ready to send')
       this.emailBody = this.formatEmailBody(this.CombinedData);
      console.log(this.emailBody);
      this.emailSerevices.sendEmail('bouazizimedali50@gmail.com', 'Contracts Ending This Month', this.emailBody)
        .subscribe(response => {
          console.log('Email sent successfully:', response);
        }, error => {
          console.error('Error sending email:', error);
        });
    }
  }

  formatEmailBody(CombinedData: any[]): string {
    let body = 'The following contracts are ending this month:\n\n';
    CombinedData.forEach(item => {
      body += `Contract ID: ${item.contract.id} || Employee: ${item.employee.nom,item.employee.prenom}|| End Date: ${item.contract.dateFin} ||  End Date: ${item.contract.type}\n\n`;
    });
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
