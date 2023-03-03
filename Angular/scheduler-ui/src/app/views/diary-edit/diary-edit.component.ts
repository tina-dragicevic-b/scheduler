import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Diary } from 'src/app/models/diary/diary';
import { DiaryService } from 'src/app/services/diary/diary.service';
import { ThemeService } from 'src/app/services/theme-service/theme.service';
import { TokenStorageService } from 'src/app/services/token-storage/token-storage.service';

@Component({
  selector: 'app-diary-edit',
  templateUrl: './diary-edit.component.html',
  styleUrls: ['./diary-edit.component.sass']
})
export class DiaryEditComponent implements OnInit {

  token1!: string;
  token2!: string;
  token!: string;
  diary = new Diary();
  id!: string;

  constructor(
    private tokenStorage: TokenStorageService,
    private route: ActivatedRoute,
    @Inject(DOCUMENT) private document: Document,
    private router: Router,
    private diaryService: DiaryService,
    private themeService: ThemeService
  ) {
  }

  ngOnInit(): void {
    this.token1 = String(this.tokenStorage.getToken());
    this.token2 = this.route.snapshot.queryParamMap.get('token')!;
    this.route.params.subscribe( p => {
      this.id = p['id'];
    });
    if(this.token1 === null || this.token1 === 'null'){this.token = this.token2}
    else {this.token = this.token1}

    this.themeService.userTheme(this.token)
    
    this.diaryService.getById(this.id, this.token).subscribe( (response) => {
      this.diary = response;
    })

  }

  onSubmit() {
    this.diaryService.update(this.id, this.token, this.diary).subscribe()
    this.router.navigate(['../diaries'], { queryParams: { token: this.token}}).then(() => {
     // window.location.reload();
    });
  }
  back(){
    this.router.navigate(['../diaries'], { queryParams: { token: this.token}}).then(() => {
     // window.location.reload();
    });
  }
  // changeTheme(theme: string) {
    // this.themeService.switchTheme(theme);
  // }
}
