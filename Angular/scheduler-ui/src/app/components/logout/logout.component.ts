import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenStorageService } from 'src/app/services/token-storage/token-storage.service';
import { ThemeService } from 'src/app/services/theme-service/theme.service';


@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.sass'],
})
export class LogoutComponent implements OnInit {
  constructor(
    private tokenStorageService: TokenStorageService,
    private router: Router,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {}

  logout(): void {
    this.tokenStorageService.signOut();
    this.router.navigate(['/']);
    /* this.router.navigate(['/login']); */
  }

  // changeTheme(theme: string) {
  //   this.themeService.switchTheme(theme);
  // }
}
