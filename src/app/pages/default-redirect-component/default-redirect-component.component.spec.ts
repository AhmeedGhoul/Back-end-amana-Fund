import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultRedirectComponentComponent } from './default-redirect-component.component';

describe('DefaultRedirectComponentComponent', () => {
  let component: DefaultRedirectComponentComponent;
  let fixture: ComponentFixture<DefaultRedirectComponentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DefaultRedirectComponentComponent]
    });
    fixture = TestBed.createComponent(DefaultRedirectComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
