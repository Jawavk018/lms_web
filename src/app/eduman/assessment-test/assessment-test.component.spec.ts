import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentTestComponent } from './assessment-test.component';

describe('AssessmentTestComponent', () => {
  let component: AssessmentTestComponent;
  let fixture: ComponentFixture<AssessmentTestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssessmentTestComponent]
    });
    fixture = TestBed.createComponent(AssessmentTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
