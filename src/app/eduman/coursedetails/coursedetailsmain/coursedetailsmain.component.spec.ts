import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursedetailsmainComponent } from './coursedetailsmain.component';

describe('CoursedetailsmainComponent', () => {
  let component: CoursedetailsmainComponent;
  let fixture: ComponentFixture<CoursedetailsmainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoursedetailsmainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoursedetailsmainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
