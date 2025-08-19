import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ApiService } from 'src/app/providers/api/api.service';


@Component({
  selector: 'app-countersectionthree',
  templateUrl: './countersectionthree.component.html',
  styleUrls: ['./countersectionthree.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CountersectionthreeComponent implements OnInit {
  isLoad:any;
  counters:any;
  constructor(private api: ApiService) { }

  ngOnInit(): void {
    this.dashboardCounts();
  }

  dashboardCounts(){
    this.isLoad = true;
    let body:any = {};
    this.api.post("8000/api/ascend/learnhub/v1/dashboard_counts", body).subscribe(
      (result) => {
        this.isLoad = false;
        if (result != null && result.data != null) {
          this.counters = result.data;
        }
      },
      (err) => {
        this.isLoad = false;
      }
    );
  }

}


