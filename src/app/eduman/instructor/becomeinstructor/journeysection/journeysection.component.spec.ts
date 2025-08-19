import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JourneysectionComponent } from './journeysection.component';

describe('JourneysectionComponent', () => {
  let component: JourneysectionComponent;
  let fixture: ComponentFixture<JourneysectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JourneysectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JourneysectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
