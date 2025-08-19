import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSyllabusComponent } from './view-syllabus.component';

describe('ViewSyllabusComponent', () => {
  let component: ViewSyllabusComponent;
  let fixture: ComponentFixture<ViewSyllabusComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewSyllabusComponent]
    });
    fixture = TestBed.createComponent(ViewSyllabusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
