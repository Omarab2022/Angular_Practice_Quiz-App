import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-quiz-app',
  templateUrl: './quiz-app.component.html',
  styleUrls: ['./quiz-app.component.css']
})
export class QuizAppComponent implements OnInit{


  questionList : any[] =[];

  showWarning:boolean = false;

  isQuizStarted:boolean = false;
   
  CurrentQestionNumber : number =1 ;

  remainingtime: number = 10;

  timer = interval(1000);

  subscription : Subscription[] = [];

  correctAnswerCount:number = 0;

  isQuizEnd:boolean = false;

  zeroAnswer:boolean = false;

  constructor( private http : HttpClient){
}

  ngOnInit(): void {
   this.loadQuestionJson()
  }

  //questions

  loadQuestionJson(){
    this.http.get("assets/quiz.json").subscribe({
      next : (res:any) =>{

        this.questionList = res;
      console.log(this.questionList)
      }
    })
  }

  //next question

  nextQuestion() {
    this.remainingtime = 10;
    if(this.CurrentQestionNumber < this.questionList.length){
    this.CurrentQestionNumber+=1;
    
    }else{
      this.subscription.forEach(element => {

        element.unsubscribe();

      });
    }
    }
    

  showwarningPopup(){
    this.showWarning = true ;
  }

  quitwwarningPopup(){
    this.showWarning =false ;
  }



  startquiz(){
    this.showWarning = false ;
    this.isQuizStarted = true;
   
   this.subscription.push(this.timer.subscribe(res =>{
     if (this.remainingtime != 0) {
      
      this.remainingtime--;
     }
     if(this.remainingtime == 0){
      this.nextQuestion();
      this.remainingtime = 10;
     }
    })
   )
  }

  selectoption(option:any) {
    if (option.isCorrect ) {
      this.correctAnswerCount++;
      
    }
    option.isSelected = true ;

    if(this.correctAnswerCount == 0){
      this.zeroAnswer=true;
    }
    if(this.correctAnswerCount !== 0){
      this.zeroAnswer=false;
    }
    }


  isOptionSelected(option: any) {
    const selectionCount = option.filter((m:any)=> m.isSelected  == true).length;

    if (selectionCount == 0) {
      return false ;
    }else{
      return true;
    }
  }

   //ending

  ending() {
   this.isQuizEnd = true ;
   this.isQuizStarted = false;

    }

    //quit
    start() {
      this.showWarning = false;
      this.isQuizEnd=false;
     this.resetQuiz()
      
      }

      resetQuiz() {
        this.isQuizEnd = false;
        this.isQuizStarted = false;
        this.CurrentQestionNumber = 1;
        this.remainingtime = 10;
        this.correctAnswerCount = 0;
        this.questionList.forEach((question) => {
          question.options.forEach((option:any) => {
            option.isSelected = undefined;
          });
        });
      }
      

      replay() {
        this.resetQuiz();
        this.isQuizStarted = true;
      }
      
    
}