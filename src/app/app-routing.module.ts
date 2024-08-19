import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManagementComponent } from './core/components/management/management.component';
import { DashboardComponent } from './core/components/dashboard/dashboard.component';
import { UsermanagementComponent } from './core/components/usermanagement/usermanagement.component';
import { UseraddformComponent } from './core/components/useraddform/useraddform.component';
import { LoginComponent } from './core/components/login/login.component';
import { authGuard } from './core/guard/auth.guard'; // Import the guard
import { EmployeeaddformComponent } from './core/components/employeeaddform/employeeaddform.component';
import { EmployeemanagementComponent } from './core/components/employeemanagement/employeemanagement.component';
import { EmployeeupdateformComponent } from './core/components/employeeupdateform/employeeupdateform.component';
import { ContractsmanagementComponent } from './core/components/contractsmanagement/contractsmanagement.component';

const routes: Routes = [
  {
    path: 'management',
    component: ManagementComponent,
    canActivate: [authGuard], // Apply guard
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard], // Apply guard
  },
  {
    path: 'userCP',
    component: UsermanagementComponent,
    canActivate: [authGuard], // Apply guard
  },
  {
    path: 'userADD',
    component: UseraddformComponent,
    canActivate: [authGuard], // Apply guard (if needed)
  },
  {
    path: 'EmployeeADD',
    component: EmployeeaddformComponent,
    canActivate: [authGuard], // Apply guard (if needed)
  },

  {
    path: 'EmployeeCP',
    component: EmployeemanagementComponent,
    canActivate: [authGuard], // Apply guard (if needed)
  },
  {
    path: 'EmployeeUpdate',
    component: EmployeeupdateformComponent,
    canActivate: [authGuard], // Apply guard (if needed)
  },
  {
    path: 'ContractsManagement',
    component: ContractsmanagementComponent,
    canActivate: [authGuard], // Apply guard (if needed)
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
