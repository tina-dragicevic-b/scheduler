import {
  AfterViewInit,
  Component,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Event } from '../../models/event';
import { ActivatedRoute, Router } from '@angular/router';
import { EventServiceService } from 'src/app/services/event-service.service';
import { Repetition } from 'src/app/models/enum/repetition';
import { FormGroup } from '@angular/forms';
import { ConfirmationService, TreeNode } from 'primeng/api';
import { Group } from 'src/app/models/group/group';
import {to24Hours, to12Hours} from 'convert-string-time'
import { TokenStorageService } from 'src/app/services/token-storage/token-storage.service';
import { UserService } from 'src/app/services/user/user.service';
import { NavbarComponent } from 'src/app/components/navbar/navbar.component';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { GroupDialogComponent } from 'src/app/components/group-dialog/group-dialog.component';
import { Location } from '@angular/common';
import { ThemeService } from 'src/app/services/theme-service/theme.service';
import { EventOverlapService } from 'src/app/services/overlap/event-overlap.service';
/* DIALOG */

export interface DialogData {
  name: string;
  // icon: string;
  color: string;
  //newGroup: Group;
}
/* END DIALOG */
@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.sass'],
})
export class EventFormComponent implements OnInit, AfterViewInit {
  // NEW GROUP
  newGroupView: Group = new Group();
  name!: string;
  color!: string;
  // TOKEN
  token1!: string;
  token2!: string;
  token: string | undefined;
  redirectToken: string | undefined;
  //@Input() receivedValue: String | undefined;
  @ViewChild(NavbarComponent) child: any;
  // EVENT
  tinaEvent = new Event();
  eventForm!: FormGroup;
  repetition = Repetition;
  comparableOverlapEvents: Event[] = []
  // GROUP
  repetitionFormValueName!: string;
  treeNode: TreeNode[] = [];
  selectedRepetition: TreeNode[] = [];
  groups: Group[] = [];
  /* selectedGroup : any; */
  isEmojiPiskerVisible: boolean = false;
  emoji: any;

  errorMessage!: string


  constructor(
    private router: Router,
    private eventService: EventServiceService,
    private tokenStorage: TokenStorageService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private location: Location,
    private themeService: ThemeService,
    private eventOverlapService: EventOverlapService,
    private confirmationService: ConfirmationService
  ) {
    this.treeNode = [
      {
        label: 'None',
        key: 'None',
        data: 'None',
      },
      {
        label: 'Daily',
        key: 'Daily',
        data: 'Daily',
      },
      {
        label: 'Weekly',
        key: 'Weekly',
        data: 'Weekly',
        selectable: false,
        children: [
          {
            label: 'Sunday',
            key: 'Sunday',
            data: 'Sunday',
          },
          {
            label: 'Monday',
            key: 'Monday',
            data: 'Monday',
          },
          {
            label: 'Tuesday',
            key: 'Tuesday',
            data: 'Tuesday',
          },
          {
            label: 'Wednesday',
            key: 'Wednesday',
            data: 'Wednesday',
          },
          {
            label: 'Thursday',
            key: 'Thursday',
            data: 'Thursday',
          },
          {
            label: 'Friday',
            key: 'Friday',
            data: 'Friday',
          },
          {
            label: 'Saturday',
            key: 'Saturday',
            data: 'Saturday',
          },
        ],
      },
      {
        label: 'Monthly',
        key: 'Monthly',
        data: 'Monthly',
      },
      {
        label: 'Yearly',
        key: 'Yearly',
        data: 'Yearly',
      },
    ];
  }

  onSubmit() {
    //  REPETITION
    if(this.tinaEvent.startDate && this.tinaEvent.endDate){
      if (this.tinaEvent.startDate > this.tinaEvent.endDate){
        this.errorMessage = "Start date can't be after end date! "
        return
      }
    }
    if (this.selectedRepetition.length === 0) {
      this.tinaEvent.selectedRepetition.push(this.repetition.none);
    } else {
      this.selectedRepetition.forEach((element) => {
        console.log(element.data)
        this.tinaEvent.selectedRepetition.push(element.data);
      });
    }

    //  GROUP

    if (this.tinaEvent.group === undefined) {
      this.groups.forEach((element) => {
        if (element.name === 'None') this.tinaEvent.group = element;
      });
    }

    if(this.tinaEvent.selectedRepetition[0] === this.repetition.none) {
      this.overlaps()
    } else { 
      let a = to12Hours(this.tinaEvent.startTime!)
      let b = to12Hours(this.tinaEvent.endTime!)
      console.log(a!, b!)
      if(a! > b!) {
        this.selfOverlapWarning(event);
      } else { this.overlaps() }
     }

    // var overlaps = this.eventOverlapService.newEventOverlap(this.tinaEvent, this.comparableOverlapEvents)
    // overlaps.then(e => {
    //   if(e.size > 0){
    //   console.log("ajme majko ovde san")
    //     this.confirmOverlapWindow(event, e)
    //   }
    //   else {
    //     this.eventService
    //     .save(this.tinaEvent, this.redirectToken!)
    //     .subscribe();
    //     this.redirectToCalendar()
    //   }
    // })

      // this.eventService
      // .save(this.tinaEvent, this.redirectToken!)
      // .subscribe();
      // this.redirectToCalendar()
  }

  redirectToCalendar() {
    this.router.navigate(['../calendar'], {
      queryParams: { token: this.child.token },
    })
    .then(() => {
      window.location.reload();
    });
  }

  overlaps(){
    var overlaps = this.eventOverlapService.newEventOverlap(this.tinaEvent, this.comparableOverlapEvents)
    overlaps.then(e => {
      if(e.size > 0){
        this.confirmOverlapWindow(event, e)
      }
      else {
        this.eventService
        .save(this.tinaEvent, this.redirectToken!)
        .subscribe();
        this.redirectToCalendar()
      }
    })
  }


  confirmOverlapWindow(event: any, events: Set<Event>){
    let message: string = ""
    events.forEach(e => {
      message += e.name + ", "
    })
    this.confirmationService.confirm({
      target: event.target!,
      message: 'This event overlaps with other events: ' + message + 'Would you like to create it anyways? ',
      icon: 'delete-warning pi pi-exclamation-triangle',
      accept: () => {
        // this.eventService;
        // this.eventService.deleteGroup(group.name, this.token!).subscribe(() => {
        //   this.getAllEvents();
        //   this.groupEvents();
        // });
        console.log("ACCEPTED")
        this.confirmationService.close();
        this.eventService
        .save(this.tinaEvent, this.redirectToken!)
        .subscribe();
        this.redirectToCalendar()
      },
      reject: () => {
        console.log("REJECTED")
        this.confirmationService.close();
        this.redirectToCalendar()
      },
    });
  }

  selfOverlapWarning(event: any) {
    this.confirmationService.confirm({
      // target: event.target!,
      message: 'Event spreads through multiple days, therefore will be displaied only once. Would you like to create it anyways? ',
      icon: 'delete-warning pi pi-ban',
      accept: () => {
        console.log("ACCEPTED")
        this.confirmationService.close();
        // this.eventService
        // .save(this.tinaEvent, this.redirectToken!)
        // .subscribe();
        // this.redirectToCalendar()
        this.overlaps()
      },
      reject: () => {
        console.log("REJECTED")
        this.confirmationService.close();
        this.redirectToCalendar()
      },
    });
  }

  ngOnInit(): void {
    //  TOKEN
    this.token1 = String(this.tokenStorage.getToken());
    this.token2 = this.route.snapshot.queryParamMap.get('token')!;
    if (this.token2 === null || this.token2 === 'null') {
      this.redirectToken = this.token1;
    } else {
      this.redirectToken = this.token2;
    }
    this.themeService.userTheme(this.redirectToken)

    //  EVENT
    this.eventService.getGroups(this.redirectToken!).subscribe((result) => {
      this.groups = result;
      this.groups.forEach((element) => {
        element.label = element.name;
        element.key = element.name;
      });
    });
    this.eventService.getOverlaps(this.redirectToken!).then( (e) => {
      e.forEach( x => {
        this.comparableOverlapEvents = x
      })
    })
    console.log("comparableOverlapEvents", this.comparableOverlapEvents)
  }

  onClick() {
    if (this.selectedRepetition.length > 1) {
      let couter = 0;
      this.selectedRepetition.forEach((el) => {
        if (
          el.data === 'Weekly' ||
          el.data === 'Monday' ||
          el.data === 'Monday' ||
          el.data === 'Tuesday' ||
          el.data === 'Wednesday' ||
          el.data === 'Thursday' ||
          el.data === 'Friday' ||
          el.data === 'Saturday' ||
          el.data == 'Sunday'
        ) {
          couter++;
        }
      });
      if (couter !== this.selectedRepetition.length) {
        let lastValue = this.selectedRepetition.pop();
        this.selectedRepetition = [];
        if (lastValue) this.selectedRepetition.push(lastValue);
      }
    }
  }

  addEmoji(event: { emoji: { native: any } }) {
    if (this.tinaEvent.description !== undefined)
      this.tinaEvent.description = `${this.tinaEvent.description}${event.emoji.native}`;
    else this.tinaEvent.description = `${event.emoji.native}`;
    this.isEmojiPiskerVisible = false;
  }

  ngAfterViewInit(): void {
    if (
      this.token1 === null ||
      this.token1 === 'null' ||
      this.token2 === null ||
      this.token2 === 'null'
    ) {
      this.token = this.child.token;
      console.log(
        'token: ' + this.token + ', token child: ' + this.child.token
      );
      this.redirectToken = this.token;
    }
  }
  // DIALOG
  openDialog(): void {
    const dialogRef = this.dialog.open(GroupDialogComponent, {
      width: '250px',
      data: { name: this.name, color: this.color },
      /*  data: {name: this.newGroupView.name, color: this.newGroupView.color} */
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.newGroupView = result;
        this.tinaEvent.group = this.newGroupView;
        this.eventService
          .createGroup(this.newGroupView, this.redirectToken!)
          .subscribe((result) => {
            this.groups = result;
            this.groups.forEach((element) => {
              element.label = element.name;
              element.key = element.name;
            });
          });
      } else {
      }
    });
  }
  back() {
    this.location.back();
  }
}
