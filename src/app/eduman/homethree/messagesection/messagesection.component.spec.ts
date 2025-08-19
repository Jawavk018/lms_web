import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagesectionComponent } from './messagesection.component';

describe('MessagesectionComponent', () => {
  let component: MessagesectionComponent;
  let fixture: ComponentFixture<MessagesectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MessagesectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MessagesectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
