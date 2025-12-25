import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { VardiyaDTO } from '../../services/vardiya.service';

@Component({
  selector: 'app-vardiya-detay-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './vardiya-detay-dialog.component.html',
  styleUrls: ['./vardiya-detay-dialog.component.scss']
})
export class VardiyaDetayDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: VardiyaDTO,
    private dialogRef: MatDialogRef<VardiyaDetayDialogComponent>
  ) {}


  kapat(): void {
    this.dialogRef.close();
  }

  duzenle(): void {
    this.dialogRef.close('duzenle');
  }

  sil(): void {
    this.dialogRef.close('sil');
  }
}
