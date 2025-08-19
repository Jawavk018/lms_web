import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotpasswordmainComponent } from './forgotpasswordmain.component';

describe('ForgotpasswordmainComponent', () => {
  let component: ForgotpasswordmainComponent;
  let fixture: ComponentFixture<ForgotpasswordmainComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ForgotpasswordmainComponent]
    });
    fixture = TestBed.createComponent(ForgotpasswordmainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
