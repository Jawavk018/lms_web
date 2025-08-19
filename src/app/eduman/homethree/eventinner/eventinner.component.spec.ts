import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventinnerComponent } from './eventinner.component';

describe('EventinnerComponent', () => {
  let component: EventinnerComponent;
  let fixture: ComponentFixture<EventinnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventinnerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
