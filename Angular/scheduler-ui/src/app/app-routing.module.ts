import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalendarHomeComponent } from './views/calendar-home/calendar-home.component';
import { DiaryEditComponent } from './views/diary-edit/diary-edit.component';
import { DiaryViewComponent } from './views/diary-view/diary-view.component';
import { DisplayDiariesComponent } from './views/display-diaries/display-diaries.component';
import { EventEditFormComponent } from './views/event-edit-form/event-edit-form.component';
import { EventFormComponent } from './views/event-form/event-form.component';
import EventListComponent from './views/event-list/event-list.component';
import { LogRegComponent } from './views/log-reg/log-reg.component';
import { LoginComponent } from './views/login/login.component';
import { MainPageComponent } from './views/main-page/main-page.component';
import { RegisterComponent } from './views/register/register.component';
import { ToDoFormComponent } from './views/to-do-form/to-do-form.component';
import { ToDoComponent } from './views/to-do/to-do.component';
const routes: Routes = [

  { path: '', component: LogRegComponent},
  /* { path: 'home/:receivedValue', component: MainPageComponent}, */
  { path: 'home', component: MainPageComponent},
  { path: 'calendar', component: CalendarHomeComponent},
  { path: 'my-diary', component: DiaryViewComponent},
  { path: 'diaries', component: DisplayDiariesComponent},
  { path: 'my-diary/:id', component: DiaryEditComponent},
  { path: 'list', component: EventListComponent},
  { path: 'addevent', component: EventFormComponent},
  { path: 'event/:id', component: EventEditFormComponent},
  { path: 'todo', component: ToDoComponent},
  { path: 'todo-form/:id', component: ToDoFormComponent},
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
