import { Component, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { EventEmitter } from 'stream';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.sass'],
})

export class NavbarComponent implements OnInit {
  items: MenuItem[] = [];
  activeItem: MenuItem = this.items[0];
  @Input() receivedValue: string = '';
  token: string | undefined

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {

    if(this.receivedValue !== undefined || this.receivedValue !== ''){
      this.token = this.receivedValue
    } 
    this.items = [
      {
        label: 'Home',
        icon: 'navbar-items-color pi pi-fw pi-home',
        routerLink: '/home', queryParams: {token: this.receivedValue}
      },
      {
        label: 'Calendar',
        icon: 'navbar-items-color pi pi-fw pi-calendar',
        routerLink: '/calendar', queryParams: {token: this.receivedValue},
      },
      {
        label: 'List Events',
        icon: 'navbar-items-color pi  pi-list',
        routerLink: '/list', queryParams: {token: this.receivedValue},
      },
      {
        label: 'Add Event',
        icon: 'navbar-items-color pi pi-fw pi-pencil',
        routerLink: '/addevent', queryParams: {token: this.receivedValue},
      },
    ];
    this.activeItem = this.items[0];
  }
  setNavBackgroundColor(){
    return "#1f2d40"
  }
}
