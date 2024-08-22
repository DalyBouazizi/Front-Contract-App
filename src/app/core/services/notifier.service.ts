import { Injectable } from '@angular/core';
import { Component } from '@angular/core';

import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { EmailService } from './email.service';
import { ContractService } from './contract.service';
import { EmployeeService } from './employee.service';
import { UserserviceService } from './userservice.service';


@Injectable({
  providedIn: 'root'
})
export class NotifierService {

  private intervalId: any;

  constructor(
    private emailService: EmailService,
    private contractService: ContractService,
    private employeeService: EmployeeService,
    private userService: UserserviceService
  ) {}


  // ----------------------------- Weekly send emails -----------------------------------
  startWeeklyEmailNotifier(): void {
    // this.scheduleNextEmail();
    this.sendContractsEmail();
  }

  private scheduleNextEmail(): void {
    // Calculate the time until the next scheduled email (e.g., next Monday at 9 AM)
    const now = new Date();
    const nextEmailDate = new Date();
    
    // Set the time for the next email to Monday at 9 AM
    nextEmailDate.setDate(now.getDate() + ((1 + 7 - now.getDay()) % 7)); // Next Monday
    nextEmailDate.setHours(9, 0, 0, 0); // 9 AM

    const timeUntilNextEmail = nextEmailDate.getTime() - now.getTime();

    // Use setTimeout to trigger the email at the calculated time
    setTimeout(() => {
      this.sendContractsEmail();
      this.scheduleNextEmail(); // Schedule the next email after this one is sent
    }, timeUntilNextEmail);
  }

// --------------------------------------------------------------------------------


  private sendContractsEmail(): void {
    this.emailService.getContractsEndingInOneMonth().subscribe({
      next: (contracts) => {
        const employeeRequests = contracts.map(contract =>
          this.employeeService.getemployeebyrealid(contract.employeeId).pipe(
            map(employee => ({ contract, employee }))
          )
        );

        forkJoin(employeeRequests).subscribe({
          next: (combinedData) => {
            if (combinedData.length > 0) {
              const emailBody = this.formatEmailBody(combinedData);


              // Fetch all users to send the email to

              // this.userservices.getUsers().subscribe(users => {
              //   const recipients = users.map(user =>
              //     `${user.nom.toLowerCase()}.${user.prenom.toLowerCase()}@sebn.tn`
              //   );

              // Use a custom recipient list for testing
              const recipients = ['bouazizimedali99@gmail.com'];

              this.emailService.sendEmail(recipients, 'Contracts Ending This Month', emailBody)
                .subscribe(response => {
                  console.log('Email sent successfully:', response);
                }, error => {
                  console.error('Error sending email:', error);
                });
            }
          },
          error: (error) => {
            console.error('Error fetching contract or employee data:', error);
          }
        });
      },
      error: (error) => {
        console.error('Error fetching contracts:', error);
      }
    });
  }

  private formatEmailBody(CombinedData: any[]): string {
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
}
