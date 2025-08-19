import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursebarComponent } from './coursebar.component';

describe('CoursebarComponent', () => {
  let component: CoursebarComponent;
  let fixture: ComponentFixture<CoursebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoursebarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoursebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
