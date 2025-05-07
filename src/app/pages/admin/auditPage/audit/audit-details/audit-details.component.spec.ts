import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditDetailsComponent } from './audit-details.component';

describe('AuditDetailsComponent', () => {
  let component: AuditDetailsComponent;
  let fixture: ComponentFixture<AuditDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AuditDetailsComponent]
    });
    fixture = TestBed.createComponent(AuditDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
