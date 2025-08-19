import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-certificate-dialog',
  templateUrl: './certificate-dialog.component.html',
  styles: [`
   .certificate-card {
  max-width: 600px;
  margin: auto;
  background: white;
  border-radius: 10px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  font-family: 'Arial', sans-serif;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #007bff;
  color: white;
  padding: 20px;
}

.card-header .logo {
  max-width: 100px;
  margin-right: 20px;
}

.card-header h1 {
  margin: 0;
  font-size: 24px;
}

.card-content {
  padding: 20px;
}

.card-content table {
  width: 100%;
  border-collapse: collapse;
}

.card-content td {
  padding: 10px;
  border-bottom: 1px solid #ddd;
}

.card-content td:first-child {
  font-weight: bold;
  width: 30%;
}

.card-content .signature {
  max-width: 100px;
  margin-top: 10px;
  display: block;
}

.card-actions {
  padding: 20px;
  text-align: right;
  border-top: 1px solid #ddd;
}

.card-actions button {
  background: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.card-actions button:hover {
  background: #0056b3;
}

  `]
})
export class CertificateDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<CertificateDialogComponent>
  ) {}

  createSignature(){
    console.log(this.data);
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
