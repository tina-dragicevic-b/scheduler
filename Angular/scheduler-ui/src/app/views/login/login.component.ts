import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UrlAndMedia } from 'src/app/models/url-and-media/url-and-media';
import { UserDto } from 'src/app/models/user-dto/user-dto';
import { AuthService } from 'src/app/services/auth/auth.service';
import { TokenStorageService } from 'src/app/services/token-storage/token-storage.service';
import { UserService } from 'src/app/services/user/user.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass'],
})
export class LoginComponent implements OnInit {
  //userDto: UserDto = new UserDto();
  form: any = {};
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  currentUser: any;
  googleURL = UrlAndMedia.GOOGLE_AUTH_URL;
  // githubURL = UrlAndMedia.GITHUB_AUTH_URL;
  routToken!: string
  constructor(
    private authService: AuthService,
    private tokenStorage: TokenStorageService,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');
    const error = this.route.snapshot.queryParamMap.get('error');
    if (this.tokenStorage.getToken()) {
      this.routToken = this.tokenStorage.getToken()!;
      this.isLoggedIn = true;
      this.currentUser = this.tokenStorage.getUser();
    } else if (token) {
      this.routToken = token;
      this.tokenStorage.saveToken(token);
      //let tok = String(this.tokenStorage.getToken())
      this.userService.getCurrentUser().subscribe(
        (data: any) => {
          this.login(data);
        },
        (err: any) => {
          this.errorMessage = err.error.message;
          this.isLoginFailed = true;
        }
      );
    } else if (error) {
      this.errorMessage = error;
      this.isLoginFailed = true;
    }
  }

  onSubmit(): void {
    this.authService.login(this.form).subscribe(
      (data) => {
        this.tokenStorage.saveToken(data.accessToken);
        this.login(data.user);
      },
      (err) => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
      }
    );
  }

  login(user: any): void {
    this.tokenStorage.saveUser(user);
    this.isLoginFailed = false;
    this.isLoggedIn = true;
    this.router.navigate(
      ['/home'],
      {queryParams: {token: this.routToken} }
    )
    //window.location.reload();
  }
}
