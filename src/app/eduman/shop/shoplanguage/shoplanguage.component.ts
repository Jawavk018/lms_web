import { Component, EventEmitter, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { ApiService } from 'src/app/providers/api/api.service';
import { ToastService } from 'src/app/providers/toast/toast.service';

@Component({
  selector: 'app-shoplanguage',
  templateUrl: './shoplanguage.component.html',
  styleUrls: ['./shoplanguage.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ShoplanguageComponent implements OnInit {
  shopLanguageActive: boolean = false;
  shopLanguage() {
    if (this.shopLanguageActive == false) {
      this.shopLanguageActive = true;
    }
    else {
      this.shopLanguageActive = false;
    }
  }

  languageList: any = [];
  @Output() selected = new EventEmitter();
  selectedList: any = [];

  constructor(private api: ApiService, private toastService: ToastService) { }

  ngOnInit(): void {
    this.getLevelList();
  }

  getLevelList() {
    let param: any = {};
    this.api.get("8000/api/ascend/learnhub/v1/get_course_language", param).subscribe(
      (result) => {
        console.log(result);
        if (result != null) {
          this.languageList = result?.data ?? [];
        } else {
          this.toastService.showError("Something went wrong");
        }
      },
      (err) => {
        this.toastService.showError(err);
      }
    );
  }

  onChange(checked: any, language: any) {
    if (checked?.checked) {
      this.selectedList.push(language?.languageSno);
    } else {
      this.selectedList.splice(this.selectedList.indexOf(language?.languageSno), 1);
    }
    this.selected.emit(this.selectedList);
  }

}
