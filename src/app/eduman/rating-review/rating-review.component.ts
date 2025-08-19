import { Component, Inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ApiService } from "src/app/providers/api/api.service";
import { NgxStarsModule } from "ngx-stars";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-rating-review",
  standalone: true,
  imports: [CommonModule, NgxStarsModule, FormsModule],
  templateUrl: "./rating-review.component.html",
  styleUrls: ["./rating-review.component.scss"],
})
export class RatingReviewComponent {
  ratingDisplay: number = 0;
  ratingValue: any = "Awful, not what I expected at all";
  rating: any = [
    {
      rating: 0.5,
      display: "Awful, not what I expected at all",
    },
    {
      rating: 1,
      display: "Awful, not what I expected at all",
    },
    {
      rating: 1.5,
      display: "Awful / Poor",
    },
    {
      rating: 2,
      display: "Poor, pretty disappointed",
    },
    {
      rating: 2.5,
      display: "Poor / Average",
    },
    {
      rating: 3,
      display: "Average, could be better",
    },
    {
      rating: 3.5,
      display: "Average / Good",
    },
    {
      rating: 4,
      display: "Good, what I expected",
    },
    {
      rating: 4.5,
      display: "Good / Amazing",
    },
    {
      rating: 5,
      display: "Amazing, above expectations!",
    },
  ];
  review: any = "";

  constructor(
    public dialogRef: MatDialogRef<RatingReviewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private api: ApiService
  ) {}

  ngOnInit() {
    if (this.data?.ratingReview) {
      this.onRatingSet(this.data?.ratingReview?.rating ?? 0);
      this.review = this.data?.ratingReview?.review;
    }
  }

  onRatingSet(rating: number): void {
    this.ratingDisplay = rating;
    let msg = this.rating.find((rat: any) => rat.rating == rating);
    this.ratingValue = msg?.display;
  }

  createReview() {
    let body: any = {};
    body.rating = this.ratingDisplay;
    body.review = this.review;
    body.courseSno = this.data?.courseSno;
    body.appUserSno = this.data?.appUserSno;
    this.api
      .post("8000/api/ascend/learnhub/v1/set_rating_review", body)
      .subscribe((result) => {
        if (result) {
          console.log(result);
          this.dialogRef.close({
            rating: this.ratingDisplay,
            review: this.review,
          });
        }
      });
  }

  close() {
    this.dialogRef.close();
  }
}
