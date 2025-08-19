import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoToCourseComponent } from './go-to-course.component';

describe('GoToCourseComponent', () => {
  let component: GoToCourseComponent;
  let fixture: ComponentFixture<GoToCourseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [GoToCourseComponent]
    });
    fixture = TestBed.createComponent(GoToCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
