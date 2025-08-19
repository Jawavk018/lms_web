import { Component, EventEmitter, Output } from "@angular/core";
import { ApiService } from "../providers/api/api.service";
import { ToastService } from "../providers/toast/toast.service";

@Component({
  selector: "app-rating-filter",
  templateUrl: "./rating-filter.component.html",
  styleUrls: ["./rating-filter.component.scss"],
})
export class RatingFilterComponent {
  ratingActive: boolean = false;
  ratingList: any = [];
  @Output() selected = new EventEmitter();
  selectedList: any = [];

  constructor(private api: ApiService, private toastService: ToastService) {}

  showRating() {
    this.ratingActive = !this.ratingActive;
  }

  ngOnInit(): void {
    this.getRatingList();
  }

  getRatingList() {
    let param: any = {};
    this.api.get("8000/api/ascend/learnhub/v1/get_course_star_rating", param).subscribe(
      (result) => {
        console.log(result);
        if (result != null) {
          this.ratingList = result?.data ?? [];
        } else {
          this.toastService.showError("Something went wrong");
        }
      },
      (err) => {
        this.toastService.showError(err);
      }
    );
  }

  onChange(checked: any, rating: any) {
    if (checked?.checked) {
      this.selectedList.push(rating?.ratingRange);
    } else {
      this.selectedList.splice(this.selectedList.indexOf(rating?.ratingRange), 1);
    }
    console.log(this.selectedList);
    this.selected.emit(this.selectedList);
  }
}
