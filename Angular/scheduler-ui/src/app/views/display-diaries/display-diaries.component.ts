import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Diary } from 'src/app/models/diary/diary';
import { DiaryService } from 'src/app/services/diary/diary.service';
import { TokenStorageService } from 'src/app/services/token-storage/token-storage.service';
const { htmlToText } = require('html-to-text');
import {ConfirmationService, MessageService} from 'primeng/api';
import { Location } from '@angular/common'
import { ThemeService } from 'src/app/services/theme-service/theme.service';

@Component({
  selector: 'app-display-diaries',
  templateUrl: './display-diaries.component.html',
  styleUrls: ['./display-diaries.component.sass'],
  encapsulation: ViewEncapsulation.None,
})
export class DisplayDiariesComponent implements OnInit {
  diaries: Diary[] = [];
  diaryDesplaied!: string;
  token1!: string;
  token2!: string;
  token!: string;

  constructor(
    private tokenStorage: TokenStorageService,
    private route: ActivatedRoute,
    private router: Router,
    private diaryService: DiaryService,
    private domSanitizer: DomSanitizer,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private location: Location,
    private themeService: ThemeService

  ) {}

  ngOnInit(): void {
    this.token1 = String(this.tokenStorage.getToken());
    this.token2 = this.route.snapshot.queryParamMap.get('token')!;

    if (this.token1 === null || this.token1 === 'null') {
      this.token = this.token2;
    } else {
      this.token = this.token1;
    }
    this.themeService.userTheme(this.token)

    this.diaryService.findAll(this.token).subscribe((response) => {
      response.forEach((element) => {
        this.generatedDateAndTimeFormat(element);
        if(element.dateTimeModified){
          //console.log(element.dateTimeModified)
          this.modifiedDateAndTimeFormat(element);
        }
        this.diaries.push(element);
      });
    });

  }
  sanitize(text: string): SafeHtml {
    return this.domSanitizer.bypassSecurityTrustHtml(text);
  }

  onDeleteToggle(event: Event, diary: Diary) {
    this.confirmationService.confirm({
      target: event.target!,
      message: "Are you sure that you want to delete this diary?",
      icon: "delete-warning pi pi-exclamation-triangle",
      accept: () => {
        this.diaryService.delete(diary.id, this.token).subscribe((response) => { 
          this.diaries = []
          response.forEach((element) => {
            this.generatedDateAndTimeFormat(element);
            if(element.dateTimeModified){
              this.modifiedDateAndTimeFormat(element);
            }
            this.diaries.push(element);
          });
        })
        this.closeDeleteConfirmation()
      },
      reject: () => {
        this.closeDeleteConfirmation()
      }
    });
  }
  closeDeleteConfirmation(){
    this.confirmationService.close()
  }
  generatedDateAndTimeFormat(diary: Diary) {
    var splittedByT: string[] = [];
    splittedByT = diary.dateTimeGenerated?.toString().split('T');
    diary.dateGeneratedFormat = this.defineDateFormat(splittedByT[0]);
    var hour = splittedByT[1].split(':')
    diary.timeGeneratedFormat = hour[0] + ':' + hour[1];
  }
  defineDateFormat(date: string): string {
    var splittedByHyphen = date.split('-');
    return (
      splittedByHyphen[2] +
      'th ' +
      this.defineMonth(splittedByHyphen[1]) +
      ' ' +
      splittedByHyphen[0]
    );
  }
  defineMonth(month: string): string {
    switch (month) {
      case '01':
        return 'January';
      case '02':
        return 'February';
      case '03':
        return 'March';
      case '04':
        return 'April';
      case '05':
        return 'May';
      case '06':
        return 'June';
      case '07':
        return 'July';
      case '08':
        return 'August';
      case '09':
        return 'September';
      case '10':
        return 'October';
      case '11':
        return 'November';
      case '12':
        return 'December';
    }
    return 'undifined';
  }
  modifiedDateAndTimeFormat(diary: Diary) {
    console.log(diary.text)
    var splittedByT: string[] = [];
    splittedByT = diary.dateTimeModified?.toString().split('T');
    diary.dateModifiedFormat = this.defineDateFormat(splittedByT[0]);
    var hour = splittedByT[1].split(':')
    diary.timeModifiedFormat = hour[0] + ':' + hour[1];
  }


  back(): void {
    // this.location.back()
    this.router.navigate(['../home'], { queryParams: { token: this.token}}).then(() => {
     // window.location.reload();
    });
  }
  addNewDiary(): void {
    // this.location.back()
    this.router.navigate(['../my-diary'], { queryParams: { token: this.token}});
  }
}
