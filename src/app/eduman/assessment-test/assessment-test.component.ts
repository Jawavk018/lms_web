import { Component, ViewChild } from "@angular/core";
import { ApiService } from "src/app/providers/api/api.service";
import { TokenStorageService } from "src/app/providers/token-storage.service";
declare var $: any;

@Component({
  selector: "app-assessment-test",
  templateUrl: "./assessment-test.component.html",
  styleUrls: ["./assessment-test.component.scss"],
})
export class AssessmentTestComponent {
  showNext: boolean = true;
  showSubmit: boolean = false;
  selectedAnswer: string = "";
  totalScoreCount = 0;
  questionLists: any = [];
  answerLists: any = [];
  data: any;
  appUser: any = this.tokenStorage.getUser();
  passCount: number = 0;
  courseSectionList: any = [];
  selectedCount = 0;
  currentQuestionIndex = 0;

  showEmoji: boolean = false;
  @ViewChild("scoreBoard") scoreBoard: any;
  // currentQuestionIndex: number = 0;
  currentQuestion: any = this.questionLists[this.currentQuestionIndex];

  constructor(
    private api: ApiService,
    private tokenStorage: TokenStorageService
  ) { 
    this.updateSelectedCount();


  }

  ngOnInit() {
    this.data = window.history.state;
    this.getQuestions();
    this.showAnimatedEmoji();

  }
  updateSelectedCount() {
    this.selectedCount = this.questionLists.filter((question: { answer: null; }) => question.answer !== null).length;
  }

  showAnimatedEmoji() {
    this.showEmoji = true;
    setTimeout(() => {
      this.showEmoji = false;
    }, 3000); // Emoji will disappear after 3 seconds
  }

  // getEmoji() {
  //   if (this.totalScoreCount === 0) {
  //     return '😢😢😢';
  //   } else if (this.totalScoreCount > 0 && this.totalScoreCount <= 2) {
  //     return '😐😐😐';
  //   } else {
  //     return '😊😊😊';
  //   }
  // }
  
  prevQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    }
  }

  nextQuestion() {
    if (this.currentQuestionIndex < this.questionLists.length - 1) {
      this.currentQuestionIndex++;
    }
  }
  submit() {
    // Reset total score count
    this.totalScoreCount = 0;
    this.showAnimatedEmoji(); 
    // Prepare assessmentList for submission
    let assessmentList: any = [];

    // Loop through questionLists
    for (let i = 0; i < this.questionLists.length; i++) {
      const question = this.questionLists[i];

      // Handle different question types
      if (question.questionsTypeCd === 'Fill Up') {
        // For Fill Up questions, userAnswer should already be populated from input
        assessmentList.push({
          questionSno: question.questionSno,
          answer: question.userAnswer ? question.userAnswer.trim() : '', // Get trimmed user answer
          pointValue: 0 // Modify point value as necessary
        });

        // Calculate the score for Fill Up questions
        if (question.answers[0].isCorrect && question.answers[0].answer === question.userAnswer) {
          this.totalScoreCount += 1;
          console.log(this.totalScoreCount)
        }

      } else if (question.questionsTypeCd === 'Single') {
        // Handle Single choice questions
        let userAnswer = question.userAnswer;

        assessmentList.push({
          questionSno: question.questionSno,
          answer: userAnswer,
          pointValue: 0 // Modify point value as necessary
        });

        // Calculate the score for Single choice questions
        for (let j = 0; j < question.answers.length; j++) {
          if (question.answers[j].isCorrect && question.answers[j].answerSno === userAnswer) {
            this.totalScoreCount += 1;
            console.log(this.totalScoreCount)
            break;
          }
        }

      } else if (question.questionsTypeCd === 'Multiple') {
        // Handle Multiple choice questions
        let userAnswer = question.userAnswer;

        if (Array.isArray(userAnswer)) {
          userAnswer = userAnswer.join(',');
        }

        assessmentList.push({
          questionSno: question.questionSno,
          answer: userAnswer,
          pointValue: 0 // Modify point value as necessary
        });

        // Calculate the score for Multiple choice questions
        let correctCount = 0;
        for (let j = 0; j < question.answers.length; j++) {
          if (question.answers[j].isCorrect && userAnswer.includes(question.answers[j].answerSno)) {
            correctCount += 1;
            console.log(correctCount)
          }
        }

        if (correctCount === question.answers.filter((ans: { isCorrect: any; }) => ans.isCorrect).length) {
          this.totalScoreCount += 1;
        }

      } else if (question.questionsTypeCd === 'Match') {
        // Handle Match questions
        assessmentList.push({
          questionSno: question.questionSno,
          answer: question.userAnswer, // Assuming userAnswer is already matched pair answer
          pointValue: 0 // Modify point value as necessary
        });

        // Calculate the score for Match questions
        for (let j = 0; j < question.answers.length; j++) {
          if (question.answers[j].isCorrect && question.answers[j].answerSno === question.userAnswer) {
            this.totalScoreCount += 1;
            console.log(this.selectedCount)
            break;
          }
        }
      }
    }

    // Prepare API params
    let params: any = {
      appUserSno: this.appUser?.appUserSno,
      courseSno: this.data?.courseSno,
      courseCurriculumSno: this.data?.courseCurriculumSno,
      submittedOn: "Asia/Kolkata",
      assessmentList: assessmentList,
    };

    // Call API to submit assessment
    console.log(params);
    this.api.post("8017/api/ascend/learnhub/v1/create_assessment_submission", params).subscribe((result) => {
      console.log(result);
      if (result != null && result.data != null) {
        // Handle successful submission
        this.questionLists = structuredClone(this.courseSectionList); // Reset questions if needed
        this.currentQuestionIndex = 0; // Reset current question index
        this.selectedCount = 0; // Reset selected count if needed
        this.openPopup(); // Open popup or perform other actions
      } else {
        // Handle error or other conditions if needed
      }
    });
  }

  openPopup() {
    this.scoreBoard.nativeElement.click();
  }

  selectRadioButton(answerSno: string, i: any, j: any, qType: string) {
    const radioButton = document.getElementById(answerSno) as HTMLInputElement;
    if (radioButton) {
      radioButton.checked = true;
      if (qType === 'Single' || qType === 'Match') {
        this.showSelectedAnswer(i, j);
      } else {
        this.showSelectedMultiAnswer(i, j);
      }

    }
  }

  showSelectedAnswer(i: number, j: number): void {
    if (!this.questionLists[i].userAnswer) {
      this.selectedCount++;  // Increment the counter when a new answer is selected
      console.log(this.selectedCount)
    }
    this.questionLists[i].userAnswer = this.questionLists[i].answers[j].answerSno;
    console.log(this.questionLists[i].answers[j]);
  }

  showSelectedMultiAnswer(questionIndex: number, answerIndex: number): void {
    const question = this.questionLists[questionIndex];

    // Ensure question.userAnswer is initialized as an array if it's not already
    if (!Array.isArray(question.userAnswer)) {
      question.userAnswer = [];
      this.selectedCount++;
      console.log(this.selectedCount)
    }

    const selectedAnswer = question.answers[answerIndex].answerSno;
    const answerPos = question.userAnswer.indexOf(selectedAnswer);

    if (answerPos > -1) {
      question.userAnswer.splice(answerPos, 1); // Uncheck if already selected
    } else {
      question.userAnswer.push(selectedAnswer); // Add to selected answers
    }
  }

  isChecked(questionIndex: number, answerIndex: number): boolean {
    const question = this.questionLists[questionIndex];

    // Ensure question.userAnswer is initialized as an array if it's not already
    if (!Array.isArray(question.userAnswer)) {
      return false;
    }

    const answer = question.answers[answerIndex];
    return question.userAnswer.includes(answer.answerSno);
  }


  getQuestions() {
    let params: any = {
      courseCurriculumSno: this.data?.courseCurriculumSno,
      courseSno: this.data?.courseSno,
      user:'learner',
      // appUserSno:this.appUser?.appUserSno
    };

    this.api.get("8017/api/ascend/learnhub/v1/get_question", params).subscribe((result) => {
      console.log(result);
      if (result != null) {
        this.questionLists = result.data;
        this.courseSectionList = structuredClone(result.data);
        console.log(this.questionLists);
      }
    });
  }

  // Function to get Roman numeral for Left Items
  getRomanNumeral(index: number): string {
    const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X']; // Extend as needed
    return romanNumerals[index - 1] || '';
  }

  // Function to get alphabet (A, B, C, ...) for Right Items
  getAlphabet(index: number): string {
    return String.fromCharCode(65 + index); // 65 is the ASCII code for 'A'
  }


  goToQuestion(index: number): void {
    this.currentQuestionIndex = index;
  }

  onAnswerChange(question: any) {
    // Check if the answer is filled
    if (question.userAnswer && question.userAnswer.trim() !== '') {
        // Increment selectedCount if this is the first time an answer is provided
        if (!question.answered) {
            question.answered = true;
            this.selectedCount++;
        }
    } else {
        // Decrement selectedCount if the answer is cleared
        if (question.answered) {
            question.answered = false;
            this.selectedCount--;
        }
    }
}



}
