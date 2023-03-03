import { Component, Input, OnInit } from '@angular/core';
import { Event } from '../../models/event';
import { EventServiceService } from 'src/app/services/event-service.service';
import { CalendarOptions } from '@fullcalendar/angular';
import timeGridPlugin from '@fullcalendar/timegrid';
import rrulePlugin from '@fullcalendar/rrule';
@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.sass'],
})
export class EventComponent implements OnInit {
  @Input() receivedValue: string = '';
  token: string | undefined;

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [timeGridPlugin, rrulePlugin],
    height: 800,
    contentHeight: 780,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay',
    },
    nowIndicator: true,
    aspectRatio: 3, // see: https://fullcalendar.io/docs/aspectRatio

    /* events: [
      { title: 'event 1 💛', date: '2022-05-11', icon: '💛',  textColor: 'rgb(0,0,0)', color: 'rgb(0,56,255)' },
      { title: 'event 2', date: '2022-05-12' }
    ], */
    //initialView: 'dayGridWeek' ili 'timeGridWeek'
  };

  constructor(private eventService: EventServiceService) {
    //this.calendarOptions.initialView = 'dayGridWeek'
  }

  defineStartDate(event: Event): any {
    if (event.startDate === null) {
      return '2022-05-12';
    }
  }
  ngOnInit(): void {
    if (this.receivedValue !== undefined || this.receivedValue !== '') {
      //console.log(this.receivedValue)
      this.token = this.receivedValue;
    }
    this.eventService.findAll(this.token!).subscribe((response) => {
      this.calendarOptions.events = response.map((event) => {
        if (event.selectedRepetition[0] !== 'None') {
          if (event.status === 'all-day-r') {
            if (event.selectedRepetition.length > 1 || (event.selectedRepetition[0] !== 'Yearly' && event.selectedRepetition[0] !== 'Monthly')) {
              return this.weekly(event);
            } else {
              return {
                title: event.name,
                rrule: {
                  freq: event.selectedRepetition[0].toLocaleLowerCase(),
                  dtstart: event.startDate,
                  until: event.endDate,
                  //until: this.stopRepeatingEvent(event.endDate),
                  // interval: 1,
                  // dtstart: '2022-07-01T10:30:00',
                  // until: '2022-08-01'
                },
                allDay: true,
                color: event.group.color,
              };
            }
          } else if (event.status === 'many-all-day-r') {
            return {
              title: event.name,
              start: event.startDate,
              end: event.endDate,
              description: event.description,
              color: event.group.color,
            };
          } else {
            //  //  //  //  if classic r
            if (event.selectedRepetition.length > 1 || (event.selectedRepetition[0] !== 'Yearly' && event.selectedRepetition[0] !== 'Monthly')) {
              return this.weekly(event);
            } else {
              return {
                title: event.name,
                rrule: {
                  freq: event.selectedRepetition[0].toLocaleLowerCase(),
                  dtstart: event.startDate,
                  // until: this.stopRepeatingEvent(event.endDate),
                  // interval: 1,
                  // dtstart: '2022-07-01T10:30:00',
                  // until: '2022-10-01'
                  // until: event.toDate
                  until: event.endDate
                },
                //allDay: true,
                color: event.group.color,
              };
            }
          }
        }
        if (event.status === 'all-day') {
          //console.log(event.name);
          return {
            title: event.name,
            // title: event.name + '💛' + event.status,
            start: event.startDate,
            end: event.endDate,
            description: event.description,
            allDay: true,
            color: event.group.color,
            //textColor: 'red'
          };
        }
        return {
          title: event.name,
          start: event.startDate,
          end: event.endDate,
          description: event.description,
          color: event.group.color,
        };
      });
    });
  }

  //  REPETITION

  //  WEEKLY
  weekly(event: Event) {
    if (event.status === 'all-day-r' && event.selectedRepetition.length === 7) {
      return {
        title: event.name,
        rrule: {
          freq: 'daily',
          dtstart: event.startDate,
          until: event.endDate
          // interval: 20
        },
        allDay: true,
        color: event.group.color,
      };
    } else if (
      event.status === 'all-day-r' &&
      event.selectedRepetition.length < 7
    ) {
      return {
        groupId: 'classic-r',
        daysOfWeek: event.selectedRepetition,
        title: event.name,
        // startTime: event.startTime,
        // endTime: event.endTime,
        startRecur: event.fromDate,
        endRecur: event.toDate,
        allDay: true,
        description: event.description,
        color: event.group.color,
      };
    }
    return {
      groupId: 'classic-r',
      daysOfWeek: event.selectedRepetition,
      title: event.name,
      startTime: event.startTime,
      endTime: event.endTime,
      startRecur: event.fromDate,
      endRecur: event.toDate,
      description: event.description,
      color: event.group.color,
    };
  }

  stopRepeatingEvent(endDate: Date) {
    return endDate;
  }
}
