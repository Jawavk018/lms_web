import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestimonialsliderComponent } from './testimonialslider.component';

describe('TestimonialsliderComponent', () => {
  let component: TestimonialsliderComponent;
  let fixture: ComponentFixture<TestimonialsliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestimonialsliderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestimonialsliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
