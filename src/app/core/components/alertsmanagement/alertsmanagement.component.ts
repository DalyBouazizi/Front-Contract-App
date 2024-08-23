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
import { UserserviceService } from '../../services/userservice.service';

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
     private employeeService: EmployeeService,private emailSerevices : EmailService, private userservice : UserserviceService
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
}