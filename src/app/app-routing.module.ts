import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import path from 'path';
import { ManagementComponent } from './core/components/management/management.component';
import { DashboardComponent } from './core/components/dashboard/dashboard.component';
import { UsermanagementComponent } from './core/components/usermanagement/usermanagement.component';
import { UseraddformComponent } from './core/components/useraddform/useraddform.component';

const routes: Routes = [
  {path: 'management',
    component: ManagementComponent,
  },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' }, // Default route
  {path: 'dashboard',
    component: DashboardComponent,
  },
  {path: 'userCP',
    component: UsermanagementComponent,
  },
  {
    path: 'userADD', component: UseraddformComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
