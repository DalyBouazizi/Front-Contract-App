import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './core/components/navbar/navbar.component';
import { UserDashComponent } from './core/components/user-dash/user-dash.component';
import { ManagementComponent } from './core/components/management/management.component';
import { UsermanagementComponent } from './core/components/usermanagement/usermanagement.component';
import { DashboardComponent } from './core/components/dashboard/dashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    UserDashComponent,
    ManagementComponent,
    UsermanagementComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    provideClientHydration()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
