import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UrlAndMedia } from 'src/app/models/url-and-media/url-and-media';
import { UserDto } from 'src/app/models/user-dto/user-dto';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api/scheduler';
  constructor(private http: HttpClient) {}

  getCurrentUser(): Observable<any> {
    console.log('http opt ' + httpOptions.headers.keys());
    return this.http.get(UrlAndMedia.API_URL + 'user/me', httpOptions);
  }

  async getUser(user: string):  Promise<Observable<UserDto>> {
    return this.http.get<UserDto>('http://localhost:8080/api/auth/current', { params: { token: user }})
  }

  saveUserPreference(user: string, preference: string){
    return this.http.post('http://localhost:8080/api/auth/theme', preference, { params: { token: user }})
  }
}
