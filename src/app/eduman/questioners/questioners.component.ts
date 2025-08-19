import { Component, ElementRef, OnInit, ViewChild, inject, HostListener } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { ApiService } from 'src/app/providers/api/api.service';
import { ToastService } from 'src/app/providers/toast/toast.service';
import * as XLSX from 'xlsx';
import { TokenStorageService } from 'src/app/providers/token-storage.service';


declare var $: any;

@Component({
  selector: 'app-questioners',
  templateUrl: './questioners.component.html',
  styleUrls: ['./questioners.component.css']
})


export class QuestionersComponent implements OnInit {

  isNavbarFixed: boolean = false;
  show: string[] = [];

  @HostListener('window:scroll', ['$event']) onScroll() {
    if (window.scrollY > 100) {
      this.isNavbarFixed = true;
    } else {
      this.isNavbarFixed = false;
    }
  }

  [x: string]: any;
  clientInfo: any;

  selectedIndex: any;
  curriculamList: any = [];


  selectedModuleSno: any;
  selectedLevelList: any;
  // apiName:any;
  selectedModuleIndex: number = 0;
  httpmethods: any = [];
  apiWorkFlows: any = [];
  apiForm: any = FormGroup;
  question: any = FormGroup;
  deleteQuestionList: any = [];
  deleteAnswerList: any = [];
  deleteLevelTypeList:any = [];
  isActive: boolean = false;
  courseCurriculumSno:any;

  appUser: any = this.tokenStorage.getUser();

  @ViewChild('fruitInput') fruitInput: ElementRef<HTMLInputElement> | any;

  announcer = inject(LiveAnnouncer);
  checked: any;

  items: any = '';
  myControl = new FormControl('');
  // levelSno:any;
  isSelect: boolean = false;
  isLoad: boolean = false;
  isEdit: boolean = false;
  isUpdate: boolean = false;
  questionList:any = [];
  isShowloading:boolean = false;
  
  answerTypeList:any = [];
  questionTypeList:any = [];
  @ViewChild("fileInput") fileInput: ElementRef | any;

  // bulk-upload
  questionObj:any;
  fileName:any;
  isNoRecord:boolean = false;
  @ViewChild("closedialog") bulk_upload_modal: ElementRef | any;
  @ViewChild("myInput") myInputVariable: ElementRef | any;


  modalScrollDistance = 2;
  modalScrollThrottle = 200;
  isSrollDown: boolean = true;
  isNoMoreRecord:boolean = true;
  skip = 0;
  limit = 10;
  refresh:boolean = false;
  isUpload:boolean = false

  constructor(private api: ApiService,
    private fb: FormBuilder,
    private toastService: ToastService,
    public dialog: MatDialog,
    private  tokenStorage:TokenStorageService) {

    this.question = new FormGroup({
      courseCurriculumSno: new FormControl(null, [Validators.required]),
      questions: new FormArray([]),
      // levelSno: new FormControl(null),
      // levelTypeCd: new FormArray([], [Validators.required])
    });
  }

  ngOnInit(): void {
    this.data = window.history.state;
    this.getAnswerTypeEnum();
  }


  getAnswerTypeEnum() {
    let param: any = { codeType: "answer_type_cd" };
    this.api.get("8000/api/ascend/learnhub/v1/get_enum", param).subscribe((result) => {
      if (result != null && result.data) {
        this.answerTypeList = result.data;
        this.getQuestionTypeEnum();
      }
    });
  }

  getQuestionTypeEnum() {
    let param: any = { codeType: "questions_type_cd" };
    this.api.get("8000/api/ascend/learnhub/v1/get_enum", param).subscribe((result) => {
      if (result != null && result.data) {
        this.questionTypeList = result.data;
        console.log(this.questionTypeList)
        this.getCurriculam();
      }
    });
  }

  getCurriculam() {
    let param: any = {};
    param.courseSno = this.data.courseSno;
    param.appUserSno = this.appUser.appUserSno;
    console.log(param);
    this.api.get("8000/api/ascend/learnhub/v1/get_course_curriculum", param).subscribe(result => {
      console.log(result)
      if (result != null) {
        if (result.data != null && result.data.length > 0) {
          this.curriculamList = result.data;
          console.log(this.curriculamList);
          this.question.patchValue({
            courseCurriculumSno: this.curriculamList[0]?.courseCurriculumSno
          });
          this.getQuestionAnswer(this.curriculamList[0]?.courseCurriculumSno);
          this.curriculamList[0].isActive = true;
        } else {

        }
      } else {
        this.toastService.showError('Something went wrong');
      }
    }, err => {
      this.toastService.showError(err)
    }
    );
  }


  getItems() {
    let items: any = '';
    items = this.items.trim("");
    if (!this.emptyStringValidation(items)) {
      if (Array.from(this.items)[0] != null) {
        items = this.items;
      }

    }
  }

  emptyStringValidation(key: any) {
    if (key.trim() == "") {
      return true;
    } else {
      return false
    }
  }

  // end
  // getQuestionAnswerKeys(index: number) {
  //   return this.getQuestions.at(index).get("answers") as FormArray;
  // }

  removeQuestion(index: number) {
    if (this.getQuestions.value[index]?.questionSno) {
      this.deleteQuestionList.push({
        questionSno: this.getQuestions.value[index].questionSno,
      });
    }
    console.log(this.getQuestions.at(index)?.value);
    this.getQuestions.removeAt(index);
  }

  // addAnswerKey(index: number) {
  //   let answersGroup: any = this.fb.group({
  //     answerSno: new FormControl(null),
  //     answer: new FormControl(null, [Validators.required]),
  //     answerTypeCdValue:new FormControl(null),
  //     isCorrect:new FormControl(null),
  //     statusCd:new FormControl("Active" ),
  //   });
  //   this.getQuestionAnswerKeys(index).push(answersGroup);
  // }



  removeAnswerKey(index: number, answerIndex: number) {
    if (this.getQuestionAnswerKeys(index)?.value[answerIndex]?.answerSno) {
      this.deleteAnswerList.push({
        answerSno:
          this.getQuestionAnswerKeys(index)?.value[answerIndex]?.answerSno,
      });
    }
    this.getQuestionAnswerKeys(index).removeAt(answerIndex);
  }

  // getQuestionList(index: number) {
  //   return this.getQuestions.at(index).get('questionList') as FormArray;
  // }

  // setQuestion(value: any) {removeAnswerKey
  //   console.log(value);
  //   // console.log(index);
  //   let question: any = this.fb.group({
  //     questionSno: new FormControl(value?.questionSno),
  //     question: new FormControl(value?.question, [Validators.required]),
  //     questionsTypeCd: new FormControl(value?.questionsTypeCd),
  //     statusCdValue: new FormControl(value?.statusCdValue),
  //     answers: new FormArray([]),
  //     questionList: new FormArray([]),
  //     pairs: new FormArray([]),
  //   });

  //   this.getQuestions.push(question);
  //   let index = this.getQuestions.value?.length - 1;
 
  //   for (let i in value?.answers) {
  //     this.setAnswerKey(index, value?.answers[i]);
  //   }
  //   // for (let i in value?.pairs) {
  //   //   this.addMatchPairs(index, value?.pairs[i]);
  //   // }

  // }

  setQuestion(value: any) {
    console.log(JSON.stringify(value));
    console.log(value.questionsTypeCd);

    let question: any = this.fb.group({
      questionSno: new FormControl(value?.questionSno),
      question: new FormControl(value?.question, [Validators.required]),
      questionsTypeCd: new FormControl(value?.questionsTypeCd),
      statusCdValue: new FormControl(value?.statusCdValue),
      answers: new FormArray([]),
      questionList: new FormArray([]),
      pairs: new FormArray([]),
    });

    this.getQuestions.push(question);
    let index = this.getQuestions.value?.length - 1;
    
    this.show[index] = value.questionsTypeCd;  // Map the current questionsTypeCd to the index

    for (let i in value?.answers) {
      this.setAnswerKey(index, value?.answers[i]);
    }

    for (let i in value?.pairs) {
      this.setPairKey(index, value?.pairs[i]);
    }
}

  setAnswerKey(index: number, value: any) {
    let answer: any = this.fb.group({
      answerSno: new FormControl(value?.answerSno),
      answer: new FormControl(value?.answer, [Validators.required]),
      answerTypeCdValue:new FormControl(value?.answerTypeCdValue, [Validators.required]),
      isCorrect:new FormControl(value?.isCorrect, [Validators.required]),
      statusCd:new FormControl(value?.statusCd, [Validators.required]),
    });
    this.getQuestionAnswerKeys(index).push(answer);
  }

  setPairKey(index: number, value: any) {
    console.log(value)
    let pairs: any = this.fb.group({
      pairSno: new FormControl(value?.matchingPairSno),
      leftItem: new FormControl(value?.leftItem, [Validators.required]),
      rightItem:new FormControl(value?.rightItem, [Validators.required]),
    });
    this.getMatchAnswerPairs(index).push(pairs);
  }



  addQuestion() {
    let question: any = this.fb.group({
      questionSno: new FormControl(null),
      question: new FormControl(null, [Validators.required]),
      questionsTypeCd: new FormControl(null,[Validators.required]),
      statusCdValue: new FormControl('Active'),
      answers: new FormArray([]),
      // multiAnswers: new FormArray([]),
      // fullUpsAnswers: new FormArray([]),
      questionList: new FormArray([]),
      pairs: new FormArray([]),
    });
   
    this.getQuestions.push(question);
    // question.get('questionList') as FormArray
    // this.show = ['Single'];
    // console.log(this.show)
    // this.addAnswerKey(this.getQuestions.length - 1);
    // this.addMatchPairs(this.getQuestions.length - 1);
    // this.addAnswerKey(this.getQuestions.length - 1, 'Fill up'); // For Fill up answer type
    // this.addAnswerKey(this.getQuestions.length - 1, 'Multiple Choice'); 
  }

 

  levelTypeCd(i: number) {
    return this.getQuestions.at(i).get('levelTypeCdList') as FormArray;
  }

  selectType(i: number, j: number) {
    let isSelect = this.getQuestionList(i).at(j).get('isSelect')?.value;
    this.getQuestionList(i).at(j).patchValue({
      isSelect: !isSelect
    });
    while (this.levelTypeCd(i).value.length !== 0) {
      this.levelTypeCd(i).removeAt(0);
    }
    console.log(this.getQuestions.at(i).value.questionList);
    for (let j in this.getQuestions.at(i).value.questionList) {
      if (this.getQuestions.at(i).value.questionList[j]?.isSelect) {
        console.log(this.getQuestions.at(i).value.questionList[j]?.levelSno);
        this.levelTypeCd(i).push(new FormControl(this.getQuestions.at(i).value.questionList[j]?.levelSno));
      }
    }
    console.log(this.getQuestions.at(i).value);
    // console.log(this.question.value);
    // this.levelList = i;
    // let levelSno = this.levelList[i].levelSno;
    // for (let i = 0; i < this.levelList.length; i++) {
    //   if (this.levelList[i].levelSno == levelSno) {
    //     this.levelList[i].isSelect = true;
    //     this.question.patchValue({
    //       levelTypeCd: this.levelList[i].levelTypeCd
    //     })
    //   } else {
    //     this.levelList[i].isSelect = false;
    //   }
    // }
  }

  selectDeleteLevel(i:any,j:any){
    let currentTypeList = this.getQuestions.at(i).get('levelTypeCdList')?.value;
    let levelTypeList = this.questionList[i]?.levelTypeCdList?.data;
    for(let i in levelTypeList){
      if(currentTypeList.some((levelSno:any) => levelSno === levelTypeList[i]?.levelSno)){
        console.log("Object found inside the array.");
        let  index = this.deleteLevelTypeList.findIndex((level:any) => level?.levelSno === levelTypeList[i]?.levelSno);
        if(index >= 0){
          this.deleteLevelTypeList.splice(index,1);
        }
    } else{
      this.deleteLevelTypeList.push({questionSno:levelTypeList[i]?.questionSno, levelSno:levelTypeList[i]?.levelSno})
        console.log("Object not found.");
    }
   }
    
  }


  getQuestionAnswer(courseCurriculumSno: number) {
    this.isShowloading = true;
    this.refresh = true;
    this.clear();
    this.question.patchValue({  
      courseCurriculumSno: courseCurriculumSno
    });
    let param: any = {};
    param.courseCurriculumSno = courseCurriculumSno;
    param.courseSno = this.data?.courseSno;
    param.appUserSno = this.appUser?.appUserSno;
    param.skip = this.skip;
    param.limit = this.limit;
    console.log(param);
    this.api.get("8017/api/ascend/learnhub/v1/get_question", param).subscribe((result) => {
      console.log(result);
      this.refresh = false;
    // this.isShowloading = false;
      if (result != null) {
        // this.toastService.showSuccess("Save Successfully");
        if (result?.data?.length) {
        this.questionList = result?.data;
          this.skip = this.skip + result?.data.length;
          this.isUpdate = true;

          for (let i in this.questionList) {
            this.setQuestion(this.questionList[i]);
            if(parseInt(i) ==  (this.questionList.length -1)){
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
        this.isShowloading = false;
        this.isNoMoreRecord = true;
        this.toastService.showError(result?.data?.message);
      }
    },
      (err) => {
        this.toastService.showError(err);
      });
  }



  // selectNeed(i: number) {
  //   this.needList[i].isSelect = !this.needList[i].isSelect;
  //   this.selectedNeedList = [];
  //   for (let i in this.needList) {
  //     if (this.needList[i].isSelect) {
  //       this.selectedNeedList.push(this.needList[i])
  //     }
  //   }

  // }

 

  clear() {
    this.isEdit = false;
    this.question.reset();
    this.clearFormArray();
    // this.question.patchValue({
    //   activeFlag: "true",
    // });
  }


  clearFormArray() {
    while (this.getQuestions.length !== 0) {
      this.getQuestions.removeAt(this.getQuestions.length - 1);
    }
  }

  save() {
    this.isLoad = true;
    console.log(this.question.value);
    this.isLoad = true;
    let body: any = JSON.parse(JSON.stringify(this.question.value));
    for (let i in body?.questions) {
      delete body?.questions[i]?.questionList
    }
    body.courseSno = this.data.courseSno;
    body.appUserSno = this.appUser.appUserSno;
    console.log(body);
    this.api.post("8017/api/ascend/learnhub/v1/insert_question", body).subscribe(
      (result) => {
        this.isLoad = false;
        console.log(result);
        // console.log(body);
        if (result != null && !result?.data?.message) {
          // this.clear();

          // body.masterCategorySno = result.data.masterCategorySno;
          // this.questionList.push(body);
          // this.getQuestion();
          this.toastService.showSuccess("Save Successfully");
          this.getQuestionAnswer(body?.courseCurriculumSno);
        } else {
          this.toastService.showError(result?.data?.message);
        }
      },
      (err) => {
        // this.isShowLoad = false;
        // this.isNoRecord = true;
        this.isLoad = false;
        this.toastService.showError(err);
      });
  }

  changeCourseCurriculam(i: number) {
    this.question.patchValue({
      courseCurriculumSno: this.curriculamList[i]?.courseCurriculumSno
    });
    this.skip = 0;
    this.limit = 5;
    this.isNoMoreRecord = false;
    this.getQuestionAnswer(this.curriculamList[i]?.courseCurriculumSno);
  }


  update() {
    this.isLoad = true;
    let body: any = this.question.value;
    body.deleteQuestionList = this.deleteQuestionList;
    body.deleteAnswerList = this.deleteAnswerList;
    body.courseSno = this.data?.courseSno;
    body.appUserSno = this.appUser?.appUserSno;
    console.log(body);
    this.api.put("8017/api/ascend/learnhub/v1/update_question", body).subscribe(
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

  // bulk-Upload
  setNgModelVal() {
    this.courseCurriculumSno = this.question.value.courseCurriculumSno;
  }

  // bulkupload
  toggleHover(event: any) {
    let css: any = document.getElementById("dropzone_2");
    if (event) {
      $(css).addClass("drag");
    } else {
      $(css).removeClass("drag");
    }
  }

  onDrop(files: any) {
    let file: any = {};
    file.files = [];
    file.files.push(files[0]);
    console.log(file);
    this.fileUpload(
      file,
      [
        "ods",
        "vnd.oasis.opendocument.spreadsheet",
        "vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "vnd.ms-excel",
      ],
      "candidate"
    );
  }

  fileUpload(event: any, dataType: any, type: any) {
    console.log(event.files[0]);
    this.fileName = event.files[0]?.name;
    // let questions: any = [];
    if (event?.files?.length) {
      this.isUpload = true;
      if (dataType.includes(event?.files[0]?.type?.split("/")[1])) {
        let rowObject: any;
        var fileReader = new FileReader();
        fileReader.onload = (event: any) => {
          var data = event.target.result;
          var workbook = XLSX.read(data, {
            type: "binary",
          });
          workbook.SheetNames.forEach((sheet: any) => {
            rowObject = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
            // if (type == 'candidate') {
            // this.questionBank = rowObject;
            // questions.push(rowObject)
            // console.log( this.questionBank);
            // this.candidateUploadList[0].city =  this.candidateUploadList[0].city.toString().replace(/\t/g, '').split('\r\n').toString();
            // }
            // console.log(questions)
          });
          this.isUpload = false;
          console.log(rowObject);
          this.setExcelData(rowObject);
        };
        fileReader.readAsBinaryString(event.files[0]);
      } else {
        this.isUpload = false;
        this.myInputVariable.nativeElement.value = "";

        this.toastService.showError(
          "Invalid file format. Only accept for " + dataType,
          "error"
        );
      }
    }
    $("#customFile").val("");
  }

  setExcelData(questions: any) {
    // let param={"questionAnswer":questions};
    console.log(questions);
    let questionsList: any = [];
    for (let i in questions) {
      let questionObj:any = {};
      console.log(questions[i].question);
      this.getAnswerList(questions,parseInt(i), (result:any) =>  {
        questionObj = {
          questionSno: null,
          activeFlag:true,
          question: questions[parseInt(i)]?.question,
          description: questions[parseInt(i)]?.description,
          answers: result,
  
          // [
          //   { answerKeysno: null, answerKey: questions[i].answerKey1 },
          //   { answerKeysno: null, answerKey: questions[i].answerKey2 },
          //   { answerKeysno: null, answerKey: questions[i].answerKey3 },
          //   { answerKeysno: null, answerKey: questions[i].answerKey4 },
          // ],
        };
        questionsList.push(questionObj);
      });
     
    } 
    this.questionObj = {
      courseCurriculumSno: this.courseCurriculumSno,
      questions: questionsList,
    };
    console.log(questionsList);
  
  }

  getAnswerList(arr:any,index:any,callback:any){
    let answerList : any = [];
    // for(let i of [1,2,3,4,5,6,7,8,9,10]){
      for (let i = 1; i <= 100; i++) {
      if(arr[index]['answerKey' + i] != null && arr[index]['answerKey' + i] != undefined && arr[index]['answerKey' + i] != ''){
        answerList.push({ answerKeysno: null, answerKey: arr[index]['answerKey' +  i] });
      }
    }
    callback(answerList) ;
  }

  excelBulkUpload() { 
    this.isLoad = true;
    let body: any = this.questionObj;
    console.log(body);
    this.api.post("8074/api/faangpath/insert_question", body).subscribe(
      (result) => {
        this.isLoad = false;
        console.log(result);
        // console.log(body);
        if (result != null && !result?.data?.message) {
          this.fileName = null;
          // this.clear();
          // this.bulk_upload_modal.click();
          // this.bulk_upload_modal.nativeElement.click();
          // $("closeBulkUpload").click();
          // $('#closeBulkUpload').modal(close)
          // this.questionList.pop(this.questionObj);
          // this.questionAnswerList.pop(this.questionObj);
          this.question.patchValue({
            courseCurriculumSno: this.courseCurriculumSno,
          });
          this.getAnswer(this.courseCurriculumSno);
          this.toastService.showSuccess("Save Successfully");
          this.closeDialogue();
          this.bulk_upload_modal.nativeElement.click();
        } else {
          this.toastService.showError(result?.data?.message);
        }
      },
      (err) => {
        this.isLoad = false;
        this.isNoRecord = true;
        this.isLoad = false;
        this.toastService.showError(err);
      }
    );
  }


  // download(url: any) {
  //   let a = document.createElement("a");
  //   a.href = url;
  //   a.click();
  // }

  download(){
    const excelFilePath = '/assets/sample_questioners.xlsx'; // Replace with your Excel file name and extension
    // Create an anchor element
    const link = document.createElement('a');
    link.setAttribute('href', excelFilePath);
    link.setAttribute('download', 'downloaded-questioners-excel-file.xlsx'); // Specify the filename for the downloaded file

    // Simulate a click to trigger the download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  addMedia() {
    let element: HTMLElement = document.querySelector(
      'input[name="fileUploader"]'
    ) as HTMLElement;
    element.click();
  }

  closeDialogue() {
    this.courseCurriculumSno = null;
    this.fileName = null;
    this.levelList.forEach((el:any) => {
      el.isSelect = false;
    });
  }

  selectLevelType(index:any){
    this.levelTypeCdList = [];
    this.levelList[index].isSelect = !this.levelList[index].isSelect;
    for(let i in this.levelList){
      if(this.levelList[i].isSelect){
        this.levelTypeCdList.push(this.levelList[i].levelSno);
      }
    }
  }


getMoreTechQuestion(){
  this.getTechQuestion(this.question.value.courseCurriculumSno);
}


getTechQuestion(courseCurriculumSno: number) {
    this.isShowloading = true;
    // this.clear();
    this.question.patchValue({  
      courseCurriculumSno: courseCurriculumSno
    });
    let param: any = {};
    param.courseCurriculumSno = courseCurriculumSno;
    param.appUserSno = this.appUser?.appUserSno;
    param.courseSno = this.data?.courseSno;
    param.skip = this.skip;
    param.limit = this.limit;
    this.api.get("8017/api/ascend/learnhub/v1/get_question", param).subscribe((result) => {
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
            if(parseInt(i) ==  (this.questionList.length -1)){
              this.isShowloading = false;
            }
          }
        } else {
          this.isShowloading = false;
          this.isNoMoreRecord = true;
           if(this.getQuestions.value.length > 0)
            this.isUpdate = true;
           else
            this.isUpdate = false;
        }
      } else {
        this.isShowloading = false;
        this.isNoMoreRecord = true;
        this.toastService.showError(result?.data?.message);
      }
    },
      (err) => {
        this.toastService.showError(err);
      });
  }



  async onFileChange(event: any) {
    const files: FileList = event.target.files;
    this.files = files;
    this.fileInput.nativeElement.value = "";
  }

  addMatchPairs(index: number) {
    let pairGroup: any = this.fb.group({
      pairSno: new FormControl(null),
      leftItem: new FormControl(null, [Validators.required]),
      rightItem:new FormControl(null, [Validators.required]),
    });
    this.getMatchAnswerPairs(index).push(pairGroup);
    console.log(this.getMatchAnswerPairs)
  }

  getMatchAnswerPairs(index: number) {
    return this.getQuestions.at(index).get("pairs") as FormArray;
  }

  removeMatchPair(index: number) {
    this.matchPairs.removeAt(index);
  }

  addAnswerKey(index: number, questionType: string) {
    let answersGroup: any;
  
    if (questionType === 'Fill Up') {
        answersGroup = this.fb.group({
            answerSno: new FormControl(null),
            answer: new FormControl(null, [Validators.required]),
            answerTypeCdValue: new FormControl("Text"),
            isCorrect: new FormControl("True"),
            statusCd: new FormControl("Active")
        });
    } else {
        answersGroup = this.fb.group({
            answerSno: new FormControl(null),
            answer: new FormControl(null, [Validators.required]),
            answerTypeCdValue: new FormControl(null, [Validators.required]),
            isCorrect: new FormControl(null, [Validators.required]),
            statusCd: new FormControl("Active", [Validators.required])
        });
    }
    this.getQuestionAnswerKeys(index).push(answersGroup);
  }
  
  selectedQType(questionType: string, index: number) {
    this.show[index] = questionType;
    console.log(questionType);
    this.getQuestionAnswerKeys(index).clear(); // Clear previous answer keys
    this.addAnswerKey(index, questionType); // Add new answer key based on question type
  }
  
  getQuestionAnswerKeys(index: number) {
    return this.getQuestions.at(index).get("answers") as FormArray;
  }
  
  get getQuestions() {
    return this.question.controls["questions"] as FormArray;
  }
  




}

