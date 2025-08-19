import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountersectionthreeComponent } from './countersectionthree.component';

describe('CountersectionthreeComponent', () => {
  let component: CountersectionthreeComponent;
  let fixture: ComponentFixture<CountersectionthreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CountersectionthreeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CountersectionthreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
