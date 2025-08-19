import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/providers/api/api.service';
import { ToastService } from 'src/app/providers/toast/toast.service';

@Component({
  selector: 'app-categorymenu',
  templateUrl: './categorymenu.component.html',
  styleUrls: ['./categorymenu.component.scss']
})
export class CategorymenuComponent implements OnInit {

  categoryList: any = [];

  ngOnInit(): void {
    this.getcategoryList();
  }

  constructor(private api:ApiService,private toastService:ToastService) { }

  getcategoryList() {
    let param: any = {};
    this.api.get("8000/api/ascend/learnhub/v1/get_mapped_category", param).subscribe(
      (result) => {
        console.log(result);
        if (result != null) {
          if (result.data != null && result.data.length > 0) {
            this.categoryList = result.data;
          } else {
          }
        } else {
          this.toastService.showError("Something went wrong");
        }
      },
      (err) => {
        this.toastService.showError(err);
      }
    );
  }

  // categoryList:any= [
  //   {
  //     categoryId: 1,
  //     categoryName: "Development",
  //     routerLink: "/course",
  //     subCategory: [
  //       {
  //         subCategoryId: 11,
  //         subCategoryName: "All Development",
  //         routerLink:"/course"
  //       },
  //       {
  //         subCategoryId: 12,
  //         subCategoryName: "Mobile App",
  //         routerLink: "/course"

  //       },
  //       {
  //         subCategoryId: 13,
  //         subCategoryName: "Web Development",
  //         routerLink: "/course"

  //       },
  //       {
  //         subCategoryId: 14,
  //         subCategoryName: "Development tools",
  //         routerLink: "/course"

  //       },
  //       {
  //         subCategoryId: 15,
  //         subCategoryName: "Database",
  //         routerLink: "/course"

  //       },
  //       {
  //         subCategoryId: 16,
  //         subCategoryName: "Programming language",
  //         routerLink: "/course"

  //       }
  //     ]
  //   },
  //   {
  //     categoryId: 2,
  //     categoryName: "Art & Design",
  //     routerLink: "/course",
  //     subCategory: [
  //       {
  //         subCategoryId: 17,
  //         subCategoryName: "Web Design",
  //         routerLink: 
  //           "/course"
  //       },
  //       {
  //         subCategoryId: 18,
  //         subCategoryName: "Graphic Design",
  //         routerLink: "/course"
  //       },
  //       {
  //         subCategoryId: 19,
  //         subCategoryName: "Design tools",
  //         routerLink: "/course"
  //       },
  //       {
  //         subCategoryId: 20,
  //         subCategoryName: "All Art",
  //         routerLink: "/course"
  //       },
  //       {
  //         subCategoryId: 21,
  //         subCategoryName: "Marketing",
  //         routerLink: "/course"
  //       }
  //     ]
  //   },
  //   {
  //     categoryId: 3,
  //     categoryName: "Business",
  //     routerLink: "/course",
  //     subCategory: [
  //       {
  //         subCategoryId: 22,
  //         subCategoryName: "All Business",
  //         routerLink: "/course"
  //       },
  //       {
  //         subCategoryId: 23,
  //         subCategoryName: "Communications",
  //         routerLink: "/course"
  //       },
  //       {
  //         subCategoryId: 24,
  //         subCategoryName: "Finance",
  //         routerLink: "/course"
  //       },
  //       {
  //         subCategoryId: 25,
  //         subCategoryName: "Management",
  //         routerLink: "/course"
  //       },
  //       {
  //         subCategoryId: 26,
  //         subCategoryName: "Sales",
  //         routerLink: "/course"
  //       }
  //     ]
  //   },
  //   {
  //     categoryId: 4,
  //     categoryName: "Life Style",
  //     routerLink: "/course",
  //     subCategory: [
  //       {
  //         subCategoryId: 27,
  //         subCategoryName: "Life Style",
  //         routerLink: "/course"
  //       },
  //       {
  //         subCategoryId: 28,
  //         subCategoryName: "Mental Health",
  //         routerLink: "/course"
  //       },
  //       {
  //         subCategoryId: 29,
  //         subCategoryName: "Dieting",
  //         routerLink: "/course"
  //       },
  //       {
  //         subCategoryId: 30,
  //         subCategoryName: "All Art",
  //         routerLink: "/course"
  //       },
  //       {
  //         subCategoryId: 31,
  //         subCategoryName: "Nutrition",
  //         routerLink: "/course"
  //       }
  //     ]
  //   },
  //   {
  //     categoryId: 5,
  //     categoryName: "Health & Fitness",
  //     routerLink: "/course",
  //     subCategory: [
  //       {
  //         subCategoryId: 32,
  //         subCategoryName: "All Health & Fitness",
  //         routerLink: "/course"
  //       },
  //       {
  //         subCategoryId: 33,
  //         subCategoryName: "Beauty & Makeup",
  //         routerLink: "/course"
  //       },
  //       {
  //         subCategoryId: 34,
  //         subCategoryName: "Food & Beverages",
  //         routerLink: "/course"
  //       },
  //       {
  //         subCategoryId: 35,
  //         subCategoryName: "Good Food",
  //         routerLink: "/course"
  //       }
  //     ]
  //   },
  //   {
  //     categoryId: 6,
  //     categoryName: "Data Science",
  //     routerLink: "/course"
  //   },
  //   {
  //     categoryId: 7,
  //     categoryName: "Marketing",
  //     routerLink: "/course"
  //   },
  //   {
  //     categoryId: 8,
  //     categoryName: "Photography",
  //     routerLink: "/course"
  //   }
  // ]
}

