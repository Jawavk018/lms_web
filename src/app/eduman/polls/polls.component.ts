import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/providers/api/api.service';
import { ToastService } from 'src/app/providers/toast/toast.service';
import { TokenStorageService } from 'src/app/providers/token-storage.service';

@Component({
  selector: 'app-polls',
  templateUrl: './polls.component.html',
  styleUrls: ['./polls.component.scss']
})
export class PollsComponent {

  userInfo: any = this.tokenService.getUser();
  pollsForm: any = FormGroup;
  pollList: any = [];
  pollTopics: any = [];
  pollSno: any;
  isUpdatePoll: boolean = false;
  isNoMoreRecord:boolean = false;
  questionList:any = [];
  isShowloading:boolean = false;


  modalScrollDistancePolls = 2;
  modalScrollThrottlePolls = 200;
  isSrollDownPolls: boolean = true;
  isNoMoreRecordPolls: boolean = true;
  deletePollQuestionsList: any = [];
  deletePollOptionsList: any = [];


  skip:number = 0;
  limit:number = 5;
  isLoad:boolean = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private api: ApiService,
    private toastService: ToastService,
    private tokenService: TokenStorageService
  ) {
  }

  ngOnInit(): void {

    this.pollsForm = this.fb.group({
      pollSno: new FormControl(null),
      title: new FormControl(null, [Validators.required]),
      description: new FormControl(null),
      questions: this.fb.array([]),
    });
    this.getPollTopics();
  }

  get getPollquestions(): FormArray {
    return this.pollsForm.get("questions") as FormArray;
  }

  addPollQuestion(): void {
    let question: any = this.fb.group({
      pollQuestionSno: new FormControl(null),
      questionText: new FormControl(null, [Validators.required]),
      options: this.fb.array([]),
    });
    this.getPollquestions.push(question);
    this.addPollOption(this.getPollquestions.length - 1);
  }

  removePollQuestion(index: number): void {
    console.log(this.getPollquestions.value[index]?.pollQuestionSno);
    if (this.getPollquestions.value[index]?.pollQuestionSno) {
      this.deletePollQuestionsList.push({
        pollQuestionSno: this.getPollquestions.value[index].pollQuestionSno,
      });
    }
    console.log(this.deletePollQuestionsList);
    this.getPollquestions.removeAt(index);
  }

  getPollOptions(questionIndex: number): FormArray {
    return this.getPollquestions.at(questionIndex).get("options") as FormArray;
  }

  addPollOption(questionIndex: number): void {
    this.getPollOptions(questionIndex).push(
      this.fb.group({
        pollOptionSno: new FormControl(null),
        optionText: new FormControl(null, [Validators.required]),
        status: new FormControl(true),
      })
    );
  }

  removePollOption(questionIndex: number, optionIndex: number): void {
    if (this.getPollOptions(questionIndex)?.value[optionIndex]?.pollOptionSno) {
      this.deletePollOptionsList.push({
        pollOptionSno:
          this.getPollOptions(questionIndex)?.value[optionIndex]?.pollOptionSno,
      });
    }
    this.getPollOptions(questionIndex).removeAt(optionIndex);
  }

  getPollTopics() {
    let param: any = { appUserSno: this.userInfo?.appUserSno };
    this.api.get("8000/api/ascend/learnhub/v1/get_poll_topics", param).subscribe(
      (result) => {
        console.log(result);
        if (result != null) {
          if (result?.data != null && result?.data.length > 0) {
            this.pollTopics = result?.data;
            this.addPollQuestion();
          } else {
            this.addPollQuestion();
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

  changePolls(i: number) {
    this.pollSno = this.pollTopics[i].pollSno;
    this.skip = 0;
    this.limit = 5;
    this.isNoMoreRecord = false;
    this.getPoll(this.pollSno);
  }

  getPoll(pollSno?: any) {
    let param: any = {};
    param.appUserSno = this.userInfo?.appUserSno;
    param.skip = this.skip;
    param.limit = this.limit;
    param.pollSno = pollSno;
    this.api.get("8000/api/ascend/learnhub/v1/get_poll", param).subscribe(
      (result) => {
        console.log(result);
        if (result != null) {
          if (result.data != null && result.data.length > 0) {
            let quesObj = structuredClone(result?.data[0]);
            let questions = result?.data[0]?.questions;
            this.questionList = questions;

            this.skip = this.skip + result?.data.length;
            this.isUpdatePoll = true;

            this.pollsForm = this.fb.group({
              pollSno: new FormControl(quesObj?.pollSno),
              title: new FormControl(quesObj?.title, [Validators.required]),
              description: new FormControl(quesObj?.description),
              questions: this.fb.array([]),
            });

            for (let i in this.questionList) {
              this.setQuestion(this.questionList[i]);
              if (parseInt(i) == this.questionList.length - 1) {
                this.isShowloading = false;
              }
            }
          } else {
            this.isShowloading = false;
            this.isNoMoreRecordPolls = true;
            this.isUpdatePoll = false;
            this.addPollQuestion();
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

  setQuestion(value: any) {
    console.log(value);
    // console.log(index);
    let question: any = this.fb.group({
      pollQuestionSno: new FormControl(value?.pollQuestionSno),
      questionText: new FormControl(value?.questionText, [Validators.required]),
      options: this.fb.array([]),
    });

    this.getPollquestions.push(question);
    let index = this.getPollquestions.value?.length - 1;

    for (let i in value?.options) {
      this.setOptions(index, value?.options[i]);
    }
  }

  setOptions(index: number, value: any) {
    let answer: any = this.fb.group({
      pollOptionSno: new FormControl(value?.pollOptionSno),
      optionText: new FormControl(value?.optionText, [Validators.required]),
      status: new FormControl(value?.status),
    });
    this.getPollOptions(index).push(answer);
  }


  getMoreTechQuestion() {
    this.getTechQuestion();
  }

  getTechQuestion() {
    this.isShowloading = true;
    // this.clear();
    let param: any = {};
    param.surveySno = this.pollSno;
    param.appUserSno = this.userInfo?.appUserSno;
    param.skip = this.skip;
    param.limit = this.limit;
    this.api.get("8000/api/ascend/learnhub/v1/get_survey", param).subscribe(
      (result) => {
        console.log(result);
        // this.isShowloading = false;
        if (result != null) {
          // this.toastService.showSuccess("Save Successfully");
          if (result?.data?.length) {
            this.questionList = result?.data;
            this.skip = this.skip + result?.data.length;
            this.isUpdatePoll = true;
            this.isShowloading = true;

            for (let i in this.questionList) {
              this.setQuestion(this.questionList[i]);
              if (parseInt(i) == this.questionList.length - 1) {
                this.isShowloading = false;
              }
            }
          } else {
            this.isShowloading = false;
            this.isNoMoreRecord = true;
            if (this.getPollquestions.value.length > 0) this.isUpdatePoll = true;
            else this.isUpdatePoll = false;
          }
        } else {
          this.isShowloading = false;
          this.isNoMoreRecord = true;
          this.toastService.showError(result?.data?.message);
        }
      },
      (err) => {
        this.toastService.showError(err);
      }
    );
  }

  savePoll() {
    let body: any = this.pollsForm.value;
    body.appUserSno = this.userInfo?.appUserSno ? this.userInfo?.appUserSno : 1;
    console.log(body);
    this.api.post("8000/api/ascend/learnhub/v1/insert_poll", body).subscribe(
      (result) => {
        console.log(result);
        if (result != null && result?.data) {
          this.toastService.showSuccess("Saved Successfully");
          this.getPollTopics();
          this.isUpdatePoll = true;
        } else {
          this.toastService.showError("Something went wrong");
        }
      },
      (err) => {
        this.toastService.showError(err);
      }
    );
  }

  updatePoll() {
    this.isLoad = true;
    let body: any = this.pollsForm.value;
    body.deletePollQuestionsList = this.deletePollQuestionsList;
    body.deletePollOptionsList = this.deletePollOptionsList;
    body.appUserSno = this.userInfo?.appUserSno;
    console.log(body);
    this.api.put("8000/api/ascend/learnhub/v1/update_poll", body).subscribe(
      (result: any) => {
        this.isLoad = false;
        if (result) {
          if (result?.data != null) {
            this.toastService.showSuccess("Update Successfully");
          }
        } else {
        }
      },
      (err) => {
        this.toastService.showError(err);
      }
    );
  }


  clearForm(): void {
    // Clear the questions FormArray
    while (this.getPollquestions.length !== 0) {
      this.getPollquestions.removeAt(0);
    }
    // Reset the form without triggering validation checks
    this.pollsForm.reset({});
    this.addPollQuestion();
    this.isUpdatePoll = false;
  }




}
