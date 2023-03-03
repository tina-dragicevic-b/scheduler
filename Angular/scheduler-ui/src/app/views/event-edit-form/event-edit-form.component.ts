import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Event } from '../../models/event';
import { ActivatedRoute, Router } from '@angular/router';
import { EventServiceService } from 'src/app/services/event-service.service';
import { Repetition } from 'src/app/models/enum/repetition';
import { FormGroup } from '@angular/forms';
import { TreeNode } from 'primeng/api';
import { Group } from 'src/app/models/group/group';
import { TokenStorageService } from 'src/app/services/token-storage/token-storage.service';
import { NavbarComponent } from 'src/app/components/navbar/navbar.component';
import { MatDialog } from '@angular/material/dialog';
import { GroupDialogComponent } from 'src/app/components/group-dialog/group-dialog.component';
import { Location } from '@angular/common';
import { Weekdays } from 'src/app/models/enum/weekdays';
import { info } from 'console';
import { EventOverlapService } from 'src/app/services/overlap/event-overlap.service';
import { ThemeService } from 'src/app/services/theme-service/theme.service';
/* DIALOG */

export interface DialogData {
  name: string;
  icon: string;
  color: string;
}
@Component({
  selector: 'app-event-edit-form',
  templateUrl: './event-edit-form.component.html',
  styleUrls: ['./event-edit-form.component.sass'],
})
export class EventEditFormComponent implements OnInit, AfterViewInit {
  // NEW GROUP
  newGroupView: Group = new Group();
  name!: string;
  color!: string;
  previouslySelectedGroup!: string;
  // TOKEN
  token1!: string;
  token2!: string;
  token: string | undefined;
  redirectToken: string | undefined;
  @ViewChild(NavbarComponent) child: any;
  // EVENT
  tinaEvent = new Event();
  eventForm!: FormGroup;
  repetition = Repetition;
  // weekdays : Weekdays[] = [];
  // weekdaysString: string[] = []
  showSelectedRep: string[] = [];
  onInitRepEnum!: string;
  onInitWeekDays!: Weekdays[]
  //previouslySelectedRepetitionString: any;
  id!: string;
  selectedStartDate: Date[] = [];
  showFromDate!: string;
  showToDate!: string;
  comparableOverlapEvents: Event[] = []

  // GROUP
  repetitionFormValueName!: string;
  treeNode: TreeNode[] = [];
  selectedRepetition: TreeNode[] = [];
  groups: Group[] = [];
  isEmojiPiskerVisible: boolean = false;
  emoji: any;

  constructor(
    private router: Router,
    private eventService: EventServiceService,
    private tokenStorage: TokenStorageService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private location: Location,
    private overlapService: EventOverlapService,
    private themeService: ThemeService

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

    // console.log('selected ' + this.selectedRepetition);
    // console.log('show edit ' + this.showSelectedRep);
    // console.log('tina sel ' + this.tinaEvent.selectedRepetition);
    // console.log('tina enum rep ' + this.tinaEvent.repetition);

    if ( this.selectedRepetition.length === 0) {
      if(this.onInitRepEnum === 'Weekly') { 
        var prev = this.tinaEvent.selectedRepetition
        this.tinaEvent.selectedRepetition = []
        this.tinaEvent.weekDays = this.onInitWeekDays
        // prev.forEach( el => {
        //   this.tinaEvent.selectedRepetition.push(el)
        // })
        this.onInitWeekDays.forEach( (e) => { this.tinaEvent.selectedRepetition.push(e.toString())})
       }
      else {
        this.tinaEvent.selectedRepetition = [];
        this.tinaEvent.selectedRepetition.push(this.onInitRepEnum);
       }

      // console.log(' tina after ' + this.tinaEvent.selectedRepetition);
    }
    if (this.showSelectedRep !== this.tinaEvent.selectedRepetition && this.selectedRepetition.length !== 0) {
      this.tinaEvent.selectedRepetition = [];
      this.selectedRepetition.forEach((element) => {
        this.tinaEvent.selectedRepetition.push(element.data);
      });
    }
    if (
      (this.tinaEvent.selectedRepetition[0] === 'None' ||
      this.tinaEvent.selectedRepetition[0] === 'Daily' ||
      this.tinaEvent.selectedRepetition[0] === 'Monthly' ||
      this.tinaEvent.selectedRepetition[0] === 'Yearly') && this.onInitRepEnum !== 'Weekly'
    ) {
      // console.log("oooo bozee")
      this.tinaEvent.weekDays = [];
    }


    this.eventService
      .updateEvent(this.tinaEvent, this.redirectToken!)
      .subscribe();
     this.redirectToList();
    // console.log(this.tinaEvent)
  }

  redirectToList() {
    this.router
      .navigate(['../list'], {
        queryParams: { token: this.child.token },
      })
      .then(() => {
        window.location.reload();
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
    this.route.params.subscribe((p) => {
      this.id = p['id'];
    });

    this.themeService.userTheme(this.redirectToken)

    this.eventService.getOverlaps(this.redirectToken!).then( (e) => {
      e.forEach( x => {
        this.comparableOverlapEvents = x
      })
    })

    this.eventService
      .getEventById(this.id, this.redirectToken) //    //    //    //    // //    //    //    //    // //    //    //    //    //
      .subscribe((response) => {
        this.tinaEvent = response;
        this.showFromDate = this.tinaEvent.fromDate;
        this.showToDate = this.tinaEvent.toDate;
        this.previouslySelectedGroup = this.tinaEvent.group.name;
        this.onInitRepEnum = response.repetition;
        this.onInitWeekDays = response.weekDays
        if (response.weekDays) {
          if (response.weekDays.length !== 0) {
            let i = 0;
            let halfLen = response.weekDays.length; // / 2;
            response.weekDays.forEach((w) => {
              if (i < halfLen) {
                i++;
                this.showSelectedRep.push(w.toString());
              }
            });
          } else this.showSelectedRep.push(response.repetition);
        } else this.showSelectedRep.push(response.repetition);

        // console.log(
        //   response.repetition +
        //     '     ' +
        //     this.showSelectedRep +
        //     ' selected      ' +
        //     response.selectedRepetition
        // );
        //     console.log(response.weekDays)
        //this.previouslySelectedRepetitionString = this.defineSelectedRepetitionValue(this.tinaEvent.selectedRepetition);
      });
    //  EVENT
    this.eventService.getGroups(this.redirectToken!).subscribe((result) => {
      this.groups = result;
      this.groups.forEach((element) => {
        element.label = element.name;
        element.key = element.name;
      });
    });
    this.selectedStartDate.push(this.tinaEvent.startDate);
    //  REPETITION
    // this.tinaEvent.selectedRepetition.forEach((selected) => {
    //   // console.log(selected);

    //   this.treeNode.forEach((value) => {
    //     if (selected === value.data) {
    //       console.log(value.data);
    //     }
    //   });
    // });
    // console.log(this.tinaEvent)
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
    if (this.selectedRepetition.length > 1) {
      this.showSelectedRep = [];
      this.selectedRepetition.forEach((el) => {
        this.showSelectedRep.push(el.data);
      });
    } else if (
      this.selectedRepetition[0] !== undefined &&
      this.selectedRepetition[0] !== 'undefined'
    ) {
      this.showSelectedRep = [];
      this.showSelectedRep.push(this.selectedRepetition[0].data);
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
      // console.log(
      //   'token: ' + this.token + ', token child: ' + this.child.token
      // );
      this.redirectToken = this.token;
    }
  }
  // DIALOG
  openDialog(): void {
    const dialogRef = this.dialog.open(GroupDialogComponent, {
      width: '250px',
      data: { name: this.name, color: this.color },
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

  setTagBackground(){
    if(this.tinaEvent.group.color !== 'undefined'){
      return this.tinaEvent.group.color
    }
    return "#16f028"
  }

  setFontColor(){
    return "#fff"
  }
  // defineSelectedRepetitionValue(values: string[]){
  //   let list: string[] = [];
  //   if(values !== null && values.length > 1) {
  //     list.push('Weekly')
  //   }
  //   values.forEach(v => {
  //     if(v === 'Daily'){
  //       list.push('Daily')

  //     } else if(v === 'Monthly'){
  //       list.push('Monthly')

  //     } else if(v === 'Yearly'){
  //       list.push('Yearly')

  //     } else if(v === 'None'){
  //       list.push('Never')
  //     }
  //   })
  //   // const values = Object.values(Repetition);
  //   // values.forEach((value, index) => {
  //   //   if(value === this.tinaEvent.selectedRepetition[0].toLocaleLowerCase()){
  //   //      = value;
  //   //   }
  //   // });
  // }
  OnGroupChange() {
    if (this.previouslySelectedGroup === this.tinaEvent.group.name) {
    } else this.previouslySelectedGroup = this.tinaEvent.group.name;
  }

  getMonth(date: Date): string {
    const num: number = date.getMonth();
    if (num < 10) return '0' + (num + 1);
    return (num + 1).toString();
  }
  getDay(date: Date): string {
    const num: number = date.getDate();
    if (num < 10) return '0' + num;
    return num.toString();
  }
  OnEndDateChange() {
    if (this.tinaEvent.endDate !== null) {
    this.overlapService.overlaps(this.redirectToken!, this.tinaEvent, this.comparableOverlapEvents)

      this.showToDate =
        this.tinaEvent.endDate.getFullYear() +
        '-' +
        this.getMonth(this.tinaEvent.endDate) +
        '-' +
        this.getDay(this.tinaEvent.endDate);
    }
    // console.log(this.tinaEvent.endDate.toDateString())
  }
  OnStartDateChange() {
    // console.log(this.tinaEvent.startDate)
    if (this.tinaEvent.startDate !== null) {
    this.overlapService.overlaps(this.redirectToken!, this.tinaEvent, this.comparableOverlapEvents)

      console.log("Token " + this.redirectToken)
      this.showFromDate =
        this.tinaEvent.startDate.getFullYear() +
        '-' +
        this.getMonth(this.tinaEvent.startDate) +
        '-' +
        this.getDay(this.tinaEvent.startDate);
    }
  }
}
