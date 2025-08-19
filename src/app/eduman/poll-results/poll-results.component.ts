import { Component, ElementRef, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { ApiService } from "src/app/providers/api/api.service";
import { ToastService } from "src/app/providers/toast/toast.service";
import { TokenStorageService } from "src/app/providers/token-storage.service";

@Component({
  selector: "app-poll-results",
  templateUrl: "./poll-results.component.html",
  styleUrls: ["./poll-results.component.scss"],
})
export class PollResultsComponent {
  polls: any;

  totalVotes: number = 0;
  userInfo: any = this.tokenService.getUser();
  selectedPollOptionSno: number | null = null;
  previousSelectedPollOptionSno: number | null = null;
  isView: boolean = false;
  poll: any;
  isPoll=true;
  
  @ViewChild("pollDetailsModal") public pollDetailsModal!: ElementRef ;
  @ViewChild("closepollmodal") public closePollModal!: ElementRef ;

  isOptionSelected: boolean = false;


  constructor(
    private router: Router,
    public api: ApiService,
    private toastService: ToastService,
    private tokenService: TokenStorageService
  ) {}

  ngOnInit(): void {
 
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if(!this.api.isApply){
        this.getpollResult();
      }
    }, 1000);  
  }
  
  calculateTotalVotes(): void {
    this.totalVotes = this.polls.options.reduce(
    (sum: any, option: any) => sum + option?.count,0);
   
  }

  calculatePercentage(count: number): number {
    const totalVotes = this.polls.options.reduce(
      (sum: any, option: any) => sum + option.count,
      0
    );
    return totalVotes > 0 ? (count / totalVotes) * 100 : 0;
  }

  getpollResult() {
    let param: any = { appUserSno: this.userInfo?.appUserSno };
    this.api.get("8000/api/ascend/learnhub/v1/get_poll_result", param).subscribe(
      (result) => {
        console.log(result);
        if (result != null) {
          if (result.data != null && result.data.length > 0) {
            this.polls = result?.data[0];
            this.previousSelectedPollOptionSno = this.polls.options.find((option: any) => option.selectedPollOptionSno != null)?.selectedPollOptionSno;
            // let isPoll = this.polls.options.find((option: any) => option.isPoll)?.isPoll;
            if(!this.previousSelectedPollOptionSno ){
              this.api.isApply = true;
              this.pollDetailsModal.nativeElement.click();
              this.calculateTotalVotes();
            }
           
          } else {
            this.api.isApply = true;
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

  savePoll() {
    let body: any = {};
    body.appUserSno = this.userInfo?.appUserSno;
    body.pollOptionSno = this.selectedPollOptionSno;
    body.isPoll = this.isPoll;
    body.pollQuestionSno = this.polls.pollQuestionSno;
    this.api.post("8000/api/ascend/learnhub/v1/insert_poll_response", body).subscribe(
      (result) => {
        console.log(result);
        if (result != null) {
          if(this.isPoll){
            this.onVote();
            this.toastService.showSuccess('Thanks for your contribution');
          }
          this.closePollModal.nativeElement.click();
        } else {
        }
      },
      (err) => {
        this.toastService.showError(err);
      }
    );
  }

  onVote(): void {
    const selectedPollOption = this.polls.options.find(
      (option: any) => option.pollOptionSno === this.selectedPollOptionSno
    );

    if (this.previousSelectedPollOptionSno !== null) {
      const previousSelectedOption = this.polls.options.find(
        (option: any) =>
          option.pollOptionSno === this.previousSelectedPollOptionSno
      );
      if (previousSelectedOption) {
        previousSelectedOption.count--;
        previousSelectedOption.selectedPollOptionSno = null;
      }
    }

    if (selectedPollOption) {
      selectedPollOption.count++;
      selectedPollOption.selectedPollOptionSno = this.selectedPollOptionSno;
      this.calculateTotalVotes();
      this.previousSelectedPollOptionSno = this.selectedPollOptionSno;
    }
    console.log(this.polls.options);
  }

  onPollOptionChange(option: any): void {
    console.log("Selected option:", option);
    this.selectedPollOptionSno = option.selectedPollOptionSno;
    console.log("Selected polloptionSno:", this.selectedPollOptionSno);
    this.isOptionSelected = true;
    // this.savePoll();
  }

  closeModal(){
    this.isPoll = false;
    this.savePoll();
    this.closePollModal.nativeElement.click();
  }


}
