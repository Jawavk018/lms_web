import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NgxStarsModule } from "ngx-stars";
import { formatDistance } from "date-fns";

@Component({
  selector: "app-review",
  standalone: true,
  imports: [CommonModule, NgxStarsModule],
  templateUrl: "./review.component.html",
  styleUrls: ["./review.component.scss"],
})
export class ReviewComponent {
  @Input() review: any;

  constructor() {}

  ngOnInit() {
    console.log(this.review);
  }

  getFirstAndLastCharacters(str: string): string {
    if (str.length > 0) {
      const firstChar = str[0];
      const lastChar = str[str.length - 1];
      return `${firstChar}${lastChar}`?.toUpperCase();
    } else {
      return ""; // Return an empty string if the input string is empty
    }
  }

  formatTimestamp(timestamp: string): string {
    const parsedTimestamp = new Date(timestamp);
    const currentDate = new Date();
    return formatDistance(parsedTimestamp, currentDate, { addSuffix: true });
  }
}
