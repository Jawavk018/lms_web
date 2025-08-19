import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutinstructorComponent } from './aboutinstructor.component';

describe('AboutinstructorComponent', () => {
  let component: AboutinstructorComponent;
  let fixture: ComponentFixture<AboutinstructorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AboutinstructorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutinstructorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
