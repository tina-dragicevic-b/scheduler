import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UserService } from '../user/user.service';
import { UserDto } from 'src/app/models/user-dto/user-dto';
import { async } from '@angular/core/testing';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  user: UserDto = new UserDto();
  // user!: UserDto;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private userService: UserService
  ) {}

  switchTheme(theme: string, token: string) {
    this.userService.getUser(token).then((response) => {
      response.subscribe((r) => {
        // console.log(JSON.stringify(r));
        this.user = r;
        // console.log('user ' + this.user.displayName);

        let themeLink = this.document.getElementById(
          'app-theme'
        ) as HTMLLinkElement;

        var body = this.document.getElementById('body');

        // CHANGE
        if (themeLink) {
          if (theme === 'light') {
            themeLink.href =
              'https://cdnjs.cloudflare.com/ajax/libs/primeng/13.4.1/resources/themes/lara-light-teal/theme.min.css';
            body!.style.background =
              'linear-gradient(0deg, rgba(253,255,244,1) 0%, rgba(253,255,244,1) 100%)';

            this.userService.saveUserPreference(token, theme).subscribe();
          } else {
            themeLink.href =
              'https://cdnjs.cloudflare.com/ajax/libs/primeng/13.4.1/resources/themes/vela-blue/theme.min.css';
            body!.style.background =
              'linear-gradient(0deg, rgba(38,57,82,1) 0%, rgba(38,57,82,1) 100%)';
            this.userService.saveUserPreference(token, theme).subscribe();
          }
        }
      });
    });
  }
  userTheme(token: string) {
    let themeLink = this.document.getElementById(
      'app-theme'
    ) as HTMLLinkElement;

    const light = "lara-light-teal"
    const dark = "vela-blue"

    var body = this.document.getElementById('body');
    this.userService.getUser(token).then((response) => {
      response.subscribe((r) => {
        this.user = r;
      });
    }).finally( () => { 
      
      setTimeout( () => {

        if (themeLink.href.includes(light) && this.user.themePreference === 'light'
        ) {
          return;
        } else if (
          themeLink.href.includes(dark) && this.user.themePreference === 'dark'
        ) {
          return;
        } else if (
          themeLink.href.includes(dark) &&
        this.user.themePreference.includes('light')
        ) {
          themeLink.href =
            "https://cdnjs.cloudflare.com/ajax/libs/primeng/13.4.1/resources/themes/lara-light-teal/theme.min.css"
        body!.style.background =
          'linear-gradient(0deg, rgba(253,255,244,1) 0%, rgba(253,255,244,1) 100%)';}      
  
      }, 50)

    })
  }
}
