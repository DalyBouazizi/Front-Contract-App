import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../../services/employee.service';
import { ContractService } from '../../services/contract.service';
import { AlertService } from '../../services/alert.service';
import { EmployeeModel } from '../../models/EmployeeModel.model';
import { ContractsModel } from '../../models/ContractsModel.model';
import { AlertModel } from '../../models/AlertModel.model';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';


@Component({
  selector: 'app-dashboard',
  
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
// ------------- Testing charts --------------

chartOptions = {
  title: {
    text: 'Monthly Sales Data',
  },
  theme: 'light2',
  animationEnabled: true,
  exportEnabled: true,
  axisY: {
    includeZero: true,
    valueFormatString: '$#,##0k',
  },
  data: [
    {
      type: 'column', //change type to bar, line, area, pie, etc
      yValueFormatString: '$#,##0k',
      color: '#01b8aa',
      dataPoints: [
        { label: 'Jan', y: 172 },
        { label: 'Feb', y: 189 },
        { label: 'Mar', y: 201 },
        { label: 'Apr', y: 240 },
        { label: 'May', y: 166 },
        { label: 'Jun', y: 196 },
        { label: 'Jul', y: 218 },
        { label: 'Aug', y: 167 },
        { label: 'Sep', y: 175 },
        { label: 'Oct', y: 152 },
        { label: 'Nov', y: 156 },
        { label: 'Dec', y: 164 },
      ],
    },
  ],
};

 





  // ----------------------------------------

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
  ageDistribution: any = {};

 
  constructor(
    private employeeService: EmployeeService,
    private contractService: ContractService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.employeeService.getEmployees().subscribe(employees => {
      this.employees = employees;
      this.calculateEmployeeStatistics();
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
      if (!this.ageDistribution[ageRange]) {
        this.ageDistribution[ageRange] = 0;
      }
      this.ageDistribution[ageRange]++;
    });

    // Calculate overall average salary
    this.averageSalary = this.employees.reduce((sum, emp) => sum + (emp.salaireb || 0), 0) / this.employeeCount;

    // Calculate average salary by department
    for (let department in this.averageSalaryByPosition) {
      const dept = this.averageSalaryByPosition[department];
      this.averageSalaryByPosition[department] = dept.totalSalary / dept.count;
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
    if (age >= 20 && age <= 30) return "20-30";
    if (age >= 31 && age <= 40) return "31-40";
    if (age >= 41 && age <= 50) return "41-50";
    return "51+";
  }
}
