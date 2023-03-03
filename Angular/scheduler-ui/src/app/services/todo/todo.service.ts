import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Todo } from 'src/app/models/todo/todo';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  private todoUrl: string = 'http://localhost:8080/api/scheduler/todo'
  constructor(private http: HttpClient) { }

  public save(todo: Todo, user: string){
    return this.http.post(this.todoUrl, todo, {
      params: { token: user }
    })
  }

  public get(user: string){
    console.log("Tu sam servis")

    return this.http.get<Todo[]>(this.todoUrl + '/todos', {
      params: { token: user }
    })
  }

  public getById(id: string, user: string) {
    return this.http.get<Todo>(this.todoUrl + '/' + id, { params: { token: user }})
  }


  public deleteList(id: string) {
    return this.http.delete<Todo>(this.todoUrl + '/' + id)
  }
}
