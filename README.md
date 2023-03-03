## Personal scheduler web application

The application is created using **Spring Boot** Java framework for backend and **Angular** TypeScript for frontend realization.

---

Main features of app are: 
* [Calendar](#calendar)
* Personal Diary
* To-Do List

---

#### Calendar

This featrue is created by implementing FullCalendar tool into the project. Specifications of the feature built around the tool to create usable intuitive calendar for scheduling real life events.

After user creates an event, based on data they provided, an algorithm determins specific type of the event:
*  **Single time event**
    * Simple STE
    * All-day event
    * Long event
    
*  **Recurring event**
    * Simple RE
    * All-day RE

One of the main abilities of this component is checking for possible event overlaps.
