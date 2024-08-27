import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { NavbarComponent } from './core/components/navbar/navbar.component';
import { ManagementComponent } from './core/components/management/management.component';
import { UsermanagementComponent } from './core/components/usermanagement/usermanagement.component';
import { DashboardComponent } from './core/components/dashboard/dashboard.component';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
import { UseraddformComponent } from './core/components/useraddform/useraddform.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ConfirmDialogComponent } from './core/components/confirm-dialog/confirm-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { LoginComponent } from './core/components/login/login.component';
import { AuthInterceptor } from './core/services/authinterceptor';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { EmployeemanagementComponent } from './core/components/employeemanagement/employeemanagement.component';
import { EmployeeaddformComponent } from './core/components/employeeaddform/employeeaddform.component';
import { EmployeeDetailDialogComponent } from './core/components/employee-detail-dialog/employee-detail-dialog.component';
import { EmployeeupdateformComponent } from './core/components/employeeupdateform/employeeupdateform.component';
import { DatePipe } from '@angular/common';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DataTablesModule } from "angular-datatables";
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { MatSliderModule } from '@angular/material/slider';
import { ContractsmanagementComponent } from './core/components/contractsmanagement/contractsmanagement.component';
import { ContractaddformComponent } from './core/components/contractaddform/contractaddform.component';
import { ContractrenewformComponent } from './core/components/contractrenewform/contractrenewform.component';
import { ContractupdateformComponent } from './core/components/contractupdateform/contractupdateform.component';
import { ContractNotifierComponent } from './core/components/contract-notifier/contract-notifier.component';
import { AlertsmanagementComponent } from './core/components/alertsmanagement/alertsmanagement.component';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { AnimateNumberPipe } from './core/pipes/animate-number.pipe';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ManagementComponent,
    UsermanagementComponent,
    DashboardComponent,
    UseraddformComponent,
    ConfirmDialogComponent,
    LoginComponent,
    EmployeemanagementComponent,
    EmployeeaddformComponent,
    EmployeeDetailDialogComponent,
    EmployeeupdateformComponent,
    ContractsmanagementComponent,
    ContractaddformComponent,
    ContractrenewformComponent,
    ContractupdateformComponent,
    ContractNotifierComponent,
    AlertsmanagementComponent,
    AnimateNumberPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    MatDialogModule,
    MatSnackBarModule,
    MatOptionModule,
    MatSelectModule,
    MatFormFieldModule,
    DataTablesModule,
    NgMultiSelectDropDownModule.forRoot(),
    MatSliderModule,
    CanvasJSAngularChartsModule,
    
    BrowserAnimationsModule
  ],
  
    
  
  providers: [
    DatePipe,
    provideClientHydration(),
    provideHttpClient(withFetch()),
    provideAnimationsAsync(), // Enable fetch API in HttpClient
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    JwtHelperService, // Add this line
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS } // Add this line if needed for configuration
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
