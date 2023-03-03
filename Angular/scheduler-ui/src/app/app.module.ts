import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FullCalendarModule } from '@fullcalendar/angular'; // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
import interactionPlugin from '@fullcalendar/interaction'; // a plugin!
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EventComponent } from './components/event/event.component';
import { EventFormComponent } from './views/event-form/event-form.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import {TabMenuModule} from 'primeng/tabmenu';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {CalendarModule} from 'primeng/calendar';

import {DropdownModule} from 'primeng/dropdown';
import { TreeSelectModule } from 'primeng/treeselect';
import {InputTextModule} from 'primeng/inputtext';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import {TableModule} from 'primeng/table';
import {InputMaskModule} from 'primeng/inputmask';

import {ButtonModule} from 'primeng/button';
import { CalendarHomeComponent } from './views/calendar-home/calendar-home.component';
import { MainPageComponent } from './views/main-page/main-page.component';
import EventListComponent from './views/event-list/event-list.component';
import { LoginComponent } from './views/login/login.component';
import { RegisterComponent } from './views/register/register.component';
import { LogoutComponent } from './components/logout/logout.component';
import { LogRegComponent } from './views/log-reg/log-reg.component';
import { AuthInterceptor } from './services/interceptor/auth.interceptor';
import { GroupDialogComponent } from './components/group-dialog/group-dialog.component';
import { MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button'
import { MatInputModule,  } from '@angular/material/input';
import {MatDialogModule} from '@angular/material/dialog';
import { IconPickerModule } from 'ngx-icon-picker';
import {ColorPickerModule} from 'primeng/colorpicker';
//
import {EditorModule} from 'primeng/editor';
import { DiaryViewComponent } from './views/diary-view/diary-view.component';
import { DisplayDiariesComponent } from './views/display-diaries/display-diaries.component';
import {AccordionModule} from 'primeng/accordion';
import { DiaryHeaderComponent } from './components/diary-header/diary-header.component';
//
import {ConfirmationService, MessageService} from 'primeng/api';
import {ConfirmPopupModule} from 'primeng/confirmpopup';
import { DiaryEditComponent } from './views/diary-edit/diary-edit.component';
import { EventEditFormComponent } from './views/event-edit-form/event-edit-form.component';
import { ToDoComponent } from './views/to-do/to-do.component';
//
import {MatPaginatorModule} from '@angular/material/paginator';
import {PaginatorModule} from 'primeng/paginator';
import { ToDoFormComponent } from './views/to-do-form/to-do-form.component';

 FullCalendarModule.registerPlugins([ // register FullCalendar plugins
      dayGridPlugin,
      interactionPlugin
    ]);

@NgModule({
  declarations: [
    AppComponent,
    EventComponent,
    EventFormComponent,
    NavbarComponent,
    CalendarHomeComponent,
    MainPageComponent,
    EventListComponent,
    LoginComponent,
    RegisterComponent,
    LogoutComponent,
    LogRegComponent,
    GroupDialogComponent,
    DiaryViewComponent,
    DisplayDiariesComponent,
    DiaryHeaderComponent,
    DiaryEditComponent,
    EventEditFormComponent,
    ToDoComponent,
    ToDoFormComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FullCalendarModule,
    TabMenuModule,
    BrowserAnimationsModule,ButtonModule,
    FormsModule, ReactiveFormsModule,
    CalendarModule, DropdownModule, InputTextModule, TreeSelectModule,
    PickerModule, TableModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    /* MatRippleModule, */
    MatDialogModule,
    IconPickerModule,
    ColorPickerModule,
    EditorModule, AccordionModule,
    ConfirmPopupModule, InputMaskModule,
    MatPaginatorModule, PaginatorModule
  ],
  providers: [
    {
      provide : HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi   : true,
    },ConfirmationService, MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
