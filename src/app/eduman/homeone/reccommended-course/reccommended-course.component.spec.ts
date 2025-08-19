import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReccommendedCourseComponent } from './reccommended-course.component';

describe('ReccommendedCourseComponent', () => {
  let component: ReccommendedCourseComponent;
  let fixture: ComponentFixture<ReccommendedCourseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReccommendedCourseComponent]
    });
    fixture = TestBed.createComponent(ReccommendedCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
