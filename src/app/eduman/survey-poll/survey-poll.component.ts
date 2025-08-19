import { Component } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { ApiService } from "src/app/providers/api/api.service";
import { FileUploadService } from "src/app/providers/socket/socket.service";
import { ToastService } from "src/app/providers/toast/toast.service";
import { TokenStorageService } from "src/app/providers/token-storage.service";

@Component({
  selector: "app-survey-poll",
  templateUrl: "./survey-poll.component.html",
  styleUrls: ["./survey-poll.component.scss"],
})
export class SurveyPollComponent {
  surveyForm: any = FormGroup;
  surveyList: any = [];
  userInfo: any = this.tokenService.getUser();
  questionTypes: any = [];
  surveyTopics: any = [];
  skip: number = 0;
  limit: number = 10;

  tabs = [
    { id: "tab1", label: "SURVEY" },
    { id: "tab2", label: "POLLS" },
  ];

  selectedTabId: string | undefined;

  modalScrollDistance = 2;
  modalScrollThrottle = 200;
  isSrollDown: boolean = true;
  isNoMoreRecord: boolean = true;

  isShowloading: boolean = false;
  isLoad: boolean = false;
  isEdit: boolean = false;
  isUpdate: boolean = false;
  questionList: any = [];
  surveySno: any;
  deleteQuestionsList: any = [];
  deleteOptionsList: any = [];
  deleteLikertOptionsList: any = [];
  deleteDropDownOptionsList: any = [];
  deleteRankingOptionsList: any = [];
  deleteImageChoiceList:any = [];
  files:any = [];

  // Polls

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private api: ApiService,
    private toastService: ToastService,
    private tokenService: TokenStorageService,
    private fileUploadService:FileUploadService
  ) {
    this.selectedTabId = this.tabs.length > 0 ? this.tabs[0]?.id : undefined; // Initialize default tab
  }

  ngOnInit(): void {
    this.surveyForm = this.fb.group({
      surveySno: new FormControl(null),
      title: new FormControl(null, [Validators.required]),
      description: new FormControl(null),
      questions: this.fb.array([]),
    });

    this.getQuestionTypes();
    this.getSurveyTopics();
  }

  getQuestionTypes() {
    let param: any = {};
    this.api.get("8000/api/ascend/learnhub/v1/get_question_types", param).subscribe(
      (result) => {
        console.log(result);
        if (result != null) {
          if (result.data != null && result.data.length > 0) {
            this.questionTypes = result.data;
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

  getSurveyTopics() {
    let param: any = { appUserSno: this.userInfo?.appUserSno };
    this.api.get("8000/api/ascend/learnhub/v1/get_survey_topics", param).subscribe(
      (result) => {
        console.log(result);
        if (result != null) {
          if (result?.data != null && result?.data.length > 0) {
            this.surveyTopics = result?.data;
            this.clearForm();
            // this.surveyTopics[0].isActive = true;
            // this.getSurvey(this.surveyTopics[0]?.surveySno);
          } else {
          }
        } else {
          this.toastService.showError("Something went wrong");
        }
      },
      (err) => {
        this.toastService.showError(err);
      });
  }

  get questions(): FormArray {
    return this.surveyForm.get("questions") as FormArray;
  }

  addQuestion(): void {
    this.questions.push(
      this.fb.group({
        surveyQuestionSno: new FormControl(null),
        questionType: new FormControl(null, [Validators.required]),
        questionText: new FormControl(null, [Validators.required]),
        options: this.fb.array([]),
      })
    );
  }

  removeQuestion(index: number): void {
    console.log(this.questions.value[index]?.surveyQuestionSno);
    if (this.questions.value[index]?.surveyQuestionSno) {
      this.deleteQuestionsList.push({
        surveyQuestionSno: this.questions.value[index].surveyQuestionSno,
      });
    }
    console.log(this.deleteQuestionsList);

    this.questions.removeAt(index);
  }

  getOptions(questionIndex: number): FormArray {
    return this.questions.at(questionIndex).get("options") as FormArray;
  }

  addOption(questionIndex: number): void {
    this.getOptions(questionIndex).push(
      this.fb.group({
        surveyOptionSno: new FormControl(null),
        optionText: new FormControl(null, [Validators.required]),
        status: new FormControl(true),
      })
    );
  }

  removeOption(questionIndex: number, optionIndex: number): void {
    if (this.getOptions(questionIndex)?.value[optionIndex]?.surveyOptionSno) {
      this.deleteOptionsList.push({
        surveyOptionSno:
          this.getOptions(questionIndex)?.value[optionIndex]?.surveyOptionSno,
      });
    }
    this.getOptions(questionIndex).removeAt(optionIndex);
  }

  // onQuestionTypeChange(questionIndex: number,callback?:any): void {
  //   const question: any = this.questions.at(questionIndex);
  //   const questionType: any = question.get("questionType").value;

  //   // Multiple Choice
  //   if (questionType === "multiple-choice") {
  //     if (!question.get("options")) {
  //       question.setControl("options", this.fb.array([]));
  //     }
  //   } else {
  //     if (question.get("options")) {
  //       question.removeControl("options");
  //     }
  //   }

  //   // Rating Scale
  //   if (questionType === "rating-scale") {
  //     if (!question.get("ratingScaleMin")) {
  //       question.addControl("ratingScaleMin", new FormControl(""));
  //     }
  //     if (!question.get("ratingScaleMax")) {
  //       question.addControl("ratingScaleMax", new FormControl(""));
  //     }
  //   } else {
  //     if (question.get("ratingScaleMin")) {
  //       question.removeControl("ratingScaleMin");
  //     }
  //     if (question.get("ratingScaleMax")) {
  //       question.removeControl("ratingScaleMax");
  //     }
  //   }

  //   // Likert Scale
  //   if (questionType === "likert-scale") {
  //     if (!question.get("likertOptions")) {
  //       question.addControl("likertOptions", this.fb.array([]));
  //     }
  //   } else {
  //     if (question.get("likertOptions")) {
  //       question.removeControl("likertOptions");
  //     }
  //   }

  //   // Matrix
  //   if (questionType === "matrix") {
  //     if (!question.get("matrixRows")) {
  //       question.addControl("matrixRows", new FormControl(""));
  //     }
  //     if (!question.get("matrixCols")) {
  //       question.addControl("matrixCols", new FormControl(""));
  //     }
  //   } else {
  //     if (question.get("matrixRows")) {
  //       question.removeControl("matrixRows");
  //     }
  //     if (question.get("matrixCols")) {
  //       question.removeControl("matrixCols");
  //     }
  //   }

  //   // Dropdown
  //   if (questionType === "dropdown") {
  //     if (!question.get("dropdownOptions")) {
  //       question.addControl("dropdownOptions", this.fb.array([]));
  //     }
  //   } else {
  //     if (question.get("dropdownOptions")) {
  //       question.removeControl("dropdownOptions");
  //     }
  //   }

  //   // Open-ended
  //   if (questionType === "open-ended") {
  //     if (!question.get("openEndedAnswer")) {
  //       question.addControl("openEndedAnswer", new FormControl(""));
  //     }
  //   } else {
  //     if (question.get("openEndedAnswer")) {
  //       question.removeControl("openEndedAnswer");
  //     }
  //   }

  //   // Demographic
  //   if (questionType === "demographic") {
  //     if (!question.get("demographicInfo")) {
  //       question.addControl("demographicInfo", new FormControl(""));
  //     }
  //   } else {
  //     if (question.get("demographicInfo")) {
  //       question.removeControl("demographicInfo");
  //     }
  //   }

  //   // Ranking
  //   if (questionType === "ranking") {
  //     if (!question.get("rankingOptions")) {
  //       question.addControl("rankingOptions", this.fb.array([]));
  //     }
  //   } else {
  //     if (question.get("rankingOptions")) {
  //       question.removeControl("rankingOptions");
  //     }
  //   }

  //   // Image Choice
  //   if (questionType === "image-choice") {
  //     if (!question.get("imageChoiceUrls")) {
  //       question.addControl("imageChoiceUrls", this.fb.array([]));
  //     }
  //   } else {
  //     if (question.get("imageChoiceUrls")) {
  //       question.removeControl("imageChoiceUrls");
  //     }
  //   }

  //   // Click Map
  //   if (questionType === "click-map") {
  //     if (!question.get("clickMapImageUrl")) {
  //       question.addControl("clickMapImageUrl", new FormControl(""));
  //     }
  //   } else {
  //     if (question.get("clickMapImageUrl")) {
  //       question.removeControl("clickMapImageUrl");
  //     }
  //   }

  //   // File Upload
  //   if (questionType === "file-upload") {
  //     if (!question.get("fileUploadInstructions")) {
  //       question.addControl("fileUploadInstructions", new FormControl(""));
  //     }
  //   } else {
  //     if (question.get("fileUploadInstructions")) {
  //       question.removeControl("fileUploadInstructions");
  //     }
  //   }

  //   // Slider
  //   if (questionType === "slider") {
  //     if (!question.get("sliderMin")) {
  //       question.addControl("sliderMin", new FormControl(""));
  //     }
  //     if (!question.get("sliderMax")) {
  //       question.addControl("sliderMax", new FormControl(""));
  //     }
  //   } else {
  //     if (question.get("sliderMin")) {
  //       question.removeControl("sliderMin");
  //     }
  //     if (question.get("sliderMax")) {
  //       question.removeControl("sliderMax");
  //     }
  //   }

  //   // Benchmarkable
  //   if (questionType === "benchmarkable") {
  //     if (!question.get("benchmarkableCriteria")) {
  //       question.addControl("benchmarkableCriteria", new FormControl(""));

  //     }
  //   } else {
  //     if (question.get("benchmarkableCriteria")) {
  //       question.removeControl("benchmarkableCriteria");
  //     }
  //   }
    
  //   callback(true);

  // }



  onQuestionTypeChange(questionIndex: number,callback?:any): void {
    const question: any = this.questions.at(questionIndex);
    const questionType: any = question.get("questionType").value;

    // Multiple Choice
    if (questionType === "multiple-choice") {
      if (!question.get("options")) {
        question.setControl("options", this.fb.array([]));
      }
    } else {
      if (question.get("options")) {
        question.removeControl("options");
      }
    }

    // Rating Scale
    if (questionType === 'rating-scale') {
      if (!question.get('ratingScale')) {
        // If slider group does not exist, add it
        question.addControl('ratingScale', this.fb.group({
          ratingScaleSno: new FormControl('',),
          ratingScaleMin: new FormControl('', Validators.required),
          ratingScaleMax: new FormControl('', Validators.required)
        }));
      }
    } else {
      if (question.get('ratingScale')) {
        // If slider group exists, remove it
        question.removeControl('ratingScale');
      }
    }

    // Likert Scale
    if (questionType === "likert-scale") {
      if (!question.get("likertOptions")) {
        question.addControl("likertOptions", this.fb.array([]));
      }
    } else {
      if (question.get("likertOptions")) {
        question.removeControl("likertOptions");
      }
    }

    // Matrix
    if (questionType === 'matrix') {
      if (!question.get('matrix')) {
        // If matrix group does not exist, add it
        question.addControl('matrix', this.fb.group({
          matrixSno: new FormControl('',),
          matrixRows: new FormControl('', Validators.required),
          matrixCols: new FormControl('', Validators.required)
        }));
      }
    } else {
      if (question.get('matrix')) {
        // If matrix group exists, remove it
        question.removeControl('matrix');
      }
    }

    // Dropdown
    if (questionType === "dropdown") {
      if (!question.get("dropdownOptions")) {
        question.addControl("dropdownOptions", this.fb.array([]));
      }
    } else {
      if (question.get("dropdownOptions")) {
        question.removeControl("dropdownOptions");
      }
    }

    // Open-ended
    if (questionType === 'open-ended') {
      if (!question.get('openEnded')) {
        // If openEnded group does not exist, add it
        question.addControl('openEnded', this.fb.group({
          openEndedSno: new FormControl(''),
          openEndedAnswer: new FormControl('', Validators.required)
        }));
      }
    } else {
      if (question.get('openEnded')) {
        // If openEnded group exists, remove it
        question.removeControl('openEnded');
      }
    }

    // Demographic
    if (questionType === 'demographic') {
      if (!question.get('demographic')) {
        // If demographic group does not exist, add it
        question.addControl('demographic', this.fb.group({
          demographicSno: new FormControl('',),
          demographicInfo: new FormControl('', Validators.required)
        }));
      }
    } else {
      if (question.get('demographic')) {
        // If demographic group exists, remove it
        question.removeControl('demographic');
      }
    }

    // Ranking
    if (questionType === "ranking") {
      if (!question.get("rankingOptions")) {
        question.addControl("rankingOptions", this.fb.array([]));
      }
    } else {
      if (question.get("rankingOptions")) {
        question.removeControl("rankingOptions");
      }
    }

    // Image Choice
    if (questionType === "image-choice") {
      if (!question.get("imageChoiceUrls")) {
        question.addControl("imageChoiceUrls", this.fb.array([]));
      }
    } else {
      if (question.get("imageChoiceUrls")) {
        question.removeControl("imageChoiceUrls");
      }
    }

    // Click Map
    if (questionType === 'click-map') {
      if (!question.get('clickMap')) {
        // If clickMap group does not exist, add it
        question.addControl('clickMap', this.fb.group({
          clickMapSno: new FormControl('', ),
          clickMapImageUrl: new FormControl('', Validators.required)
        }));
      }
    } else {
      if (question.get('clickMap')) {
        // If clickMap group exists, remove it
        question.removeControl('clickMap');
      }
    }

    // File Upload
    if (questionType === 'file-upload') {
      if (!question.get('fileUpload')) {
        // If fileUpload group does not exist, add it
        question.addControl('fileUpload', this.fb.group({
          fileUploadSno: new FormControl('',),
          fileUploadInstructions: new FormControl('', Validators.required)
        }));
      }
    } else {
      if (question.get('fileUpload')) {
        // If fileUpload group exists, remove it
        question.removeControl('fileUpload');
      }
    }

    // Slider
    if (questionType === 'slider') {
      if (!question.get('slider')) {
        // If slider group does not exist, add it
        question.addControl('slider', this.fb.group({
          sliderSno: new FormControl('',),
          sliderMin: new FormControl('', Validators.required),
          sliderMax: new FormControl('', Validators.required)
        }));
      }
    } else {
      if (question.get('slider')) {
        // If slider group exists, remove it
        question.removeControl('slider');
      }
    }

    // Benchmarkable
    if (questionType === 'benchmarkable') {
      if (!question.get('benchmarkable')) {
        // If benchmarkable group does not exist, add it
        question.addControl('benchmarkable', this.fb.group({
          benchmarkableSno: new FormControl('',),
          benchmarkableCriteria: new FormControl('', Validators.required)
        }));
      }
    } else {
      if (question.get('benchmarkable')) {
        // If benchmarkable group exists, remove it
        question.removeControl('benchmarkable');
      }
    }
    
    if(callback){
      callback(true);
    }

  }


  selectTab(tabId: string) {
    this.selectedTabId = tabId;
  }

  changeSurvey(i: number) {
    this.surveySno = this.surveyTopics[i]?.surveySno;
    this.skip = 0;
    this.limit = 10;
    this.isNoMoreRecord = false;
    this.clearForm();
    this.getSurvey(this.surveySno);
  }

  getSurvey(surveySno?: any) {
    let param: any = {};
    param.appUserSno = this.userInfo?.appUserSno;
    param.skip = this.skip;
    param.limit = this.limit;
    param.surveySno = surveySno;
    this.api.get("8000/api/ascend/learnhub/v1/get_survey", param).subscribe(
      (result) => {
        console.log(result);
        if (result != null) {
          if (result.data != null && result.data.length > 0) {
            let quesObj = structuredClone(result.data[0]);
            let questions = result.data[0]?.questions;
            this.questionList = questions;

            this.skip = this.skip + result?.data.length;
            this.isEdit = true;
            this.isUpdate = true;  

            this.surveyForm = this.fb.group({
              surveySno: new FormControl(quesObj?.surveySno),
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
            this.isNoMoreRecord = true;
            this.isUpdate = false;
            this.addQuestion();
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

  getMoreTechQuestion() {
    this.getTechQuestion();
  }

  getTechQuestion() {
    this.isShowloading = true;
    // this.clear();
    let param: any = {};
    param.surveySno = this.surveySno;
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
            this.isUpdate = true;
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
            if (this.questions.value.length > 0) this.isUpdate = true;
            else this.isUpdate = false;
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

  setQuestion(value: any) {
    console.log(value);
    // console.log(index);

    let question: any = this.fb.group({
      surveyQuestionSno: new FormControl(value?.surveyQuestionSno),
      questionType: new FormControl(value?.questionType, [Validators.required]),
      questionText: new FormControl(value?.questionText, [Validators.required]),
      required: new FormControl(value?.required, [Validators.required]),
      // options: this.fb.array([]),
    });

    this.questions.push(question);
    var index = this.questions.value?.length - 1;

    

    this.onQuestionTypeChange(index, (result:any)=> {

    if(value.questionType == 'multiple-choice'){
      for (let i in value?.options) {
        this.setOptions(index, value?.options[i]);
      }
    }else if(value.questionType == 'rating-scale'){

    const newQuestionGroup = this.questions.at(index);
      newQuestionGroup.get('ratingScale')?.setValue({
        ratingScaleSno: value?.ratingScale?.ratingScaleSno, 
        ratingScaleMin: value?.ratingScale?.ratingScaleMin,  
        ratingScaleMax: value?.ratingScale?.ratingScaleMax
      });

    }else if(value.questionType == 'likert-scale'){
      for (let i in value?.likertOptions) {
        this.setLikertOptions(index, value?.likertOptions[i]);
      }
    }else if(value.questionType == 'matrix'){

      const newQuestionGroup = this.questions.at(index);
      newQuestionGroup.get('matrix')?.setValue({
        matrixSno: value?.matrix?.matrixSno, 
        matrixRows: value?.matrix?.matrixRows,  
        matrixCols: value?.matrix?.matrixCols
      });

    }else if(value.questionType == 'dropdown'){

    for (let i in value?.dropdownOptions) {
        this.setDropDownOptions(index, value?.dropdownOptions[i]);
    }
      
    }else if(value.questionType == 'open-ended'){

      const newQuestionGroup = this.questions.at(index);
      newQuestionGroup.get('openEnded')?.setValue({
        openEndedSno: value?.openEnded?.openEndedSno, 
        openEndedAnswer: value?.openEnded?.openEndedAnswer
      }); 
      
    }else if(value.questionType == 'demographic'){

      const newQuestionGroup = this.questions.at(index);
      newQuestionGroup.get('demographic')?.setValue({
        demographicSno: value?.demographic?.demographicSno, 
        demographicInfo: value?.demographic?.demographicInfo
      }); 

    }else if(value.questionType == 'ranking'){

    for (let i in value?.rankingOptions) {
      this.setRankingOptions(index, value?.rankingOptions[i]);
    }
      
    }else if(value.questionType == 'image-choice'){

    for (let i in value?.imageChoiceUrls) {
        this.setImageChoice(index, value?.imageChoiceUrls[i]);
    }
      
    }else if(value.questionType == 'click-map'){

      const newQuestionGroup = this.questions.at(index);
      newQuestionGroup.get('clickMap')?.setValue({
        clickMapSno: value?.clickMap?.clickMapSno, 
        clickMapImageUrl: value?.clickMap?.clickMapImageUrl 
      });
      
    }else if(value.questionType == 'file-upload'){

    const newQuestionGroup = this.questions.at(index);
      newQuestionGroup.get('fileUpload')?.setValue({
        fileUploadSno: value?.fileUpload?.fileUploadSno, 
        fileUploadInstructions: value?.fileUpload?.fileUploadInstructions 
      });
      
    }else if(value.questionType == 'slider'){
      const newQuestionGroup = this.questions.at(index);
      newQuestionGroup.get('slider')?.setValue({
        sliderSno: value?.slider?.sliderSno, 
        sliderMin: value?.slider?.sliderMin,  
        sliderMax: value?.slider?.sliderMax
      });
      
    }else if(value.questionType == 'benchmarkable'){
      
      const newQuestionGroup = this.questions.at(index);
      newQuestionGroup.get('benchmarkable')?.setValue({
        benchmarkableSno: value?.benchmarkable?.benchmarkableSno, 
        benchmarkableCriteria: value?.benchmarkable?.benchmarkableCriteria  
      });
    }

    });
  
  }

  // Multiple Options

  setOptions(index: number, value: any) {
    let answer: any = this.fb.group({
      surveyOptionSno: new FormControl(value?.surveyOptionSno),
      optionText: new FormControl(value?.optionText, [Validators.required]),
      status: new FormControl(value?.status),
    });
    this.getOptions(index).push(answer);
  }

  // likertOptions

  setLikertOptions(index: number, value: any) {
    let answer: any = this.fb.group({
      likertScaleSno: new FormControl(value?.likertScaleSno),
      optionText: new FormControl(value?.optionText, [Validators.required]),
      value: new FormControl(value?.value),
      status:new FormControl(value?.status),  
    });
    this.getLikertOptions(index).push(answer);
  }

  // dropdown
  
  setDropDownOptions(index: number, value: any) {
    let answer: any = this.fb.group({
      dropdownOptionSno: new FormControl(value?.dropdownOptionSno),
      optionText: new FormControl(value?.optionText, [Validators.required]),
    });
    this.getdropdownOptions(index).push(answer);
  }

  // Ranking Option

  setRankingOptions(index: number, value: any) {
    let answer: any = this.fb.group({
      rankingOptionSno: new FormControl(value?.rankingOptionSno),
      optionText: new FormControl(value?.optionText, [Validators.required]),
      rank:new FormControl(value?.rank),
    });
    this.getRankingOptions(index).push(answer);
  }

  // ImageChoice

  setImageChoice(index: number, value: any) {
    let answer: any = this.fb.group({
      imageChoiceSno: new FormControl(value?.imageChoiceSno),
      imageData: new FormControl(value?.imageData, [Validators.required]),
      imageFile:new FormControl(null),
      fileName:new FormControl(value?.fileName),
      description:new FormControl(value?.description),
    });
    this.getImageChoiceOptions(index).push(answer);
  }


  async saveData() {
    let arr: any = this.surveyForm.value.questions;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].questionType === 'image-choice') {
        console.log(arr[i].imageChoiceUrls[0]);
        try {
          let result = await this.fileUpload(arr[i].imageChoiceUrls, 0);
          arr[i].imageChoiceUrls = structuredClone(result);
        } catch (error) {
          console.error('Error uploading file:', error);
        }
      }
    }
    // After completing the for loop, update the form value
    this.surveyForm.value.questions = structuredClone(arr);
    console.log(this.surveyForm.value.questions);
    this.save();
  }
  

  save(): void {
    let body:any = this.surveyForm.value;
    body.appUserSno = this.userInfo?.appUserSno ? this.userInfo?.appUserSno : 1;
    console.log(body);
    this.api.post("8000/api/ascend/learnhub/v1/insert_survey", body).subscribe(
      (result) => {
        console.log(result);
        if (result != null && result?.data) {
          this.toastService.showSuccess("Saved Successfully");
          this.getSurveyTopics();
        } else {
          this.toastService.showError("Something Went Wrong");
        }
      },
      (err) => {
        this.toastService.showError(err);
      }
    );

  }


  // fileUpload(imageChoiceUrls:any,index:any, callback:any){
  //     this.files = [];
  //     this.files.push(imageChoiceUrls[index]?.imageFile);
  //     console.log(this.files);
  //   this.fileUploadService.send(this.files , (result: any) => {
  //     let mediaList: any = [];
  //     if (result && result?.length > 0) {
  //      console.log(result);
        
  //      imageChoiceUrls[index].imageData = result;
  //      console.log(imageChoiceUrls[index].imageData);
  //      if(index != imageChoiceUrls.length -1){
  //       this.fileUpload(imageChoiceUrls,index + 1,callback);
  //     }else {
  //       alert("in")
  //       console.log(imageChoiceUrls)
  //       callback(imageChoiceUrls);
  //     }
  //   }
  //   });

  // }

  fileUpload(imageChoiceUrls: any, index: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.files = [];
      if(imageChoiceUrls[index]?.imageFile ){
        this.files.push(imageChoiceUrls[index]?.imageFile);
        console.log(this.files);
        
        this.fileUploadService.send(this.files, (result: any) => {
          if (result && result?.length > 0) {
            console.log(result);
            imageChoiceUrls[index].imageData = result;
            console.log(imageChoiceUrls[index].imageData);
            
            if (index != imageChoiceUrls.length - 1) {
              // Recursively call fileUpload for the next index
              this.fileUpload(imageChoiceUrls, index + 1).then(resolve).catch(reject);
            } else {
              console.log(imageChoiceUrls);
              resolve(imageChoiceUrls);
            }
          } else {
            reject(new Error('File upload failed'));
          }
        });
      } else {
        if (index != imageChoiceUrls.length - 1) {
          // Recursively call fileUpload for the next index
          this.fileUpload(imageChoiceUrls, index + 1).then(resolve).catch(reject);
        } else {
          console.log(imageChoiceUrls);
          resolve(imageChoiceUrls);
        }
      }
    });
  }
  

 async updateData(){
    let arr: any = this.surveyForm.value.questions;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].questionType === 'image-choice') {
        console.log(arr[i].imageChoiceUrls[0]);
        try {
          let result = await this.fileUpload(arr[i].imageChoiceUrls, 0);
          arr[i].imageChoiceUrls = structuredClone(result);
        } catch (error) {
          console.error('Error uploading file:', error);
        }
      }
    }
    // After completing the for loop, update the form value
    this.surveyForm.value.questions = structuredClone(arr);
    console.log(this.surveyForm.value.questions);
    this.update();
  }

  update() {
    this.isLoad = true;
    let body: any = this.surveyForm.value;
    body.deleteQuestionsList = this.deleteQuestionsList;
    body.deleteOptionsList = this.deleteOptionsList;
    body.deleteImageChoiceList = this.deleteImageChoiceList;
    body.deleteRankingOptionsList = this.deleteRankingOptionsList || null;
    body.deleteDropDownOptionsList = this.deleteDropDownOptionsList || null;
    body.appUserSno = this.userInfo?.appUserSno;
    console.log(body);
    this.api.put("8000/api/ascend/learnhub/v1/update_survey", body).subscribe((result: any) => {
        this.isLoad = false;
        if (result) {
          if (result?.data != null) {
            this.deleteQuestionsList = [];
            this.deleteOptionsList = [];
            this.deleteImageChoiceList = [];
            this.deleteRankingOptionsList = [];
            this.deleteDropDownOptionsList = [];
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
    while (this.questions.length !== 0) {
      this.questions.removeAt(0);
    }
    // Reset the form without triggering validation checks
    this.surveyForm.reset({});
    this.addQuestion();
    this.isUpdate = false;
  }

  //  Likert Scale Option

  getLikertOptions(questionIndex: number): FormArray {
    return this.questions.at(questionIndex).get("likertOptions") as FormArray;
  }

  addLikertOption(questionIndex: number): void {
    this.getLikertOptions(questionIndex).push(
      this.fb.group({
        likertScaleSno: new FormControl(null),
        optionText: new FormControl(null, [Validators.required]),
        value: new FormControl(null, [Validators.required]),
        status: new FormControl(true),
      })
    );
  }

  removeLikertOption(questionIndex: number, optionIndex: number): void {
    if (
      this.getLikertOptions(questionIndex)?.value[optionIndex]?.likertScaleSno
    ) {
      this.deleteLikertOptionsList.push({
        likertScaleSno:
          this.getLikertOptions(questionIndex)?.value[optionIndex]
            ?.likertScaleSno,
      });
    }
    this.getLikertOptions(questionIndex).removeAt(optionIndex);
  }

  // dropdownOptions

  getdropdownOptions(questionIndex: number): FormArray {
    return this.questions.at(questionIndex).get("dropdownOptions") as FormArray;
  }

  addDropDownOption(questionIndex: number): void {
    this.getdropdownOptions(questionIndex).push(
      this.fb.group({
        dropdownOptionSno: new FormControl(null),
        optionText: new FormControl(null, [Validators.required]),
        status: new FormControl(true),
      })
    );
  }

  removeDropDownOption(questionIndex: number, optionIndex: number): void {
    if ( this.getdropdownOptions(questionIndex)?.value[optionIndex]?.dropdownOptionSno) {
      this.deleteDropDownOptionsList.push({
        dropdownOptionSno:
          this.getdropdownOptions(questionIndex)?.value[optionIndex]
            ?.dropdownOptionSno,
      });
    }
    this.getdropdownOptions(questionIndex).removeAt(optionIndex);
  }

  // Ranking Options

  getRankingOptions(questionIndex: number): FormArray {
    return this.questions.at(questionIndex).get("rankingOptions") as FormArray;
  }

  addRankingOption(questionIndex: number): void {
    this.getRankingOptions(questionIndex).push(
      this.fb.group({
        rankingOptionSno: new FormControl(null),
        optionText: new FormControl(null, [Validators.required]),
        rank: new FormControl(null, [Validators.required]),
        status: new FormControl(true),
      })
    );
  }

  removeRankingOption(questionIndex: number, optionIndex: number): void {
    if ( this.getRankingOptions(questionIndex)?.value[optionIndex]?.rankingOptionSno
    ) {
      this.deleteRankingOptionsList.push({
        rankingOptionSno:
          this.getRankingOptions(questionIndex)?.value[optionIndex]
            ?.rankingOptionSno,
      });
    }
    this.getRankingOptions(questionIndex).removeAt(optionIndex);
  }

  // ImageChoiceUrls

  getImageChoiceOptions(questionIndex: number): FormArray {
    return this.questions.at(questionIndex).get("imageChoiceUrls") as FormArray;
  }

  addImageChoiceOption(questionIndex: number): void {
    this.getImageChoiceOptions(questionIndex).push(
      this.fb.group({
        imageChoiceSno: new FormControl(null),
        imageData: new FormControl(null, [Validators.required]),
        imageFile: [null], // For storing the file
        fileName:new FormControl(null),
        description: new FormControl(null,),
      })
    );
  }

  removeImageChoiceOption(questionIndex: number, optionIndex: number): void {
    if (
      this.getImageChoiceOptions(questionIndex)?.value[optionIndex]
        ?.imageChoiceSno
    ) {
      this.deleteImageChoiceList.push({
        imageChoiceSno:
          this.getImageChoiceOptions(questionIndex)?.value[optionIndex]
            ?.imageChoiceSno,
      });
    }
    this.getImageChoiceOptions(questionIndex).removeAt(optionIndex);
  }


  onFileSelect(event: any, questionIndex: number, optionIndex: number): void {
    const file = event.target.files[0];
    console.log(file?.name);
    if (file) {
      this.getImageChoiceOptions(questionIndex).at(optionIndex).get('imageFile')?.setValue(file);
      this.getImageChoiceOptions(questionIndex).at(optionIndex).get('fileName')?.setValue(file?.name);

      // Optionally, you can read the file to get its data URL
      const reader = new FileReader();
      reader.onload = () => {
        this.getImageChoiceOptions(questionIndex).at(optionIndex).get('imageData')?.setValue(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  // clearFile(questionIndex: number, imageChoiceIndex: number) {
  //   const imageChoiceForm = this.getImageChoiceOptions(questionIndex).at(imageChoiceIndex);
  //   imageChoiceForm.patchValue({
  //     imageFile: null,
  //     filename: ''
  //   });
  // }

}
