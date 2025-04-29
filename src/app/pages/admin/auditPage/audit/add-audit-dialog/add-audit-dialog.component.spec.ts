import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAuditDialogComponent } from './add-audit-dialog.component';

describe('AddAuditDialogComponent', () => {
  let component: AddAuditDialogComponent;
  let fixture: ComponentFixture<AddAuditDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddAuditDialogComponent]
    });
    fixture = TestBed.createComponent(AddAuditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
