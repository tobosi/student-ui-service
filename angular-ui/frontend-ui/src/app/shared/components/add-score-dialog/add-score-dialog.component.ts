import {Component, Inject} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";

@Component({
  selector: 'app-add-score-dialog',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './add-score-dialog.component.html',
  styleUrl: './add-score-dialog.component.css'
})
export class AddScoreDialogComponent {

  addForm: FormGroup;

  constructor(public dialogRef: MatDialogRef<AddScoreDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private fb: FormBuilder) {
    this.addForm = this.initForm();
  }

  private initForm(): FormGroup {
    return this.fb.group({
      score: new FormControl(0, [Validators.min(0), Validators.max(100)])
    });
  }

  onSubmit(event: any) {
    if (!this.addForm.valid) {
      event.target.disabled = true;
      return;
    }

    this.dialogRef.close(this.addForm.value.score);
  }
}
