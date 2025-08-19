import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "src/app/providers/api/api.service";
import { ToastrService } from "ngx-toastr";
import { TokenStorageService } from "src/app/providers/token-storage.service";
import { ToastService } from "src/app/providers/toast/toast.service";
import { EdumanModule } from "../eduman.module";
import { DomSanitizer } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
declare var $: any;
import Swal from "sweetalert2";
import { FooteroneComponent } from "../common/footer/footerone/footerone.component";

@Component({
  selector: "app-add-cart",
  templateUrl: "./add-cart.component.html",
  styleUrls: ["./add-cart.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class AddCartComponent implements OnInit {
  isButtonDisabled: boolean = true;
  cardDetails: any = [];
  appUser: any = this.tokenStorage.getUser();
  cartTotalHours: string = "00:03:15.471";
  formattedDuration: string = "";
  paymentForm: any = "";
  private secretKey: string = "DCBB1710D7D29A957151695DADE6EE8D";
  data: any;
  dpiit: any;
  isLoading: boolean = false;
  couponDetails: any;
  courseCouponType: any;

  couponAmount: any = 0;
  entitySno: any;
  couponPercentage: any;
  appliedEntityCouponSno: any;
  coursesCouponList: any = [];
  myCourseCoupon: any = [];
  courseCouponSno: any;
  couponCourseMasterSno: any;
  courseName: any;
  availCoursePrice: any = 0;
  availDiscountPrice: any = 0;


  constructor(
    private api: ApiService,
    public toastrService: ToastrService,
    private tokenStorage: TokenStorageService,
    private toastService: ToastService,
    public sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private router: Router
  ) {
    // this.paymentForm = 'https://secure.ccavenue.com/transaction/transaction.do?command=initiateTransaction&encRequest=c9ba14c44976353fff9daba733f27ebcb1b2b640d93ccfebd131363cf7fc2461144a9a1745f06012de6f265a75fc5ea850429310eec80df6684fe8fda72a3f3d6ef4cc865d81c15f3f7defbf49858541dd8bdaef18efef423348589d84caf26f1b33c7ab0b946c92cc741fd6a4f8179f&access_code=AVXQ78LD23AU06QXUA'
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params["data"]) {
        this.data = JSON.parse(params["data"]);
        console.log(this.data);
        $(document).ready(() => {
          $("#payment").click();
        });
      }
    });
    this.getCart();
    // this.loadPaymentForm();
    // this.getPayment();
    // this.getAllCoursesCoupon();
  }

  // async loadPaymentForm(): Promise<void> {
  //   let paymentForm = `https://test.ccavenue.com/transaction/transaction.do?command=initiateTransactio&encRequest=
  //   ${this.encrypt(`merchant_id=${3443286}&order_id=12345678&amount=100&currency=INR&redirect_url=http://localhost:4201/`)}&access_code=AVXQ78LD23AU06QXUA`;
  //   this.paymentForm = paymentForm;
  // }

  // getPayment() {
  //   this.api.get('8000/api/ascend/learnhub/v1/payment', {}).subscribe((result) => {
  //     console.log(result?.productionUrl);
  //     this.paymentForm = result?.productionUrl;
  //   });
  // }

  remove() { }

  checkout() {
    let params: any = {};
    if (this.appUser?.appUserSno) {
      params.appUserSno = this.appUser?.appUserSno;
    }
    // params['cartSno'] = this.cardDetails?.cartSno;
    // params['entitySno'] = this.entitySno; // Assuming this.entitySno is available
    // params['price'] = 499;
    // if (this.appUser?.appUserSno) {
    //   params.appUserSno = this.appUser?.appUserSno
    // }
    // params.appUserSno = this.appUser.appUserSno;
    params.cartSno = this.cardDetails?.cartSno;
    if (this.courseCouponSno) {
      params.courseCouponSno = this.courseCouponSno;
      params.courseMasterSno = this.couponCourseMasterSno;
      Object.assign(params, this.couponDetails);
      
    }
    // params.appliedEntityCouponSno = this.appliedEntityCouponSno;
    // params.price = 499;
    console.log(params);
    this.api
      .post("8000/api/ascend/learnhub/v1/create_purchase_course", params)
      .subscribe((result) => {
        console.log(result);
        if (result != null) {
          if (result?.data != null) {
            if (result.data.orderSno) {
              this.api.cartCount = 0;
              this.toastrService.success("Course purchase successfully.");
              this.router.navigate(["/mylearning"], { replaceUrl: true });
              // window.location.href = result.data.paymentUrl;
            }
            // if (result?.data?.paymentUrl) {
            //   window.location.href = result?.data?.paymentUrl;
            // }
          }
        }
      });
  }

  formatTime(timeString: string): string {
    if (!timeString) {
      return "0 secs";
    }

    const parts = timeString.split(":");
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);
    const seconds = Math.round(parseFloat(parts[2])); // Round seconds

    let result = "";
    if (hours > 0) {
      result += `${hours}hrs `;
    }
    if (minutes > 0) {
      result += `${minutes}mins `;
    }
    result += `${seconds}secs`;

    return result.trim();
  }

  getCart() {
    let params: any = {};
    if (this.appUser?.appUserSno) {
      params.appUserSno = this.appUser?.appUserSno;
    }
    this.api.get("8000/api/ascend/learnhub/v1/get_cart", params).subscribe((result) => {
      console.log(result);
      if (result != null) {
        if (result.data != null) {
          this.cardDetails = result.data[0];
          console.log("cardDetails");
          console.log(this.cardDetails);
          // this.getMyCoupon();
        }
      }
    });
  }

  removeFromCart(index: any) {
    let body: any = {
      cartSno: this.cardDetails.cartSno,
      cartCourseSno: this.cardDetails.cartCourse[index].cartCourseSno,
    };
    this.api.delete("8000/api/ascend/learnhub/v1/delete_cart", body).subscribe(
      (result: any) => {
        console.log(result);
        if (result != null && result?.data?.isUpdate) {
          let course = this.cardDetails.cartCourse[index];
          let priceToSubtract = course.courseDiscountPrice !== null ? course.courseDiscountPrice : course.price;
          
          // Subtract the price from the total price
          this.cardDetails.totalPrice -= priceToSubtract;
          this.couponAmount -= priceToSubtract;
          
          // Check if the removed course has an applied coupon
          if (course.courseMasterSno === this.couponCourseMasterSno) {
            // Reset coupon-related properties
            this.couponPercentage = null;
            this.courseCouponSno = null;
            this.courseCouponType = null;
            this.couponCourseMasterSno = null;
            this.availCoursePrice = null;
            this.courseName = null;
            this.couponAmount = null;
            this.availDiscountPrice = null;
          }
  
          // Remove the course from the cart
          this.cardDetails.cartCourse.splice(index, 1);
          console.log(this.cardDetails?.cartCourse);
          this.api.cartCount--;
          this.toastService.showSuccess("Removed Successfully");
        } else {
          // Handle unsuccessful removal if needed
        }
      },
      (err) => {
        this.toastService.showError(err);
      }
    );
  }

  // removeFromCart(index: any) {
  //   alert(index)
  //   let body: any = {
  //     cartSno: this.cardDetails.cartSno,
  //     cartCourseSno: this.cardDetails.cartCourse[index].cartCourseSno,
  //   };
  //   this.api.delete("8000/api/ascend/learnhub/v1/delete_cart", body).subscribe(
  //     (result: any) => {
  //       console.log(result);
  //       if (result != null && result?.data?.isUpdate) {
  //         // this.cardDetails.totalPrice =
  //         //   this.cardDetails.totalPrice -
  //         //   this.cardDetails.cartCourse[index].price;
  //         let course = this.cardDetails.cartCourse[index];
  //         let priceToSubtract = course.courseDiscountPrice !== null ? course.courseDiscountPrice : course.price;
  //         this.cardDetails.totalPrice -= priceToSubtract;
  //         this.cardDetails.cartCourse.splice(index, 1);
  //         console.log(this.cardDetails?.cartCourse);
  //         this.api.cartCount--;
  //         this.toastService.showSuccess("Removed Successfully");
  //       } else {
  //       }
  //     },
  //     (err) => {
  //       this.toastService.showError(err);
  //     }
  //   );
  // }

  // checkCoupon() {
  //   this.isLoading = true;
  //   let params: any = {};
  //   if (this.appUser?.appUserSno) {
  //     params.appUserSno = this.appUser?.appUserSno;
  //   }
  //   params.dpiit = this.dpiit;
  //   console.log(params);
  //   this.api
  //     .get("8000/api/ascend/learnhub/v1/check_coupon_valid", params)
  //     .subscribe((result) => {
  //       this.isLoading = false;
  //       if (result != null) {
  //         if (result?.data) {
  //           this.couponDetails = result.data[0];
  //           console.log("hii");
  //           console.log(this.couponDetails);
  //           const price = this.cardDetails["totalPrice"];
  //           if (this.couponDetails?.entitySno != null) {
  //             this.couponPercentage = this.couponDetails["percentage"];
  //             this.entitySno = this.couponDetails["entitySno"];
  //             this.couponAmount =
  //               Math.round((price / 100) * this.couponPercentage) - 1;
  //             this.celebrate();
  //           } else {
  //             this.toastService.showError(this.couponDetails?.msg);
  //           }
  //         }
  //       }
  //     });
  // }

  async celebrate() {
    Swal.fire("Your coupon is successfully applied!", " ", "success");
  }

  getAllCoursesCoupon(){
    let params: any = {}
    this.api.get('8019/api/ascend/learnhub/v1/get_course_coupon',params).subscribe((result) =>{
      if(result  != null){
        this.coursesCouponList = result?.data;
        console.log(this.coursesCouponList)
      }
      this.getMyCoupon();
    })
  }

  getMyCoupon() {
    console.log(this.cardDetails?.cartCourse);
    for (let i = 0; i < this.coursesCouponList.length; i++) {
        const coupon = this.coursesCouponList[i];
        if (coupon.isapplyToAllCourses) {
            this.myCourseCoupon.push(coupon);
        } else {
            for (let j = 0; j < this.cardDetails?.cartCourse.length; j++) {
                const cartCourse = this.cardDetails.cartCourse[j];
                
                if (coupon.courseMasterSno.includes(cartCourse.courseMasterSno)) {
                    this.myCourseCoupon.push(coupon);
                    break;
                }
            }
        }
    }
    console.log(this.myCourseCoupon);
}

checkCoupon() {
  const courses = this.cardDetails.cartCourse;
  let couponApplied = false;
  for (const course of courses) {
    let coursePrice = course.price;
    const coupons = course.myCourseCoupons;
    console.log(coupons)
    if (coupons && coupons.length > 0) {
      for (const coupon of course.myCourseCoupons) {
        if (coupon.couponCode == this.dpiit) {
          couponApplied = true; // Set the flag if a coupon is applied
          this.couponPercentage = coupon.couponValue;
          this.courseCouponSno = coupon.courseCouponSno;
          this.courseCouponType = coupon.couponValueTypeName;
          this.couponCourseMasterSno = course.courseMasterSno;
          this.availCoursePrice = coursePrice;
          this.courseName = course.title;
          if (this.courseCouponType == "Flat") {
            this.couponAmount =
              Math.round((coursePrice / 100) * this.couponPercentage) - 1;
            this.availDiscountPrice = coursePrice - this.couponAmount;
          } else {
            this.couponAmount =
              Math.round(this.couponPercentage);
            this.availDiscountPrice = coursePrice - this.couponAmount;
          }
        }
      }
    } else {
      console.log(`Coupon not applied for the course`);
    }
  }
  if (couponApplied) {
    this.checkCoupons(); // Call checkCoupons after processing all courses
  } else {
    Swal.fire("Cancelled!", "You can't apply this coupon for these courses", "error");
  }
}


checkCoupons() {
  this.isLoading = true;
  let params: any = {};
  if (this.appUser?.appUserSno) {
    params.appUserSno = this.appUser?.appUserSno;
  }
  params.couponCode = this.dpiit;
  console.log(params);
  this.api
    .get("8019/api/ascend/learnhub/v1/check_coupon_used", params)
    .subscribe((result) => {
      this.isLoading = false;
      if (result != null) {
        if (result?.data) {
          this.couponDetails = result.data[0];
          console.log(this.couponDetails);
          const price = this.cardDetails["totalPrice"];
          console.log(price)
          console.log(this.couponAmount)
          this.couponAmount = price - this.couponAmount
          console.log(this.couponAmount)
          this.celebrate();
          // if (this.couponDetails?.courseCouponSno != null) {
          //   this.couponPercentage = this.couponDetails["couponValue"];
          //   this.courseCouponSno = this.couponDetails["courseCouponSno"];
          //   this.courseCouponType = this.couponDetails["couponValueTypeName"];
          //   if (this.courseCouponType == "Flat") {
          //     this.couponAmount =
          //       Math.round((price / 100) * this.couponPercentage) - 1;
          //     console.log(this.couponAmount)
          //   } else {
          //     this.couponAmount =
          //       Math.round(this.couponPercentage);
          //     console.log(this.couponAmount)
          //   }
          //   this.couponAmount = this.cardDetails["totalPrice"] - this.couponAmount
          //   console.log(this.couponAmount)
          //   this.celebrate();
          // } else {
          //   this.toastService.showError(this.couponDetails?.msg);
          // }
        }
      }
    });
}

copyCouponCode(couponCode: string) {
  // Create a temporary textarea element to hold the coupon code
  const tempTextArea = document.createElement('textarea');
  tempTextArea.value = couponCode;
  document.body.appendChild(tempTextArea);
  
  // Select and copy the coupon code
  tempTextArea.select();
  document.execCommand('copy');
  
  // Remove the temporary textarea element
  document.body.removeChild(tempTextArea);

  // Provide feedback to the user (optional)
  // alert(`Coupon code ${couponCode} copied to clipboard!`);
  this.toastService.showSuccess(`Coupon code ${couponCode} copied to clipboard!`);

}



}
