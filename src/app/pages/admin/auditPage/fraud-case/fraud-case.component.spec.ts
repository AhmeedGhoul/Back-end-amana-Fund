import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FraudCaseComponent } from './fraud-case.component';

describe('FraudCaseComponent', () => {
  let component: FraudCaseComponent;
  let fixture: ComponentFixture<FraudCaseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FraudCaseComponent]
    });
    fixture = TestBed.createComponent(FraudCaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
