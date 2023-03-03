import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Event } from '../models/event';
import { Observable } from 'rxjs';
import { Group } from '../models/group/group';
import { UserDto } from '../models/user-dto/user-dto';

@Injectable({
  providedIn: 'root',
})
export class EventServiceService {
  private eventsUrl: string = 'http://localhost:8080/api/scheduler';
  userDto: UserDto = new UserDto();

  constructor(private http: HttpClient) {}

  public saveTolkein(token: UserDto) {
    return this.http.post<Event>(this.eventsUrl + '/tok', token);
  }
  //  END TOKEN

  public findAll(token: string): Observable<Event[]> {
    return this.http.get<Event[]>(this.eventsUrl, {
      params: {
        token: token,
      },
    });
  }

  public save(event: Event, token: string) {
    return this.http.post<Event>(this.eventsUrl, event, {
      params: {
        token: token,
      },
    });
  }

  public delete(id: string, token: string) {
    return this.http.delete<Event[]>(this.eventsUrl + '/' + id, {
      params: { token: token },
    });
  }


  public getEventById(id: string, token: string) {
    return this.http.get<Event>(this.eventsUrl + '/event/' + id, {
      params: { token: token },
    });
  }

  public updateEvent(event: Event, token: string) {
    return this.http.patch<Event[]>(this.eventsUrl + '/event/update', event, { params: { token: token }})
  }

  public async getOverlaps(token: string) {
    return await this.http.get<Event[]>(this.eventsUrl + '/overlap', { params: { user: token }});
  }
  // GROUP
  public getGroups(token: string) {
    return this.http.get<Group[]>(this.eventsUrl + '/group', {
      params: { token: token },
    });
  }

  public createGroup(group: Group, token: string) {
    return this.http.post<Group[]>(this.eventsUrl + '/group', group, {
      params: { token: token },
    });
  }

  public deleteGroup(name: string, token: string) {
    return this.http.delete<Group[]>(this.eventsUrl + '/group/' + name, {
      params: { token: token },
    });
  }
}
