import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeachersectionComponent } from './teachersection.component';

describe('TeachersectionComponent', () => {
  let component: TeachersectionComponent;
  let fixture: ComponentFixture<TeachersectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeachersectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeachersectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
