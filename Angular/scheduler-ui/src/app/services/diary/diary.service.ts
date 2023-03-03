import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Diary } from 'src/app/models/diary/diary';

@Injectable({
  providedIn: 'root'
})
export class DiaryService {
  private diaryUrl: string = 'http://localhost:8080/api/scheduler/diary';

  constructor(private http: HttpClient) { }

  public findAll(token: string): Observable<Diary[]> {
    console.log(token)
    return this.http.get<Diary[]>(this.diaryUrl, { params: {

      token: token

    }});
  }

  public save(diary: Diary, token: string) {

    return this.http.post<Diary>(this.diaryUrl, diary, { params: {

      token: token

    }});
  }

  public delete(id: string, token: string){
    return this.http.delete<Diary[]>(this.diaryUrl + '/' + id, {params: {token: token}})
  }

  public getById(id: string, token: string){
    return this.http.get<Diary>(this.diaryUrl + '/' + id, {params: {token: token}})
  }

  public update(id: string, token: string, diary: Diary){
    return this.http.put<Diary>(this.diaryUrl + '/' + id, diary, {params: {token: token}})
  }
}
