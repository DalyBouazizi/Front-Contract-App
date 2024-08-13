import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import path from 'path';
import { ManagementComponent } from './core/components/management/management.component';
import { DashboardComponent } from './core/components/dashboard/dashboard.component';
import { UsermanagementComponent } from './core/components/usermanagement/usermanagement.component';
import { UseraddformComponent } from './core/components/useraddform/useraddform.component';
import { LoginComponent } from './core/components/login/login.component';

const routes: Routes = [
  {path: 'management',
    component: ManagementComponent,
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Default route
  {path: 'dashboard',
    component: DashboardComponent,
  },
  {path: 'userCP',
    component: UsermanagementComponent,
  },
  {
    path: 'login', component: LoginComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
