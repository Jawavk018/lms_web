import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EducationsectionComponent } from './educationsection.component';

describe('EducationsectionComponent', () => {
  let component: EducationsectionComponent;
  let fixture: ComponentFixture<EducationsectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EducationsectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EducationsectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
