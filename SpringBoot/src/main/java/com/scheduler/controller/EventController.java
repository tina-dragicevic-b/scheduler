package com.scheduler.controller;

import com.scheduler.persistence.EventRepository;
import com.scheduler.persistence.entity.Event;
import com.scheduler.service.EventService;
import com.scheduler.service.model.EventDto;
import com.scheduler.service.model.GroupDto;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
// alt shift 7 (ovaj gore, ne desni 7) pokazuje sve reference na bilo sta

@RestController
@RequestMapping("/api/scheduler")
@AllArgsConstructor
public class EventController {
    private final EventService eventService;

    private final EventRepository eventRepository;
    @CrossOrigin(origins = "http://localhost:4200")
    @PostMapping()
    public ResponseEntity<Object> createEvent(@RequestParam(defaultValue = "", required = true) String token, @RequestBody EventDto event){

        eventService.save(event, token);
        return new ResponseEntity<>(eventService.findAll(token), HttpStatus.OK);
    }
    @GetMapping
    public ResponseEntity<List<EventDto>> getAllEvents(@RequestParam(defaultValue = "", required = true) String token){
        return new ResponseEntity<>(eventService.findAll(token), HttpStatus.OK);
    }

    @CrossOrigin(origins = "http://localhost:4200")
    @DeleteMapping(value = "/{id}")
    public ResponseEntity<Object> deleteEvent(@PathVariable(required = true) String id, @RequestParam(required = true) String token){

        return new ResponseEntity<>(eventService.delete(id, token), HttpStatus.OK);
    }

    @CrossOrigin(origins = "http://localhost:4200")
    @GetMapping(value = "event/{id}")
    public ResponseEntity<Object> getEventById(@PathVariable(required = true) String id, @RequestParam(required = true) String token){

        return new ResponseEntity<>(eventService.getEventById(id, token), HttpStatus.OK);
    }

    @CrossOrigin(origins = "http://localhost:4200")
    @PatchMapping(value = "event/update")
    public ResponseEntity<Object> updateEvent(@RequestBody EventDto event, @RequestParam(required = true) String token){
        return new ResponseEntity<>(eventService.updateEvent(event, token), HttpStatus.OK);
    }

    /*  GROUP   */
    @CrossOrigin(origins = "http://localhost:4200")
    @PostMapping("/group")
    public ResponseEntity<List<GroupDto>> createGroup(@RequestParam(defaultValue = "", required = true) String token, @RequestBody GroupDto dto){
        return new ResponseEntity<>(eventService.saveGroup(dto, token), HttpStatus.OK);
    }

    @GetMapping("/group")
    public ResponseEntity<List<GroupDto>> getAllGroups(@RequestParam(defaultValue = "", required = true) String token){
        return new ResponseEntity<>(eventService.findAllGroups(token), HttpStatus.OK);
    }

    @CrossOrigin(origins = "http://localhost:4200")
    @DeleteMapping(value = "/group/{name}")
    public ResponseEntity<Object> deleteGroup(@PathVariable(required = true) String name, @RequestParam(required = true) String token){

        return new ResponseEntity<>(eventService.deleteGroup(name, token), HttpStatus.OK);

    }

    @GetMapping("/overlap")
    public ResponseEntity<Object> get(@RequestParam(required = true) String user){

        return new ResponseEntity<>(eventService.overlap(user), HttpStatus.OK);

    }

}
