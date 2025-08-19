import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseCouponsComponent } from './course-coupons.component';

describe('CourseCouponsComponent', () => {
  let component: CourseCouponsComponent;
  let fixture: ComponentFixture<CourseCouponsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CourseCouponsComponent]
    });
    fixture = TestBed.createComponent(CourseCouponsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
