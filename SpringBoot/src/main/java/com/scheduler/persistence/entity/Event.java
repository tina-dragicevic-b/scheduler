package com.scheduler.persistence.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;

@Data
@Document
public class Event {
    @Id
    private String id;
    //    private UUID id;
    //@Indexed(unique = true)
    private String name;
    private String description;
    //private LocalTime fromHour;     // hours are not mandatory e.g. someone's birthday is an entire day VS someone's b party from 17 to 20:30
    //private LocalTime toHour;
    private String startTime;
    private String endTime;
    //    private ArrayList<Integer> weekDays;
    private ArrayList<WeekDays> weekDays;   // caution!! if repetition set to Daily but also set to e.g. Wednesday, popup window; ask user or tweak
    /// also allow events that e.g. last for 3 days in a row or two weeks and happen every year ( spring break, Christmas holidays )
    // to znaci da odabir dana nije nuzan. tj mogucnost odabira datuma "od do" uz ponavljanje mjesecno / godisnje...
    //private LocalDate fromDate;
    //private boolean repeat; // non repeating events written down after the date / time is passed ( the thing things )
//    private LocalDate repeatToDate; // default value = no repetition; show event ONLY once; ... if event repeats yearly; tweak this value somehow
    private String fromDate;
    private String toDate;
    private Repetition repetition;
    private Group group;
    private String status;
    //private User user;
    private String user;
    private boolean notify;
}

// STATUS :
// 1. Repetition:
//      1.1 date ( from to) # if date 'to' not defined; default date = +1 day; many all day events // many-all-day-r
//      1.2 date + hour #if 'to' hour not defines; default hour += 1 hour //classic-r
// 2. No Repetition:
//      2.1 date (same as 1.1) == all day event
//      2.1 date + hour (same as 1.2)
//          2.1.1 ako je korisnik normalan, i unese end date idući dan; ovo je tada normalan single time event
//          2.1.2 ako korisnik unese NO REPETITION, ali end date za 10 dana, to je tada long all day even, many days event;
