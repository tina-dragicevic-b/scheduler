import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Todo } from 'src/app/models/todo/todo';
import { ThemeService } from 'src/app/services/theme-service/theme.service';
import { TodoService } from 'src/app/services/todo/todo.service';
import { TokenStorageService } from 'src/app/services/token-storage/token-storage.service';

@Component({
  selector: 'app-to-do',
  templateUrl: './to-do.component.html',
  styleUrls: ['./to-do.component.sass']
})
export class ToDoComponent implements OnInit {
  token1!: string;
  token2!: string;
  token!: string;

  todos: Todo[] = [];
  pagedTodos: Todo[] = [];

  constructor(
    private tokenStorage: TokenStorageService,
    private route: ActivatedRoute,
    private themeService: ThemeService,
    private router: Router, private todoService: TodoService) { }

  ngOnInit(): void {

    this.token1 = String(this.tokenStorage.getToken());
    this.token2 = this.route.snapshot.queryParamMap.get('token')!;

    if (this.token1 === null || this.token1 === 'null') {
      this.token = this.token2;
    } else {
      this.token = this.token1;
    }
    this.themeService.userTheme(this.token)

    this.todoService.get(this.token).subscribe( (response) => {
      var i = 0
      response.forEach( (e) => { 
        if(i < 5){
          this.pagedTodos.push(e)
        }i++
        this.todos.push(e)})
    })
    //this.pagedTodos = this.todos;
    console.log("pagedTodos ", this.pagedTodos)
  }
  back(): void {
    // this.location.back()
    this.router.navigate(['../home'], { queryParams: { token: this.token}}).then(() => {
      //window.location.reload();
    });
  }
  addNewToDoList(): void {
    // this.location.back()
    this.router.navigate(['../todo-form/0'], { queryParams: { token: this.token}});
  }

  paginate(event: any) {
    this.pagedTodos = this.todos.slice(event.first, event.first+event.rows);
 }

}
