import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventdetailsmainComponent } from './eventdetailsmain.component';

describe('EventdetailsmainComponent', () => {
  let component: EventdetailsmainComponent;
  let fixture: ComponentFixture<EventdetailsmainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventdetailsmainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventdetailsmainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
