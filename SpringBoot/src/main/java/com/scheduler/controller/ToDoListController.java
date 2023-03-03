package com.scheduler.controller;

import com.scheduler.service.ToDoListService;
import com.scheduler.service.model.ToDoListDto;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/scheduler/todo")
@AllArgsConstructor
public class ToDoListController {
    private final ToDoListService toDoListService;

    @CrossOrigin(origins = "http://localhost:4200")
    @GetMapping("/todos")

    public ResponseEntity<Object> findAll(@RequestParam String token){
        return new ResponseEntity<>(toDoListService.findAll(token), HttpStatus.OK);
    }

    @PostMapping

    public ResponseEntity<Object> create(@RequestBody ToDoListDto dto, @RequestParam String token){
        System.out.println(dto.getItems());

        toDoListService.create(dto, token);

        return findAll(token);
    }

//    @PatchMapping("/{id}")
//
//    public ResponseEntity<Object> update(@PathVariable(required = true) String id, @RequestBody ToDoListDto dto, @RequestParam String token){
//
//        return findAll(token);
//    }

    @DeleteMapping("/{id}")

    public ResponseEntity<?> delete(@PathVariable(required = true) String id){
        toDoListService.deleteList(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/{id}")

    public ResponseEntity<Object> getById(@PathVariable(required = true) String id, @RequestParam String token){

//        var list = toDoListService.findListById(id, token);
//        var a = list.getItems();
//        a.forEach( (x,c) -> System.out.println(x + " " + c));
        return new ResponseEntity<>(toDoListService.findListById(token, id), HttpStatus.OK);
//        return new ResponseEntity<>(list, HttpStatus.OK);
    }
}
