import { Component } from '@angular/core';
import { AlertService } from '../../services/alert.service';
import { AlertModel } from '../../models/AlertModel.model';
import { ContractService } from '../../services/contract.service';
import { map, mergeMap } from 'rxjs/operators';
import { forkJoin } from 'rxjs';
import { ContractsModel } from '../../models/ContractsModel.model';
import { EmployeeModel } from '../../models/EmployeeModel.model';
import { EmployeeService } from '../../services/employee.service';
import { EmployeeGetModel } from '../../models/EmployeeGetModel.model';
import { EmailService } from '../../services/email.service';

@Component({
  selector: 'app-alertsmanagement',
  templateUrl: './alertsmanagement.component.html',
  styleUrl: './alertsmanagement.component.css'
})
export class AlertsmanagementComponent {

  alerts : AlertModel[] = [];
  combinedList: { alert: AlertModel, contract: ContractsModel, employee: EmployeeGetModel }[] = [];
  CombinedForEmail: { contract: ContractsModel, employee: EmployeeGetModel }[] = []; 
  emailBody = ''; // Email body

  constructor(private alertService : AlertService ,private contractservice :ContractService,
     private employeeService: EmployeeService,private emailSerevices : EmailService
  ) { }

  ngOnInit(): void {
    this.getalerts();
  }


  getalerts(){
    this.alertService.getAlerts().subscribe({
      next: (alerts) => {
        this.alerts = alerts;
        this.combineAlertsAndContracts();
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  combineAlertsAndContracts() {
    const requests = this.alerts.map(alert => 
      this.contractservice.GetContractByContractId(alert.contractId).pipe(
        mergeMap(contract => 
          this.employeeService.getemployeebyrealid(contract.employeeId).pipe(
            map((employee: EmployeeGetModel) => ({ alert, contract, employee }))
          )
        )
      )
    );
  
    forkJoin(requests).subscribe({
      next: (combined) => {
        this.combinedList = combined;
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  calculateDaysUntilEnd(endDate: Date): number {
    const currentDate = new Date();
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - currentDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }


  
    sendContractsEmailandAddAlert() {
      
      this.emailSerevices.getContractsEndingInOneMonth().subscribe({
        next: (contracts) => {
          const employeeRequests = contracts.map(contract =>
            this.employeeService.getemployeebyrealid(contract.employeeId).pipe(
              map(employee => ({ contract, employee }))
            )
          );
  
          forkJoin(employeeRequests).subscribe({
            next: (combinedData) => {
              this.CombinedForEmail = combinedData;
              if (this.CombinedForEmail.length > 0) {
                this.emailBody = this.formatEmailBody(this.CombinedForEmail);
  
                // Fetch all users to send the email to
  
                // this.userservices.getUsers().subscribe(users => {
                //   const recipients = users.map(user =>
                //     `${user.nom.toLowerCase()}.${user.prenom.toLowerCase()}@sebn.tn`
                //   );
                const recipients = ['bouazizimedali99@gmail.com'];
  
                  this.emailSerevices.sendEmail(recipients, 'Contracts Ending This Month', this.emailBody)
                    .subscribe(response => {
                      console.log('Email sent successfully:', response);

                      
                        this.addalerts(); 



                    }, error => {
                      console.error('Error sending email:', error);
                    });
                // });
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



addalerts(){
  this.contractservice.GetContractsByEndingThisMonth().subscribe({
    next: (contractsEndingThisMonth) => {
      const alertRequests = contractsEndingThisMonth.map(contract => {
        const alert: AlertModel = {
          // Populate the alert model with necessary data
          contractId: contract.id ?? 0,
          alertDate: new Date()
          // Add other necessary field  s
        };
        return this.alertService.addAlert(alert);
      });

            forkJoin(alertRequests).subscribe({
              next: () => {
                // Refresh the list of alerts
                this.getalerts();
              },
      error: (error) => {
          console.error('Error adding alerts:', error);
        }
      });
    },
    error: (error) => {
      console.error('Error fetching contracts ending this month:', error);
    }
  });
}
























  
    formatEmailBody(CombinedForEmail: any[]): string {
  
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
  
  
  
  
    CombinedForEmail.forEach(item => {
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

