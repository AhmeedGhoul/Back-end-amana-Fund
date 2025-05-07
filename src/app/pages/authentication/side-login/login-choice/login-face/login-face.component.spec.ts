import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginFaceComponent } from './login-face.component';

describe('LoginFaceComponent', () => {
  let component: LoginFaceComponent;
  let fixture: ComponentFixture<LoginFaceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoginFaceComponent]
    });
    fixture = TestBed.createComponent(LoginFaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
