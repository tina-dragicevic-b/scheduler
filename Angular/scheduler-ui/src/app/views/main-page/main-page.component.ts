import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavbarComponent } from 'src/app/components/navbar/navbar.component';
import { UserDto } from 'src/app/models/user-dto/user-dto';
import { EventServiceService } from 'src/app/services/event-service.service';
import { ThemeService } from 'src/app/services/theme-service/theme.service';
import { TokenStorageService } from 'src/app/services/token-storage/token-storage.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.sass'],
})
export class MainPageComponent implements OnInit, AfterViewInit {
  userDto: UserDto = new UserDto();
  //usrTok!: string;
  token1!: string;
  token2!: string;
  token: string | undefined;
  redirectToken: string | undefined;
  @Input() receivedValue: String | undefined;
  @ViewChild(NavbarComponent) child: any;

  constructor(
    private tokenStorage: TokenStorageService,
    private userService: UserService,
    private route: ActivatedRoute,
    private themeService: ThemeService

  ) {}
  ngAfterViewInit(): void {
    if (
      this.token1 === null ||
      this.token1 === 'null' ||
      this.token2 === null ||
      this.token2 === 'null'
    ) {
      this.token = this.child.token;
      this.redirectToken = this.token;
    }
  }

  ngOnInit(): void {
    this.token1 = String(this.tokenStorage.getToken());
    this.token2 = this.route.snapshot.queryParamMap.get('token')!;
    if ( this.token1 === null || this.token1 === 'null' ){
      this.redirectToken = this.token2;
    }
    else {
      this.redirectToken = this.token1;
    }
    this.themeService.userTheme(this.redirectToken)
    this.userService.getUser(this.redirectToken).then(response => {
      response.forEach( r => this.userDto = r )
    }) 
  }

}
