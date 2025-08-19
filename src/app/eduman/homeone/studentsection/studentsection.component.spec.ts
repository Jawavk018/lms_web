import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentsectionComponent } from './studentsection.component';

describe('StudentsectionComponent', () => {
  let component: StudentsectionComponent;
  let fixture: ComponentFixture<StudentsectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentsectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentsectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
