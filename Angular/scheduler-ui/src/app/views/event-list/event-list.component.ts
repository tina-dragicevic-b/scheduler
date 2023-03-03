import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { EventServiceService } from 'src/app/services/event-service.service';
import { Event } from 'src/app/models/event';
import { EventGroupDto } from 'src/app/models/event-group-dto/event-group-dto';
import { Group } from 'src/app/models/group/group';
import { EventListDto } from 'src/app/models/event-list-dto/event-list-dto';
import { TokenStorageService } from 'src/app/services/token-storage/token-storage.service';
import { UserService } from 'src/app/services/user/user.service';
import { ActivatedRoute } from '@angular/router';
import { NavbarComponent } from 'src/app/components/navbar/navbar.component';
import { ConfirmationService } from 'primeng/api';
import { ThemeService } from 'src/app/services/theme-service/theme.service';
@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.sass'],
  encapsulation: ViewEncapsulation.None,
})
export default class EventListComponent implements OnInit, AfterViewInit {
  events: Event[] = [];
  eventsByGroup: EventGroupDto[] = [];
  groups: Group[] = [];
  // pageOfGroups!: Array<any>;
  // cols: any[] = [];
  //eventlist: EventListDto[] = [];
  selectedEvents: Event[] = [];
  selectedEvent!: Event;
  //input = document.getElementById('search');
  // TOKEN
  token1!: string;
  token2!: string;
  token: string | undefined;
  //PAGING
  first: number = 0
  @ViewChild(NavbarComponent) child: any;
  constructor(
    private eventService: EventServiceService,
    private tokenStorage: TokenStorageService,
    private route: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private themeService: ThemeService

  ) {
    /* this.eventService.findAll().subscribe((response) => {
      response.forEach((element) => this.events.push(element));
    }); */
  }
  ngAfterViewInit(): void {
    if (
      this.token1 === null ||
      this.token1 === 'null' ||
      this.token2 === null ||
      this.token2 === 'null'
    ) {
      this.token = this.child.token;
    }
  }
  ngOnInit(): void {
    this.token1 = String(this.tokenStorage.getToken());
    this.token2 = this.route.snapshot.queryParamMap.get('token')!;

    if (this.token1 === null || this.token1 === 'null') {
      this.token = this.token2;
      this.eventService.findAll(this.token!).subscribe((response) => {
        response.forEach((element) => this.events.push(element));
      });
    } else {
      this.token = this.token1;
      this.eventService.findAll(this.token!).subscribe((response) => {
        response.forEach((element) => this.events.push(element));
      });
    }
    this.themeService.userTheme(this.token)

    this.eventService.getGroups(this.token!).subscribe((response) => {
      response.forEach((e) => this.groups.push(e));

      this.groups.forEach((group) => {
        if (group.name === 'None') {
          let ebg = new EventGroupDto();
          ebg.groupName = 'Ungrouped events';
          ebg.group = group;
          this.events.forEach((event) => {
            //console.log(event.selectedRepetition)
            if (event.group.name === 'None') {
              //ebg.group = event.group;
              ebg.eventList.push(event);
            }
          });
          this.eventsByGroup.push(ebg);
        } else {
          let ebg = new EventGroupDto();
          ebg.groupName = group.name;
          ebg.group = group;
          this.events.forEach((event) => {
            if (ebg.groupName == event.group.name) {
              //ebg.group = event.group;
              ebg.eventList.push(event);
            }
          });
          this.eventsByGroup.push(ebg);
        }
      });
    });
  }

  getAllEvents() {
    this.eventService.findAll(this.token!).subscribe((response) => {
      response.forEach((element) => this.events.push(element));
    });
  }

  groupEvents() {
    this.eventService.getGroups(this.token!).subscribe((response) => {
      response.forEach((e) => this.groups.push(e));

      this.groups.forEach((group) => {
        if (group.name === 'None') {
          let ebg = new EventGroupDto();
          ebg.groupName = 'Ungrouped events';
          ebg.group = group;
          this.events.forEach((event) => {
            if (event.group.name === 'None') {
              //ebg.group = event.group;
              ebg.eventList.push(event);
            }
          });
          this.eventsByGroup.push(ebg);
        } else {
          let ebg = new EventGroupDto();
          ebg.groupName = group.name;
          ebg.group = group;
          this.events.forEach((event) => {
            if (ebg.groupName == event.group.name) {
              //ebg.group = event.group;
              ebg.eventList.push(event);
            }
          });
          this.eventsByGroup.push(ebg);
        }
      });
    });
  }
//   onChangePage(pageOfItems: Array<any>) {
//     // update current page of items
//     this.pageOfGroups = pageOfItems;
// }
  closeDeleteConfirmation() {
    this.confirmationService.close();
  }

  fun($event: any) {
    return ($event.target as HTMLInputElement).value;
  }

  deleteEvent($event: any, selectedEvent: Event) {
    this.confirmationService.confirm({
      target: $event.target!,
      message: 'Are you sure that you want to delete this event?',
      icon: 'delete-warning pi pi-exclamation-triangle',
      accept: () => {
        this.eventService
          .delete(selectedEvent.id, this.token!)
          .subscribe(() => {
            this.getAllEvents();
            this.groupEvents();
          });
        //console.log(selectedEvent.name + ' ' + selectedEvent.id);
        this.closeDeleteConfirmation();
        window.location.reload();
      },
      reject: () => {
        this.closeDeleteConfirmation();
      },
    });
  }
  updateEvent() {}

  deleteUnusedGroup(event: any, group: Group) {
    this.confirmationService.confirm({
      target: event.target!,
      message: 'Are you sure that you want to delete this group?',
      icon: 'delete-warning pi pi-exclamation-triangle',
      accept: () => {
        this.eventService;
        this.eventService.deleteGroup(group.name, this.token!).subscribe(() => {
          this.getAllEvents();
          this.groupEvents();
        });
        this.closeDeleteConfirmation();
        window.location.reload();
      },
      reject: () => {
        this.closeDeleteConfirmation();
      },
    });
  }

  paginate(event: any) {
    this.first = event.first
    event.rows = 3
    event.page = 0
    event.pageCount = this.eventsByGroup.length
}
}
