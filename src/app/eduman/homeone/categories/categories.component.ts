import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ApiService } from 'src/app/providers/api/api.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CategoriesComponent implements OnInit {

  categoriesLimit: any = [];

  constructor(private api: ApiService) { }

  ngOnInit(): void {
  this.getCategories();
  }

  getCategories() {
    let params: any = {};
    params.skip = 0;
    params.limit = 9;
    this.api.get('8000/api/ascend/learnhub/v1/get_categories', params).subscribe((result) => {
      console.log(result);
      if (result) {
        this.categoriesLimit = result?.data ?? [];
      }
    })
  }

}
