import { Component, EventEmitter, Output } from '@angular/core';
import { ApiService } from 'src/app/providers/api/api.service';
import { ToastService } from 'src/app/providers/toast/toast.service';

@Component({
  selector: 'app-cost',
  templateUrl: './cost.component.html',
  styleUrls: ['./cost.component.scss']
})
export class CostComponent {
  costActive: boolean = false;
  costList: any = [];
  @Output() selected = new EventEmitter();
  selectedList: any = [];

  constructor(private api: ApiService, private toastService: ToastService) { }

  shopLanguage() {
    this.costActive = !this.costActive;
  }

  ngOnInit(): void {
    this.getLevelList();
  }

  getLevelList() {
    let param: any = {};
    this.api.get("8000/api/ascend/learnhub/v1/get_course_cost", param).subscribe(
      (result) => {
        console.log(result);
        if (result != null) {
          this.costList = result?.data ?? [];
        } else {
          this.toastService.showError("Something went wrong");
        }
      },
      (err) => {
        this.toastService.showError(err);
      }
    );
  }

  onChange(checked: any, cost: any) {
    if (checked?.checked) {
      this.selectedList.push(cost?.range);
    } else {
      this.selectedList.splice(this.selectedList.indexOf(cost?.range), 1);
    }
    this.selected.emit(this.selectedList);
  }

}
