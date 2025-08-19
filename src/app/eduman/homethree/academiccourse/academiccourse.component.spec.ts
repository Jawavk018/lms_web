import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcademiccourseComponent } from './academiccourse.component';

describe('AcademiccourseComponent', () => {
  let component: AcademiccourseComponent;
  let fixture: ComponentFixture<AcademiccourseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcademiccourseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AcademiccourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
