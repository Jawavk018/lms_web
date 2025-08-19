import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewEncapsulation,
} from "@angular/core";
import { ApiService } from "src/app/providers/api/api.service";
import { ToastService } from "src/app/providers/toast/toast.service";
declare var $: any;

@Component({
  selector: "app-shopcat",
  templateUrl: "./shopcat.component.html",
  styleUrls: ["./shopcat.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class ShopcatComponent implements OnInit {
  //cart sidebar activation start
  shopCatActive: boolean = false;
  shopCat() {
    if (this.shopCatActive == false) {
      this.shopCatActive = true;
    } else {
      this.shopCatActive = false;
    }
  }

  isShowLoad: boolean = false;
  categoryList: any = [];
  @Output() selected = new EventEmitter();
  @Input() selectedCategory: any;
  selectedList: any = [];

  constructor(private api: ApiService, private toastService: ToastService) {}

  ngOnInit(): void {
    this.getcategoriesList();
    console.log(this.selectedCategory);
  }

  ngOnChanges(){
    console.log("changes")
    for(let i in this.categoryList){
      $("#category_"+i).prop("checked", false);
    }
    for(let i in this.categoryList){
      for(let j in this.selectedCategory){
        console.log(this.categoryList[i].categorySno == this.selectedCategory[j]);
        if(this.categoryList[i].categorySno == this.selectedCategory[j]){
          $("#category_"+i).prop("checked", true);
          break;
        }
      }
    }
  }

  getcategoriesList() {
    let param: any = {};
    this.api.get("8000/api/ascend/learnhub/v1/get_course_categories", param).subscribe(
      (result) => {
        console.log(result);
        this.isShowLoad = false;
        if (result != null) {
          this.categoryList = result?.data ?? [];
          setTimeout(()=>{
            for(let i in this.categoryList){
              for(let j in this.selectedCategory){
                console.log(this.categoryList[i].categorySno == this.selectedCategory[j]);
                if(this.categoryList[i].categorySno == this.selectedCategory[j]){
                  $("#category_"+i).prop("checked", true);
                  break;
                }
              }
            }
          },1000);
        } else {
          this.toastService.showError("Something went wrong");
        }
      },
      (err) => {
        this.toastService.showError(err);
      }
    );
  }

  onChange(checked: any, category: any) {
    if (checked?.checked) {
      this.selectedList.push(category?.categorySno);
    } else {
      this.selectedList.splice(
        this.selectedList.indexOf(category?.categorySno),
        1
      );
    }
    this.selected.emit(this.selectedList);
  }
}
