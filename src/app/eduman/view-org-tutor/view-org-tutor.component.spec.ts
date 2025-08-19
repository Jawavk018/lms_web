import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewOrgTutorComponent } from './view-org-tutor.component';

describe('ViewOrgTutorComponent', () => {
  let component: ViewOrgTutorComponent;
  let fixture: ComponentFixture<ViewOrgTutorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewOrgTutorComponent]
    });
    fixture = TestBed.createComponent(ViewOrgTutorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
