import { NgModule } from "@angular/core";
import { Router, Routes } from "@angular/router";
import { RouterModule } from "@angular/router";
import { BlogmainComponent } from "./eduman/blog/blogmain/blogmain.component";
import { BlogdetailsmainComponent } from "./eduman/blogdetails/blogdetailsmain/blogdetailsmain.component";
import { CartmainComponent } from "./eduman/cart/cartmain/cartmain.component";
// import { CheckoutmainComponent } from './eduman/checkout/checkoutmain/checkoutmain.component';
import { ContactmainComponent } from "./eduman/contact/contactmain/contactmain.component";
import { CoursefourmainComponent } from "./eduman/course/coursefour/coursefourmain/coursefourmain.component";
import { CourseonemainComponent } from "./eduman/course/courseone/courseonemain/courseonemain.component";
import { CoursethreemainComponent } from "./eduman/course/coursethree/coursethreemain/coursethreemain.component";
import { CoursetwomainComponent } from "./eduman/course/coursetwo/coursetwomain/coursetwomain.component";
import { CoursedetailsmainComponent } from "./eduman/coursedetails/coursedetailsmain/coursedetailsmain.component";
import { ErrorpageComponent } from "./eduman/errorpage/errorpage.component";
import { EventmainComponent } from "./eduman/event/eventmain/eventmain.component";
import { EventdetailsmainComponent } from "./eduman/eventdetails/eventdetailsmain/eventdetailsmain.component";
import { FaqdetailsmainComponent } from "./eduman/faqdetails/faqdetailsmain/faqdetailsmain.component";
import { FaqmainComponent } from "./eduman/faqpage/faqmain/faqmain.component";
import { HomeonemainComponent } from "./eduman/homeone/homeonemain/homeonemain.component";
import { HomethreemainComponent } from "./eduman/homethree/homethreemain/homethreemain.component";
import { HometwomainComponent } from "./eduman/hometwo/hometwomain/hometwomain.component";
import { BecomeinstructormainComponent } from "./eduman/instructor/becomeinstructor/becomeinstructormain/becomeinstructormain.component";
import { InstructormainComponent } from "./eduman/instructor/instructormain/instructormain.component";
import { InstructorpromainComponent } from "./eduman/instructor/instructorpromain/instructorpromain.component";
import { MembershipmainComponent } from "./eduman/membership/membershipmain/membershipmain.component";
import { ShopmainComponent } from "./eduman/shop/shopmain/shopmain.component";
import { ShopdetailsmainComponent } from "./eduman/shopdetails/shopdetailsmain/shopdetailsmain.component";
import { WishlistmainComponent } from "./eduman/wishlist/wishlistmain/wishlistmain.component";
import { ZoomclassdetailsmainComponent } from "./eduman/zoom/zoomclassdetailsmain/zoomclassdetailsmain.component";
import { ZoomclassmainComponent } from "./eduman/zoom/zoomclassmain/zoomclassmain.component";
import { WebinarmainComponent } from "./eduman/webinar/webinarmain/webinarmain.component";
import { WebinardetailsmainComponent } from "./eduman/webinar/webinardetailsmain/webinardetailsmain.component";
import { SigninmainComponent } from "./eduman/credentials/signinmain/signinmain.component";
import { SignupmainComponent } from "./eduman/credentials/signupmain/signupmain.component";
import { ForgotpasswordmainComponent } from "./eduman/credentials/forgotpasswordmain/forgotpasswordmain.component";
import { StudentprofileComponent } from "./eduman/student/studentprofile/studentprofile.component";
import { LoginComponent } from "./eduman/login/login.component";
import { CategoriesComponent } from "./Admin/admin-menus/categories/categories.component";
import { SubCategoriesComponent } from "./Admin/admin-menus/sub-categories/sub-categories.component";
import { TopicsComponent } from "./Admin/admin-menus/topics/topics.component";
import { TrainerComponent } from "./eduman/common/header/headerone/trainer/trainer.component";
import { AddCourseComponent } from "./eduman/common/header/headerone/add-course/add-course.component";
import { ApiService } from "./providers/api/api.service";
import { AddCartComponent } from "./eduman/add-cart/add-cart.component";
import { ViewProfileComponent } from "./eduman/profile/view-profile/view-profile.component";
import { CommonHeaderComponent } from "./eduman/common-header/common-header.component";
import { TokenStorageService } from "./providers/token-storage.service";
import { CheckoutComponent } from "./eduman/checkout/checkout.component";
import { CreateProfileComponent } from "./eduman/create_profile/create-profile.component";
import { MylearningComponent } from "./eduman/mylearning/mylearning.component";
import { CreateSlidesComponent } from "./Admin/admin-menus/create-slides/create-slides.component";
import { SidemenuComponent } from "./Admin/sidemenu/sidemenu.component";
import { AddCourseContentComponent } from "./eduman/common/header/headerone/add-course-content/add-course-content.component";
import { SuccessComponent } from "./eduman/success/success.component";
import { AboutmainComponent } from "./eduman/about/aboutmain/aboutmain.component";
import { TermsConditionComponent } from "./eduman/terms-condition/terms-condition.component";
import { ResetpasswordComponent } from "./eduman/credentials/resetpassword/resetpassword.component";
import { RefundPolicyComponent } from "./eduman/common/footer/refund-policy/refund-policy.component";
import { PrivacyPolicyComponent } from "./eduman/common/footer/privacy-policy/privacy-policy.component";
import { GoToCourseComponent } from "./eduman/go-to-course/go-to-course.component";
import { SetpasswordComponent } from "./eduman/credentials/setpassword/setpassword.component";
import { AuthGuard } from "./providers/authGuard/authGuard.service";
import { QuestionersComponent } from "./eduman/questioners/questioners.component";
import { AssessmentTestComponent } from "./eduman/assessment-test/assessment-test.component";
import { FavoriteCoursesComponent } from "./eduman/favorite-courses/favorite-courses.component";
import { CourseDiscountComponent } from "./eduman/course-discount/course-discount.component";
import { OrganizationComponent } from "./eduman/organization/organization.component";
import { TutorComponent } from "./eduman/tutor/tutor.component";
import { ViewOrgTutorComponent } from "./eduman/view-org-tutor/view-org-tutor.component";
import { CourseCouponsComponent } from "./eduman/course-coupons/course-coupons.component";
import { OrgDashboardComponent } from "./eduman/org-dashboard/org-dashboard.component";
import { NotificationComponent } from "./eduman/notification/notification.component";
import { SurveyPollComponent } from "./eduman/survey-poll/survey-poll.component";
import { SurveyComponent } from "./survey/survey.component";
import { PollResultsComponent } from "./eduman/poll-results/poll-results.component";
import { CertificateHomeComponent } from "./eduman/certificate-home/certificate-home.component";
import { ViewOrganizationComponent } from "./eduman/view-organization/view-organization.component";

const routes: Routes = [
  {
    path: "",
    component: HomeonemainComponent,
    pathMatch: "full",
    canActivate: [AuthGuard],
  },
  {
    path: "home-2",
    component: HometwomainComponent,
  },
  {
    path: "home-3",
    component: HomethreemainComponent,
  },
  {
    path: "about",
    component: AboutmainComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "membership",
    component: MembershipmainComponent,
  },
  {
    path: "404-page",
    component: ErrorpageComponent,
  },
  {
    path: "contact",
    component: ContactmainComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "faq-page",
    component: FaqmainComponent,
  },
  {
    path: "faq-details",
    component: FaqdetailsmainComponent,
  },
  {
    path: "event",
    component: EventmainComponent,
  },
  {
    path: "event-details",
    component: EventdetailsmainComponent,
  },
  {
    path: "instructor",
    component: InstructormainComponent,
  },
  {
    path: "instructor-profile",
    component: InstructorpromainComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "become-instructor",
    component: BecomeinstructormainComponent,
  },
  {
    path: "student-profile",
    component: StudentprofileComponent,
  },
  {
    path: "blog",
    component: BlogmainComponent,
  },
  {
    path: "blog-details",
    component: BlogdetailsmainComponent,
  },
  {
    path: "wishlist",
    component: WishlistmainComponent,
  },
  {
    path: "cart",
    component: CartmainComponent,
    canActivate: [AuthGuard],
  },
  // {
  //   path: 'checkout',
  //   component: CheckoutmainComponent
  // },
  {
    path: "shop",
    component: ShopmainComponent,
  },
  {
    path: "shop-details",
    component: ShopdetailsmainComponent,
  },
  {
    path: "course",
    component: CourseonemainComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "course-2",
    component: CoursetwomainComponent,
  },
  {
    path: "course-3",
    component: CoursethreemainComponent,
  },
  {
    path: "course-4",
    component: CoursefourmainComponent,
  },
  {
    path: "course-details",
    component: CoursedetailsmainComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "zoom-class",
    component: ZoomclassmainComponent,
  },
  {
    path: "zoom-class-detalis",
    component: ZoomclassdetailsmainComponent,
  },
  {
    path: "webinar",
    component: WebinarmainComponent,
  },
  {
    path: "webinar-details",
    component: WebinardetailsmainComponent,
  },
  {
    path: "signin",
    component: SigninmainComponent,
  },
  {
    path: "signup",
    component: SignupmainComponent,
  },
  {
    path: "forgot-password",
    component: ForgotpasswordmainComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "reset-password",
    component: ResetpasswordComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "set-password",
    component: SetpasswordComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "login",
    component: LoginComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "instructorPage",
    component: TrainerComponent,
    canActivate: [AuthGuard],
  },
  // {
  //   path: 'add-course', component: AddCourseComponent, canActivate: [AuthGuard]
  // },

  {
    path: "add-course-content",
    component: AddCourseContentComponent,
    canActivate: [AuthGuard],
  },

  {
    path: "gotocourse",
    component: GoToCourseComponent,
    canActivate: [AuthGuard],
  },

  {
    path: "add-cart",
    component: AddCartComponent,
    canActivate: [AuthGuard],
  },

  {
    path: "viewprofile",
    component: ViewProfileComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "create-profile",
    component: CreateProfileComponent,
    canActivate: [AuthGuard],
  },

  {
    path: "header",
    component: CommonHeaderComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "cart-checkout",
    component: CheckoutComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "mylearning",
    component: MylearningComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "create-slide",
    component: CreateSlidesComponent,
  },
  {
    path: "category",
    component: CategoriesComponent,
    canActivate: [],
  },

  {
    path: "sub-category",
    component: SubCategoriesComponent,
    canActivate: [],
  },

  {
    path: "topics",
    component: TopicsComponent,
    canActivate: [],
  },
  {
    path: "sidemenu",
    component: SidemenuComponent,
    canActivate: [AuthGuard],
  },

  {
    path: "admin-menus",
    canActivate: [AuthGuard],
    loadChildren: () =>
      import("./Admin/admin-menus/admin-menus.module").then(
        (m) => m.AdminMenusModule
      ),
  },
  {
    path: "success",
    component: SuccessComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "terms",
    component: TermsConditionComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "refund-policy",
    component: RefundPolicyComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "privacy-policy",
    component: PrivacyPolicyComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "questioners",
    component: QuestionersComponent,
  },
  {
    path: "assessment-test",
    component: AssessmentTestComponent,
  },
  {
    path: "favorite-courses",
    component: FavoriteCoursesComponent,
  },
  {
    path: "course-discount",
    component: CourseDiscountComponent,
    // canActivate: [AuthGuard],
  },
  {
    path: "organization",
    component: OrganizationComponent,
    // canActivate: [AuthGuard],
  },
  {
    path: "tutor",
    component: TutorComponent,
    // canActivate: [AuthGuard],
  },
  {
    path: "viewOrgTutor",
    component: ViewOrgTutorComponent,
    canActivate: [AuthGuard],
  },
  {
  path: "course-coupons",
  component: CourseCouponsComponent,
  // canActivate: [AuthGuard],
  },
  {
    path: "course-coupons",
    component: CourseCouponsComponent,
    // canActivate: [AuthGuard],
  },
  {
    path: "orgDashboard",
    component: OrgDashboardComponent,
    // canActivate: [AuthGuard],
  },
  {
    path: "notification",
    component: NotificationComponent,
    canActivate: [AuthGuard],
  },
    {
  path: "survey-polls",
  component: SurveyPollComponent,
  // canActivate: [AuthGuard],
},
{
  path: "survey",
  component: SurveyComponent,
  // canActivate: [AuthGuard],
},
{
  path: "pollresult",
  component: PollResultsComponent,
  // canActivate: [AuthGuard],
},
{
  path: "certificateHome",
  component: CertificateHomeComponent,
  },
  {
    path: "ViewOrganization",
    component: ViewOrganizationComponent,
    canActivate: [],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
  constructor(
    private router: Router,
    public api: ApiService,
    private tokenStorageService: TokenStorageService
  ) {
    // let user = this.tokenStorageService.getUser();
    // if (user.selectedRole == 'Admin') {
    //   this.router.navigate(['/sidemenu'], { replaceUrl: true });
    // } else {
    //   if (user.selectedRole == 'Trainer' && user?.isTrainer) {
    //     this.router.navigate(['/instructorPage'], { replaceUrl: true });
    //   }
    //   else {
    //     this.router.navigateByUrl('/');
    //   }
    // }
  }
}
