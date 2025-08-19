import { Component, EventEmitter, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { ApiService } from 'src/app/providers/api/api.service';
import { ToastService } from 'src/app/providers/toast/toast.service';

@Component({
  selector: 'app-shoplevel',
  templateUrl: './shoplevel.component.html',
  styleUrls: ['./shoplevel.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ShoplevelComponent implements OnInit {
  shopLevelActive: boolean = false;
  shopLevel() {
    if (this.shopLevelActive == false) {
      this.shopLevelActive = true;
    }
    else {
      this.shopLevelActive = false;
    }
  }


  isShowLoad: boolean = false;
  levelList: any = [];
  @Output() selected = new EventEmitter();
  selectedList: any = [];

  constructor(private api: ApiService, private toastService: ToastService) { }

  ngOnInit(): void {
    this.getLevelList();
  }

  getLevelList() {
    let param: any = {};
    this.api.get("8000/api/ascend/learnhub/v1/get_course_level", param).subscribe(
      (result) => {
        console.log(result);
        this.isShowLoad = false;
        if (result != null) {
          this.levelList = result?.data ?? [];
        } else {
          this.toastService.showError("Something went wrong");
        }
      },
      (err) => {
        this.toastService.showError(err);
      }
    );
  }

  onChange(checked: any, level: any) {
    if (checked?.checked) {
      this.selectedList.push(level?.levelSno);
    } else {
      this.selectedList.splice(this.selectedList.indexOf(level?.levelSno), 1);
    }
    this.selected.emit(this.selectedList);
  }
}
