import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseonemainComponent } from './courseonemain.component';

describe('CourseonemainComponent', () => {
  let component: CourseonemainComponent;
  let fixture: ComponentFixture<CourseonemainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CourseonemainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseonemainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
