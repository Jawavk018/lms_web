import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MembershipmainComponent } from './membershipmain.component';

describe('MembershipmainComponent', () => {
  let component: MembershipmainComponent;
  let fixture: ComponentFixture<MembershipmainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MembershipmainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MembershipmainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
