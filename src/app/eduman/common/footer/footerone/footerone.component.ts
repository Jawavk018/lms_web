import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ApiService } from 'src/app/providers/api/api.service';

@Component({
  selector: 'app-footerone',
  templateUrl: './footerone.component.html',
  styleUrls: ['./footerone.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FooteroneComponent implements OnInit {

  categoryList: any = [];

  constructor(private api:ApiService) { }

  ngOnInit(): void {
    this.getcategoryList();
  }

  getcategoryList() {
    let param: any = {};
    this.api.get("8000/api/ascend/learnhub/v1/get_mapped_category", param).subscribe(
      (result) => {
        console.log(result);
        if (result != null) {
          if (result.data != null) {
            this.categoryList = result.data;
          }
        } 
      }
    );
  }
}
