import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestimonialthreeComponent } from './testimonialthree.component';

describe('TestimonialthreeComponent', () => {
  let component: TestimonialthreeComponent;
  let fixture: ComponentFixture<TestimonialthreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestimonialthreeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestimonialthreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
