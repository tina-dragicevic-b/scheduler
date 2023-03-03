import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Diary } from 'src/app/models/diary/diary';
import { DiaryService } from 'src/app/services/diary/diary.service';
import { ThemeService } from 'src/app/services/theme-service/theme.service';
import { TokenStorageService } from 'src/app/services/token-storage/token-storage.service';

@Component({
  selector: 'app-diary-view',
  templateUrl: './diary-view.component.html',
  styleUrls: ['./diary-view.component.sass'],
})
export class DiaryViewComponent implements OnInit {
  token1!: string;
  token2!: string;
  token!: string;
  diary = new Diary();
  diaryForm!: FormGroup;
  constructor(
    private tokenStorage: TokenStorageService,
    private route: ActivatedRoute,
    @Inject(DOCUMENT) private document: Document,
    private router: Router,
    private diaryService: DiaryService,
    private themeService: ThemeService

  ) {
    /* var toolbarOptions = ['bold', 'italic', 'underline', 'strike'];

  var quill = new Quill('#editor', {
    modules: {
      toolbar: toolbarOptions
    }
  }); */
  }

  ngOnInit(): void {
    this.token1 = String(this.tokenStorage.getToken());
    this.token2 = this.route.snapshot.queryParamMap.get('token')!;
    if(this.token1 === null || this.token1 === 'null'){this.token = this.token2}
    else {this.token = this.token1}
    this.themeService.userTheme(this.token)
  }
  onSubmit() {
    console.log(this.diary.text);
    this.diaryService.save(this.diary, this.token).subscribe()
    //this.router.navigate(['../diaries'], { queryParams: { token: this.token}});
    this.back()
    
  }
  setBackground(): string{
    //return 'background: radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%)  !important'
    //return 'red'
    return ''
  }
  back(){
    this.router.navigate(['../diaries'], { queryParams: { token: this.token}}).then(() => {
      //window.location.reload();
    });
  }
}
