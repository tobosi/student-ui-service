import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddScoreDialogComponent } from './add-score-dialog.component';

describe('AddScoreDialogComponent', () => {
  let component: AddScoreDialogComponent;
  let fixture: ComponentFixture<AddScoreDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddScoreDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddScoreDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
