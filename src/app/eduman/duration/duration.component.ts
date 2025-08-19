import { Component, EventEmitter, Output } from '@angular/core';
import { ApiService } from 'src/app/providers/api/api.service';
import { ToastService } from 'src/app/providers/toast/toast.service';

@Component({
  selector: 'app-duration',
  templateUrl: './duration.component.html',
  styleUrls: ['./duration.component.scss']
})
export class DurationComponent {

  durationActive: boolean = false;
  durationList: any = [];
  @Output() selected = new EventEmitter();
  selectedList: any = [];

  constructor(private api: ApiService, private toastService: ToastService) { }

  showDuration() {
    this.durationActive = !this.durationActive;
  }

  ngOnInit(): void {
    this.getLevelList();
  }

  getLevelList() {
    let param: any = {};
    this.api.get("8000/api/ascend/learnhub/v1/get_course_duration", param).subscribe(
      (result) => {
        console.log(result);
        if (result != null) {
          this.durationList = result?.data ?? [];
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
      this.selectedList.push(cost?.duration);
    } else {
      this.selectedList.splice(this.selectedList.indexOf(cost?.duration), 1);
    }
    this.selected.emit(this.selectedList);
  }


}
