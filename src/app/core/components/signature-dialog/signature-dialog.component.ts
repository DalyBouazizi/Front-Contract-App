import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-signature-dialog',
  templateUrl: './signature-dialog.component.html',
  styleUrl: './signature-dialog.component.css'
})
export class SignatureDialogComponent {

  constructor(public dialogRef: MatDialogRef<SignatureDialogComponent>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}
