import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursetwomainComponent } from './coursetwomain.component';

describe('CoursetwomainComponent', () => {
  let component: CoursetwomainComponent;
  let fixture: ComponentFixture<CoursetwomainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoursetwomainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoursetwomainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
