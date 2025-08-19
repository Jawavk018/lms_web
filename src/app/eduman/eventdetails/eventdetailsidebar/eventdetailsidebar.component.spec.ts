import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventdetailsidebarComponent } from './eventdetailsidebar.component';

describe('EventdetailsidebarComponent', () => {
  let component: EventdetailsidebarComponent;
  let fixture: ComponentFixture<EventdetailsidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventdetailsidebarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventdetailsidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
