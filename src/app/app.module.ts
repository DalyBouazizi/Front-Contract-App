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

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ManagementComponent,
    UsermanagementComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    
    provideClientHydration(),
    provideHttpClient(withFetch()) , // Enable fetch API in HttpClient
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
