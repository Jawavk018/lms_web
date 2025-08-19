import { Component } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import Swal from "sweetalert2";
import { ApiService } from "../providers/api/api.service";
import { FileUploadService } from "../providers/socket/socket.service";
import { ToastService } from "../providers/toast/toast.service";
import { TokenStorageService } from "../providers/token-storage.service";

@Component({
  selector: "app-survey",
  templateUrl: "./survey.component.html",
  styleUrls: ["./survey.component.scss"],
})
export class SurveyComponent {
  userInfo: any = this.tokenService.getUser();
  skip: number = 0;
  limit: number = 12;
  surveydetails: any;
  selectedFile: File | null = null;
  files:any = [];  
  isLoad:boolean = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private api: ApiService,
    private toastService: ToastService,
    private tokenService: TokenStorageService,
    private fileUploadService: FileUploadService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getSurvey();
  }

  getSurvey() {
    let param: any = {};
    param.skip = this.skip;
    param.limit = this.limit;
    param.appUserSno = this.userInfo.appUserSno;
    param.role = "Learner";
    this.api.get("8000/api/ascend/learnhub/v1/get_survey", param).subscribe(
      (result) => {
        console.log(result);
        if (result != null) {
          if (result.data != null && result.data.length > 0) {
            this.surveydetails = result.data[0];
            console.log(this.surveydetails);
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

  stars(max: any, min: any): number[] {
    return Array(max)
      .fill(min)
      .map((x, i) => i + 1);
  }

  rate(value: number) {
    console.log(value);
    // this.rating = value;
    // this.ratingChange.emit(this.rating);
  }

  selectOption(imageChoiceSno: any) {
    console.log(imageChoiceSno);
  }

  // onLikertChange(event: Event,index:any): void {
  //   const target = event.target as HTMLInputElement;
  //   console.log('Selected value:', target.value); // Log the selected value
  //   let likertSno = this.surveydetails.questions[index].likertOptions.find((option:any) => option.value == target.value)?.likertScaleSno;
  //   let selectedoption  = this.surveydetails.questions[index].likertOptions.find((option:any) => option.value == target.value)?.optionText;

  //   console.log(likertSno);
  //   console.log(selectedoption);

  //   this.surveydetails.questions[index].selectedoption = selectedoption
  //   this.surveydetails.questions[index].selectedOptionSno =  likertSno;
  //   console.log(this.surveydetails.questions[index])

  // }

  //  findMinMaxValue(dataList:any,type:any) {
  //   if(type == 'Min'){
  //     return  dataList.reduce((min:any, current:any) => current.value < min ? current.value : min, dataList[0].value);

  //   } else if(type == 'Max'){
  //     // Use reduce to find the maximum value
  //   return dataList.reduce((max:any, current:any) => current.value > max ? current.value : max, dataList[0].value);
  //   }

  // }

  findMinMaxValue(options: any[], type: "Min" | "Max"): number {
    if (type === "Min") {
      return Math.min(...options.map((option) => option.value));
    } else if (type === "Max") {
      return Math.max(...options.map((option) => option.value));
    }
    return 0; // Default return value if logic fails
  }

  onLikertChange(event: Event, index: number): void {
    const target = event.target as HTMLInputElement;
    const selectedValue = parseInt(target.value, 10); // Parse value as integer

    // Find corresponding likert scale details
    const likertOption = this.surveydetails.questions[index].likertOptions.find(
      (option: any) => option.value === selectedValue
    );

    // Update selectedoption and selectedOptionSno in survey object
    if (likertOption) {
      this.surveydetails.questions[index].selectedoption =
        likertOption.optionText + " - " + likertOption.value;
      this.surveydetails.questions[index].selectedOptionSno =
        likertOption.likertScaleSno;
      console.log(this.surveydetails.questions[index]);
    } else {
      // Handle case where no matching option is found
      this.surveydetails.questions[index].selectedoption = "";
      this.surveydetails.questions[index].selectedOptionSno = null;
    }
  }

  async save(){
    let arr: any = this.surveydetails.questions;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].questionType === 'slider') {
        try {
          console.log(arr[i].dataFile);
          let result = await this.fileUploadData(arr[i].dataFile, 0);
          console.log(result);
          arr[i].slides = structuredClone(result);
        } catch (error) {
          console.error('Error uploading file:', error);
        }
      }
    }
    this.surveydetails.questions = structuredClone(arr);
    this.submitForm();

  }

  submitForm() {
    let body: any = {};
    body = this.surveydetails;
    body.appUserSno = this.userInfo?.appUserSno;
    console.log(body);
    this.api.post("8000/api/ascend/learnhub/v1/insert_survey_response", body).subscribe(
      (result) => {
        console.log(result);
        if (result != null && result?.data) {
          this.toastService.showSuccess("Saved Successfully");
          this.showAlertAndRedirect();
        } else {
          this.toastService.showError("Something went wrong");
        }
      },
      (err) => {
        this.toastService.showError(err);
      }
    );
  }

  showAlertAndRedirect() {
    Swal.fire({
      title: "Thanks for your contribution!",
      text: "Your record is safe.",
      icon: "success",
      confirmButtonColor: "#3085d6",
      confirmButtonText: "OK",
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(["/"], { replaceUrl: true });
      }
    });
  }

  // Rank

  onRankChange(obj: any): void {
    console.log(obj);
  }

  getAvailableRanks(index: any, currentIndex: number): number[] {
    const allRanks = this.surveydetails.questions[index]?.rankingOptions.map(
      (option: any) => option.rank
    );
    const selectedRanks = this.surveydetails.questions[index]?.rankingOptions
      .filter((_: any, index: any) => index !== currentIndex)
      .map((option: any) => option.selectedRank)
      .filter((rank: any) => rank !== null);

    return allRanks.filter((rank: any) => !selectedRanks.includes(rank));
  }

  // FileUpload

  onFileChange(event: Event, index: any): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.surveydetails.questions[index].files = target.files[0];
      this.surveydetails.questions[index].isUpload = true
    }
  }

  uploadFile(index: any) {
    this.isLoad = true;
    this.selectedFile;
    this.files = [];
    if (this.surveydetails.questions[index].files) {
      this.files.push(this.surveydetails.questions[index].files);

      this.fileUploadService.send(this.files, (result: any) => {
        if (result && result?.length > 0) {
          this.isLoad = false;
          console.log(result);
          let fileName = this.surveydetails.questions[index].files.name;
          console.log(fileName);
          result[0].fileName = fileName;
          this.surveydetails.questions[index].files = result[0];
          console.log(this.surveydetails.questions[index].files);
          this.surveydetails.questions[index].isUpload = false;
          
        } else {
        }
      });
    } else {
    }
  }

//   

onFileSelected(event: Event,survey:any): void {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
      if(!Array.isArray(survey.slides)){
        survey.slides = [];
        survey.dataFile = [];
      }
    if (survey?.slides.length  >= survey?.slider?.sliderMax) {
      alert(`You can only upload up to ${survey.slider?.sliderMax} slides.`);
      return;
    }

    const file = input.files[0];
    survey.dataFile.push(file);
    console.log(file);
    const fileType = file.type.startsWith('image') ? 'image' : 'video';
    const reader = new FileReader();

    reader.onload = (e: any) => {
      const newSlide = {
        type: fileType,
        mediaUrl: e.target.result
      };
      if (survey.slides.length < survey?.slider?.sliderMax) {
        survey.slides.unshift(newSlide);
        // this.uploadFileSlide(file, newSlide);
      } else {
        alert(`You can only upload up to ${survey?.slider?.sliderMax} slides.`);
      }
    };

    reader.readAsDataURL(file);
  }
}


// fileUploadData(file: File, slide: any): void {
//   const formData = new FormData();
//   formData.append('file', file);
//   formData.append('slide', JSON.stringify(slide));

//   // this.http.post('/api/upload', formData).subscribe(response => {
//   //   console.log('File uploaded successfully', response);
//   // }, error => {
//   //   console.error('File upload failed', error);
//   // });
// }

fileUploadData(slider: any[], index: number, data: any[] = []): Promise<any> {
  return new Promise((resolve, reject) => {
    this.files = [];

    if (slider[index]) {
      this.files.push(slider[index]);
      console.log(this.files);

      this.fileUploadService.send(this.files, (result: any) => {
        if (result && result.length > 0) {
          console.log(result);

          data.push(result[0]);

          if (index !== slider.length - 1) {
            // Recursively call fileUpload for the next index, passing the updated data
            this.fileUploadData(slider, index + 1, data).then(resolve).catch(reject);
          } else {
            console.log(data);
            resolve(data);
          }
        } else {
          reject(new Error('File upload failed'));
        }
      });
    } else {
      if (index !== slider.length - 1) {
        // Recursively call fileUpload for the next index, passing the current data
        this.fileUploadData(slider, index + 1, data).then(resolve).catch(reject);
      } else {
        console.log(slider);
        resolve(data);
      }
    }
  });
}

  
  
}
