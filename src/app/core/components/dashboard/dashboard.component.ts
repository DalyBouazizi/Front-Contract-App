import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { EmployeeService } from '../../services/employee.service';
import { ContractService } from '../../services/contract.service';
import { AlertService } from '../../services/alert.service';
import { EmployeeModel } from '../../models/EmployeeModel.model';
import { ContractsModel } from '../../models/ContractsModel.model';
import { AlertModel } from '../../models/AlertModel.model';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  animations: [
    trigger('numberAnimation', [
      state('start', style({ opacity: 1 })),
      state('end', style({ opacity: 1 })),
      transition('start => end', [
        animate('2s', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class DashboardComponent implements OnInit {
  employees: EmployeeModel[] = [];
  contracts: ContractsModel[] = [];
  alerts: AlertModel[] = [];

  employeeCount: number = 0;
  contractCount: number = 0;
  alertCount: number = 0;
  averageSalary: number = 0;
  employeesByCategoriePro: any = {};
  contractsByType: any = {};
  averageSalaryByPosition: any = {};
  ageDistribution: { label: string, y: number }[] = [];

  employeeCountAnim: number = 0;
  contractCountAnim: number = 0;
  alertCountAnim: number = 0;
  averageSalaryAnim: number = 0;

  constructor(
    private employeeService: EmployeeService,
    private contractService: ContractService,
    private alertService: AlertService,
    private cdr: ChangeDetectorRef // Inject ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.employeeService.getEmployees().subscribe(employees => {
      this.employees = employees;
      this.calculateEmployeeStatistics();
      this.startAnimations(); 
      // load the charts here
    });

    this.contractService.getContracts().subscribe(contracts => {
      this.contracts = contracts;
      this.calculateContractStatistics();
    });

    this.alertService.getAlerts().subscribe(alerts => {
      this.alerts = alerts;
      this.alertCount = alerts.length;
    });
  }

  calculateEmployeeStatistics(): void {
    this.employeeCount = this.employees.length;

    this.employees.forEach(employee => {
      // Calculate by CategoriePro
      if (!this.employeesByCategoriePro[employee.categoriePro]) {
        this.employeesByCategoriePro[employee.categoriePro] = 0;
      }
      this.employeesByCategoriePro[employee.categoriePro]++;

      // Calculate Average Salary
      if (!this.averageSalaryByPosition[employee.poste]) {
        this.averageSalaryByPosition[employee.poste] = { totalSalary: 0, count: 0 };
      }
      this.averageSalaryByPosition[employee.poste].totalSalary += employee.salaireb;
      this.averageSalaryByPosition[employee.poste].count++;

      // Calculate Age Distribution
      const age = this.calculateAge(employee.dateNaissance);
      const ageRange = this.getAgeRange(age);
      const existingRange = this.ageDistribution.find(ad => ad.label === ageRange);
      if (existingRange) {
        existingRange.y++;
      } else {
        this.ageDistribution.push({ label: ageRange, y: 1 });
      }
    });

    // Calculate overall average salary
    this.averageSalary = this.employees.length > 0 ?
      this.employees.reduce((sum, emp) => sum + (emp.salaireb || 0), 0) / this.employeeCount : 0;

    // Calculate average salary by department
    for (let department in this.averageSalaryByPosition) {
      const dept = this.averageSalaryByPosition[department];
      this.averageSalaryByPosition[department] = dept.count > 0 ? dept.totalSalary / dept.count : 0;
    }
  }

  calculateContractStatistics(): void {
    this.contractCount = this.contracts.length;

    this.contracts.forEach(contract => {
      if (!this.contractsByType[contract.type]) {
        this.contractsByType[contract.type] = 0;
      }
      this.contractsByType[contract.type]++;
    });
  }

  calculateAge(dateOfBirth: Date): number {
    const dob = new Date(dateOfBirth);
    const diffMs = Date.now() - dob.getTime();
    const ageDt = new Date(diffMs);
    return Math.abs(ageDt.getUTCFullYear() - 1970);
  }

  getAgeRange(age: number): string {
    if (age >= 20 && age <= 30) return '20-30';
    if (age >= 31 && age <= 40) return '31-40';
    if (age >= 41 && age <= 50) return '41-50';
    return '51+';
  }

  startAnimations(): void {
    this.animateEmployeeCount();
    this.animateContractCount();
    this.animateAlertCount();
    this.animateAverageSalary();
  }

  animateEmployeeCount(): void {
    let interval = setInterval(() => {
      this.employeeCountAnim++;
      if (this.employeeCountAnim >= this.employeeCount) {
        this.employeeCountAnim = this.employeeCount;
        clearInterval(interval);
      }
    }, 50);
  }

  animateContractCount(): void {
    let interval = setInterval(() => {
      this.contractCountAnim++;
      if (this.contractCountAnim >= this.contractCount) {
        this.contractCountAnim = this.contractCount;
        clearInterval(interval);
      }
    }, 50);
  }

  animateAlertCount(): void {
    let interval = setInterval(() => {
      this.alertCountAnim++;
      if (this.alertCountAnim >= this.alertCount) {
        this.alertCountAnim = this.alertCount;
        clearInterval(interval);
      }
    }, 50);
  }

  animateAverageSalary(): void {
    let interval = setInterval(() => {
      this.averageSalaryAnim += 40 ; // Adjust increment as needed
      if (this.averageSalaryAnim >= this.averageSalary) {
        this.averageSalaryAnim = Math.floor(this.averageSalary); // Ensure it's an integer
        clearInterval(interval);
      }
    }, 50);
  }

  chartOptions = {
    title: {
      text: 'Employees Age Distribution',
    },
    theme: 'light2',
    animationEnabled: true,
    exportEnabled: true,
    axisY: {
      includeZero: true,
    },
    data: [
      {
        type: 'column',
        color: '#01b8aa',
        dataPoints: [
          { label: '20-30', y: this.ageDistribution.find(ad => ad.label === '20-30')?.y || 0 },
          { label: '31-40', y: this.ageDistribution.find(ad => ad.label === '31-40')?.y || 0 },
          { label: '41-50', y: this.ageDistribution.find(ad => ad.label === '41-50')?.y || 0 },
          { label: '51+', y: this.ageDistribution.find(ad => ad.label === '51+')?.y || 0 },
        ],
      },
    ],
  };

  chartOptions2 = {
    animationEnabled: true,
    theme: "light2",
    exportEnabled: true,
    title: {
      text: "Employees by Department"
    },
    data: [{
      type: "pie",
      indexLabel: "{name}: {y}%",
      dataPoints: [
        { name: "IT", y: this.employeesByCategoriePro['IT'] || 0 },
        { name: "Finance", y: this.employeesByCategoriePro['Finance'] || 0 },
        { name: "Marketing", y: this.employeesByCategoriePro['Marketing'] || 0 },
        { name: "Sales", y: this.employeesByCategoriePro['Sales'] || 0 },
        { name: "HR", y: this.employeesByCategoriePro['HR'] || 0 },
        { name: "Management", y: this.employeesByCategoriePro['Management'] || 0 },
        { name: "Others", y: this.employeesByCategoriePro['Others'] || 0 }
      ]
    }]
  }
}
