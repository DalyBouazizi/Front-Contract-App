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
    EmployeeDetailDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  providers: [
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
