import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountersectionComponent } from './countersection.component';

describe('CountersectionComponent', () => {
  let component: CountersectionComponent;
  let fixture: ComponentFixture<CountersectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CountersectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CountersectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
