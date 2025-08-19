import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsectionComponent } from './eventsection.component';

describe('EventsectionComponent', () => {
  let component: EventsectionComponent;
  let fixture: ComponentFixture<EventsectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventsectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventsectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
