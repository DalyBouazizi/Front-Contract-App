import { Component, Inject } from '@angular/core';
import { EmployeeModel } from '../../models/EmployeeModel.model';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-employee-detail-dialog',
  templateUrl: './employee-detail-dialog.component.html',
  styleUrl: './employee-detail-dialog.component.css'
})
export class EmployeeDetailDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: EmployeeModel) {}

}
