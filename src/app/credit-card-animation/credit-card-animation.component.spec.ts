import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditCardAnimationComponent } from './credit-card-animation.component';

describe('CreditCardAnimationComponent', () => {
  let component: CreditCardAnimationComponent;
  let fixture: ComponentFixture<CreditCardAnimationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreditCardAnimationComponent]
    });
    fixture = TestBed.createComponent(CreditCardAnimationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
