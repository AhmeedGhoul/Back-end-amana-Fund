import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFraudCaseDialogComponent } from './add-fraud-case-dialog.component';

describe('AddFraudCaseDialogComponent', () => {
  let component: AddFraudCaseDialogComponent;
  let fixture: ComponentFixture<AddFraudCaseDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddFraudCaseDialogComponent]
    });
    fixture = TestBed.createComponent(AddFraudCaseDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
