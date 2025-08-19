import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SigninmainComponent } from './signinmain.component';

describe('SigninmainComponent', () => {
  let component: SigninmainComponent;
  let fixture: ComponentFixture<SigninmainComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SigninmainComponent]
    });
    fixture = TestBed.createComponent(SigninmainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
