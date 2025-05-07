import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginNormalComponent } from './login-normal.component';

describe('LoginNormalComponent', () => {
  let component: LoginNormalComponent;
  let fixture: ComponentFixture<LoginNormalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoginNormalComponent]
    });
    fixture = TestBed.createComponent(LoginNormalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
