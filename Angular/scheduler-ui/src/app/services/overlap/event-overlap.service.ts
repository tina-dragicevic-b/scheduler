import { Injectable } from '@angular/core';
import { Repetition } from 'src/app/models/enum/repetition';
import { Weekdays } from 'src/app/models/enum/weekdays';
import { Event } from 'src/app/models/event';
import { EventServiceService } from '../event-service.service';
@Injectable({
  providedIn: 'root',
})
export class EventOverlapService {
  userEvents: Event[] = [];
  constructor(private eventService: EventServiceService) {
  }

  async getEvents(token: string): Promise<Event[]> {
    (await this.eventService
      .getOverlaps(token))
      .subscribe((response) => (this.userEvents = response));
    return this.userEvents;
  }

  //Mon Jul 18 2022 00:00:00 GMT+0200 (Central European Summer Time)
  convertDateTime(dateComponents: string, timeComponents: string): Date {
    // const [dateComponents, timeComponents] = date.split(' ');


    timeComponents = timeComponents + ':00';
    const [year, month, day] = dateComponents.split('-');
    const [hours, minutes, seconds] = timeComponents.split(':');

    const newDate = new Date(
      +year,
      +month - 1,
      +day,
      +hours,
      +minutes,
      +seconds
    );

    return newDate;
  }

  convertDate(dateComponents: string): Date {
    const [year, month, day] = dateComponents.split('-');
    return new Date(+year, +month - 1, +day);
  }

  noRepetitionEventOverlap(
    existing: Event,
    existingStartDate: Date,
    existingEndDate: Date,
    newEvent: Event,
    overlapingWith: Set<Event>
  ) {
    var newEventStartDate = newEvent.startDate;
    var newEventEndDate = newEvent.endDate
    if (
      (newEventStartDate <= existingStartDate &&
        newEventEndDate >= existingStartDate) ||
      (newEventStartDate >= existingStartDate && newEventStartDate <= existingEndDate &&
        newEventEndDate >= existingEndDate) ||
      (newEventStartDate <= existingStartDate &&
        newEventEndDate >= existingEndDate) ||
      (newEventStartDate >= existingStartDate &&
        newEventEndDate <= existingEndDate)
    ) {
      overlapingWith.add(existing);

    } else {
    }
  }

  newEventTimeStartConvert(newEvent: Event) {
    var h: string;
    var hNumber: number;
    var m: string;
    var mNumber: number;

    if (newEvent.startTime) {
      const [hour, minute] = newEvent.startTime.split(':');
      if (hour[0] === '0') {
        h = hour[1];
        hNumber = +h;
      } else {
        h = hour;
        hNumber = +h;
      }
      if (minute[0] === '0') {
        m = minute[1];
        mNumber = +m;
      } else {
        m = minute;
        mNumber = +m;
      }
    }

    newEvent.startDate.setHours(hNumber!);
    newEvent.startDate.setMinutes(mNumber!);

  }

  newEventTimeEndConvert(newEvent: Event) {
    var h: string;
    var hNumber: number;
    var m: string;
    var mNumber: number;

    if (newEvent.endTime) {
      const [hour, minute] = newEvent.endTime.split(':');
      if (hour[0] === '0') {
        h = hour[1];
        hNumber = +h;
      } else {
        h = hour;
        hNumber = +h;
      }
      if (minute[0] === '0') {
        m = minute[1];
        mNumber = +m;
      } else {
        m = minute;
        mNumber = +m;
      }
    }
    newEvent.endDate.setHours(hNumber!);
    newEvent.endDate.setMinutes(mNumber!);
  }
  // overlaps(token: string, newEvent: Event): Event {
  async overlaps(token: string, newEvent: Event, allEvents: Event[]): Promise<Set<Event>> {
    if(newEvent.startDate === null){
      newEvent.startDate = this.convertDateTime(newEvent.fromDate, newEvent.startTime!)
    } else {
      this.newEventTimeStartConvert(newEvent);
    }
    if(newEvent.endDate === null){
      if(newEvent.status === 'single-time'){
        newEvent.endDate = this.convertDateTime(newEvent.fromDate, newEvent.endTime)
      } else if(newEvent.status === 'long-event') {
        newEvent.endDate = this.convertDateTime(newEvent.toDate, newEvent.endTime)
      } else if(newEvent.status === undefined || newEvent.status === 'undefined' || newEvent.status === null) {
        //newEvent.endDate = new Date()
        newEvent.endDate = newEvent.startDate
      }
    } else {
      this.newEventTimeEndConvert(newEvent);
    }
    //newEvent.startDate = this.convertDateTime(newEvent.startDate, newEvent.startTime)
    var overlapingWith: Set<Event> = new Set();
    // var overlapingWith: Event[] = [];
    (allEvents).forEach((event) => {
      event.startDate = this.convertDateTime(event.fromDate, event.startTime!);
      if (event.status === 'long-event') {
        event.endDate = this.convertDateTime(event.toDate, event.endTime);
      } else if (event.status === 'single-time') {
        event.endDate = this.convertDateTime(event.fromDate, event.endTime);
      }

      if (event.status === 'single-time' || event.status === 'long-event') {
        this.noRepetitionEventOverlap(event, event.startDate, event.endDate, newEvent, overlapingWith);
      }
      else if(event.status === 'classic-r'){
        this.recurringEventOverlap(event, newEvent, overlapingWith);
      }
    });
    return overlapingWith;
  }

  recurringEventOverlap(event: Event, newEvent: Event, overlapingWith: Set<Event>){
    var start = this.convertDateTime(event.fromDate, event.startTime!);
    let end = this.convertDateTime(event.fromDate, event.endTime!);
    if(event.repetition === Repetition.Daily){
      //end.setDate(end.getDate() + 1)
      while(end < event.endDate){
        this.noRepetitionEventOverlap(event, start, end, newEvent, overlapingWith);
        start.setDate(start.getDate() + 1)
        end.setDate(end.getDate() + 1)
      }
    }
    if(event.repetition === Repetition.Yearly){
      //end.setFullYear(end.getFullYear() + 1)
      var finish = new Date(event.startDate)
      finish.setFullYear(finish.getFullYear() + 10)
      while(end < event.endDate || end < finish){
        this.noRepetitionEventOverlap(event, start, end, newEvent, overlapingWith);
        start.setFullYear(start.getFullYear() + 1)
        end.setFullYear(end.getFullYear() + 1)
      }
    }
    if(event.repetition === Repetition.Monthly){

      //end.setMonth(end.getMonth() + 1)
      while(end < event.endDate){
        this.noRepetitionEventOverlap(event, start, end, newEvent, overlapingWith);
        start.setMonth(start.getMonth() + 1)
        end.setMonth(end.getMonth() + 1)
      }
    }
    if(event.repetition === Repetition.Weekly){
      
      this.weeklyRepetition(event, newEvent, overlapingWith)
    }
  }

  weeklyRepetition(event: Event, newEvent: Event, overlapingWith: Set<Event>){
    // let start = new Date(event.startDate);
    let changable = new Date(this.convertDateTime(event.fromDate, event.startTime!));
    let changableEnd = new Date(this.convertDateTime(event.fromDate, event.endTime!))
    // console.log(event.weekDays)
    let index = 0
    let sequenceCounter = 0
    while(sequenceCounter < 7){
      let result = this.dateIsOnWeekday(changable, event.weekDays, index)
      sequenceCounter++
      if(result){
        break;
      } else{
      changable.setDate(changable.getDate() + 1) }
    }

    let arr: any[] = []
    event.weekDays.forEach(x => {
      arr.push(Object.values(Weekdays).indexOf(x))
    })

    let i = 0
    while(changableEnd <= event.endDate){
        arr.forEach(element => {
          if(i === 0 && element <= index){

          }
          else{
            changable.setDate(changable.getDate() + (i*7))
            changableEnd.setDate(changableEnd.getDate() + (i*7))
            this.noRepetitionEventOverlap(event, changable, changableEnd, newEvent, overlapingWith);
          }
          i++;
        })
    }
  }

  dateIsOnWeekday(date: Date, weekdays: Weekdays[], index: number): boolean{
    console.log(date)

    let counter = 0   
    weekdays.forEach( (x) => {
      let a =  Object.values(Weekdays).indexOf(x.toString())
      if(date.getDay() === a){
        counter++;
        index = a
      }
    })
    if(counter > 0){
      return true;
    }
    return false;
  }

  async newEventOverlap(newEvent: Event, allEvents: Event[]): Promise<Set<Event>>{
    var overlapingWith: Set<Event> = new Set();
    var tempEvent = this.generateTempEvent(newEvent);

    if(tempEvent.endDate === null || tempEvent.endDate === undefined || !tempEvent.endDate){
      tempEvent.endDate = tempEvent.startDate
    }
    (await allEvents).map((event) => {
      event.endDate = this.convertDateTime(event.toDate, event.endTime!);
      event.startDate = this.convertDateTime(event.fromDate, event.startTime!);

      if(event.endDate < tempEvent.startDate || event.startDate > tempEvent.endDate){
        
      } else {
      if(event.status === 'classic-r'){
        this.recurringEventOverlap(event, tempEvent, overlapingWith);
      }
      if (event.status === 'single-time' || event.status === 'long-event') {
        // if(event.status === 'single-time'){
        //   event.endDate = this.convertDateTime(event.fromDate, event.endTime!);
        // }
        this.noRepetitionEventOverlap(event, event.startDate, event.endDate, tempEvent, overlapingWith);
      } }
    });
    return overlapingWith;
  }

  generateTempEvent(newEvent: Event): Event{

    var tempEvent = new Event();
    tempEvent.description = newEvent.description
    tempEvent.endDate = newEvent.endDate
    tempEvent.endTime = newEvent.endTime
    tempEvent.fromDate = newEvent.fromDate
    tempEvent.group = newEvent.group
    tempEvent.id = newEvent.id
    tempEvent.name = newEvent.name
    tempEvent.repetition = newEvent.repetition
    tempEvent.selectedRepetition = newEvent.selectedRepetition
    tempEvent.startDate = newEvent.startDate
    tempEvent.startTime = newEvent.startTime
    tempEvent.status = newEvent.status
    tempEvent.toDate = newEvent.toDate
    tempEvent.weekDays = newEvent.weekDays

    return tempEvent;
  }
}
