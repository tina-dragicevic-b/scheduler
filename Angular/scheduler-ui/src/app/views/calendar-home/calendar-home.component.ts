import { Component, Input, OnInit, Renderer2, ElementRef, AfterViewInit, ViewChild  } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ThemeService } from 'src/app/services/theme-service/theme.service';
import { TokenStorageService } from 'src/app/services/token-storage/token-storage.service';
import { UserService } from 'src/app/services/user/user.service';
@Component({
  selector: 'app-calendar-home',
  templateUrl: './calendar-home.component.html',
  styleUrls: ['./calendar-home.component.sass']
})
export class CalendarHomeComponent implements OnInit, AfterViewInit {

  token1!: string;
  token2!: string;
  token: string | undefined
  @Input() receivedValue: String | undefined;
  //@ViewChild('templateRefName') elementRef!: ElementRef;
  constructor(
    private tokenStorage: TokenStorageService,
    private userService: UserService,
    private route: ActivatedRoute,
    private elementRef: ElementRef,
    private renderer2: Renderer2 ,
    private themeService: ThemeService
    ) { }

  ngOnInit(): void {

    this.token1 = String(this.tokenStorage.getToken());
    this.token2 = this.route.snapshot.queryParamMap.get('token')!;

    this.themeService.userTheme(this.token2)
    
    //  STYLE
    /* this.renderer2.setStyle(this.elementRef.nativeElement,
      "background-color",
      'blue'); */
    //  END STYLE 
/*     this.userDto.regToken = tok;
    this.userDto.authToken = token!;
    let response = this.userService.saveTolkein(tok, token!);
    response.forEach((res) => console.log(res))
    console.log("drugi req: ") */
    //this.userService.saveTolkein(this.token1, this.token2!).subscribe()
    /* if(token1 === null || token1 === 'null' || token2 === null || token2 === 'null'){
      this.token = this.child.receivedValue
    } */
    
  }
  /* updateHostProperty(){
    this.elementRef.nativeElement.
  }
  ngAfterContentInit(){

  } */
  ngAfterViewInit() {
    this.renderer2.setStyle(this.elementRef.nativeElement, 'background', 'yellow');
    //his.renderer2.setProperty(this.elementRef.nativeElement, 'innerHTML', '<p>Hello World<p>');
  }
  changeTheme(theme: string) {
    this.themeService.switchTheme(theme, this.token2!);
  }
}
