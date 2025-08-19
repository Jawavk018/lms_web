import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseDiscountComponent } from './course-discount.component';

describe('CourseDiscountComponent', () => {
  let component: CourseDiscountComponent;
  let fixture: ComponentFixture<CourseDiscountComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CourseDiscountComponent]
    });
    fixture = TestBed.createComponent(CourseDiscountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
