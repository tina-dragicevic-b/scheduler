import { KeyValue } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { Todo } from 'src/app/models/todo/todo';
import { ThemeService } from 'src/app/services/theme-service/theme.service';
import { TodoService } from 'src/app/services/todo/todo.service';
import { TokenStorageService } from 'src/app/services/token-storage/token-storage.service';
import { __values } from 'tslib';

@Component({
  selector: 'app-to-do-form',
  templateUrl: './to-do-form.component.html',
  styleUrls: ['./to-do-form.component.sass']
})
export class ToDoFormComponent implements OnInit {

  item!: string
  todo: Todo = new Todo();
  inputNameField: boolean = false
  name!: string;
  errortext! : string
  id!: string;


  token1!: string;
  token2!: string;
  token!: string;

  constructor(private todoService: TodoService,  private themeService: ThemeService, private tokenStorage: TokenStorageService, private route: ActivatedRoute, private router: Router, private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
    // this.todo.name = "tina"
    this.token1 = String(this.tokenStorage.getToken());
    this.token2 = this.route.snapshot.queryParamMap.get('token')!;

    if (this.token1 === null || this.token1 === 'null') {
      this.token = this.token2;
    } else {
      this.token = this.token1;
    }
    this.themeService.userTheme(this.token)

    this.route.params.subscribe( p => {
      this.id = p['id'];
      if(this.id !== '0'){
        console.log(this.id)
        this.todoService.getById(this.id, this.token).subscribe( response => {

          this.todo.id = response.id
          this.todo.name = response.name
          this.todo.userEmail = response.userEmail

          const entries = Object.entries(JSON.parse(JSON.stringify(response.items)))

          let obj = Object.create(Map);
          entries.map((i) => { obj[i[0]] = i[1]})
          this.todo.items = obj
        })
      }
    });
  }

  click(){
    if(this.item === undefined || this.item === 'undefined'){
      return;
    }
    var flag = 0
    // Array.from(this.todo.items).forEach( (el) => {
    //   if(el[0] === this.item){
    //     flag++
    //   }
    //   // if(_key === this.item){
    //   //   flag++
    //   // }
    // })

    const entries = Object.entries(this.todo.items)
    entries.map(e => {
      if(e[0] === this.item){
        flag++
      }
    })
    // let obj = Object.create(Map);
    // entries.map((i) => { obj[i[0]] = i[1]})
    // this.todo.items = obj

    if(flag === 0){


      const entries = Object.entries(JSON.parse(JSON.stringify(this.todo.items)))

      let obj = Object.create(Map);
      entries.push([this.item, true])
      entries.map((i) => { obj[i[0]] = i[1]})
      this.todo.items = obj

      // this.todo.items.set(this.item, true)
      this.errortext = ""
    } else { this.errortext = this.item + " is already in the list!"}
  }
  delete(deleteItem: KeyValue<string, boolean>) {
    // this.todo.items.forEach( (_value, _key) => {
    //   if(_key === deleteItem.key){
    //     this.todo.items.delete(_key)
    //   }
    // })

    const entries = Object.entries(this.todo.items)
    console.log(entries)
    console.log(deleteItem)
    let obj = Object.create(Map);

    entries.map(e => {
      if(e[0] !== deleteItem.key){
        obj[e[0]] = e[1]
      }
    })
    console.log(obj)
    // let obj = Object.create(Map);
    // entries.map((i) => { obj[i[0]] = i[1]})
    this.todo.items = obj
    console.log(this.todo.items)
  }

  check(checkItem: KeyValue<string, boolean>) {

    const entries = Object.entries(this.todo.items)

    entries.map(e => {
      if(e[0] === checkItem.key){
        e[1] = false;
      }
    })
    let obj = Object.create(Map);
    entries.map((i) => { obj[i[0]] = i[1]})
    this.todo.items = obj
    // this.todo.items.forEach( (_value, _key) => {
    //   if(_key === checkItem.key){
    //     _value = false
    //     this.todo.items.set(_key, _value)
    //   }
    //   // if(_key === checkItem.key){
    //   //   _value = false
    //   //   this.todo.items.set(_key, false)
    //   // }
    //   // console.log(_key + _value)
    // })
  }

  onInputNameField(){
    this.inputNameField = true
  }

  changeName(name: string){
    if(name !== '' || name !== undefined || name !== 'undefined'){
      var list : Todo[];
      var flag = 0;
      this.todoService.get(this.token).subscribe( res => {
        list = res
        list.forEach( el => {
          if(el.name === name){
            flag++;
            this.errortext = "List " + name + " already exists";
           this.inputNameField = true
          }
        })
      });
      if(flag === 0){
        this.errortext = ""
        this.todo.name = name
        this.inputNameField = false
      }
    }
    //this.inputNameField = false
  }
  onSubmit(){
    if(this.todo.name === '' || this.todo.name === undefined || this.todo.name === 'undefined'){
      this.todo.name = 'To Do'
    }
    //console.log("sajz " + Object.keys(this.todo.items).length)

    if(Object.keys(this.todo.items).length === 0){
      this.onDeleteEmptyList(event);
      return;
    } else {
    console.log(this.todo)
    this.todoService.save(this.todo, this.token).subscribe();
    this.router
      .navigate(['../todo'], {
        queryParams: { token: this.token },
      })
      .then(() => {
        window.location.reload();
      });
   }
  }

  mapToObj(map: Map<string, boolean>) {
    let obj = Object.create(null);
    map.forEach( (_value, _key) => {
        obj[_key] = _value
    })
    return obj;
  }

  onDeleteList(event: any) {
    this.confirmationService.confirm({
      target: event.target!,
      message: 'Are you sure that you want to delete this list?',
      icon: 'delete-warning pi pi-exclamation-triangle',
      accept: () => {
        this.todoService.deleteList(this.todo.id).subscribe();
        this.confirmationService.close();
        this.router.navigate(['../todo'], {
          queryParams: { token: this.token },
        });

      },
      reject: () => {
        this.confirmationService.close();
      },
    });
  }

  onDeleteEmptyList(event: any) {
    this.confirmationService.confirm({
      target: event.target!,
      message: 'You are trying to save an empty list. Would You like to delete it instead?',
      icon: 'delete-warning pi pi-exclamation-triangle',
      accept: () => {
        this.todoService.deleteList(this.todo.id).subscribe();
        this.confirmationService.close();
        this.router.navigate(['../todo'], {
          queryParams: { token: this.token },
        })
        .then(() => {
          window.location.reload();
        });

      },
      reject: () => {
        this.confirmationService.close();
        this.todoService.save(this.todo, this.token).subscribe();
       this.router
      .navigate(['../todo'], {
        queryParams: { token: this.token },
      })
      .then(() => {
        window.location.reload();
      });
      },
    });
  }
}
