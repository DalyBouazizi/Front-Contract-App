import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import path from 'path';
import { ManagementComponent } from './core/components/management/management.component';
import { DashboardComponent } from './core/components/dashboard/dashboard.component';
import { UserDashComponent } from './core/components/user-dash/user-dash.component';
const routes: Routes = [
  {path: 'management',
    component: ManagementComponent,
  },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' }, // Default route
  {path: 'dashboard',
    component: DashboardComponent,
  },
  {path: 'UserCP',
    component: UserDashComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
