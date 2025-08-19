import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaqtopicComponent } from './faqtopic.component';

describe('FaqtopicComponent', () => {
  let component: FaqtopicComponent;
  let fixture: ComponentFixture<FaqtopicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FaqtopicComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FaqtopicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
