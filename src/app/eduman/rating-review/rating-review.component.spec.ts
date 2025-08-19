import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RatingReviewComponent } from './rating-review.component';

describe('RatingReviewComponent', () => {
  let component: RatingReviewComponent;
  let fixture: ComponentFixture<RatingReviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RatingReviewComponent]
    });
    fixture = TestBed.createComponent(RatingReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
