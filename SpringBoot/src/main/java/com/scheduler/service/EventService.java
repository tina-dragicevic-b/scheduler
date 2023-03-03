package com.scheduler.service;

import com.scheduler.persistence.entity.Event;
import com.scheduler.persistence.entity.Group;
import com.scheduler.service.model.EventDto;
import com.scheduler.service.model.GroupDto;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public interface EventService {
    List<EventDto> findAll(String token);
    Object save(EventDto event, String user);

    List<EventDto> delete(String id, String token);

    EventDto getEventById(String id, String token);

    List<EventDto> overlap(String user);

    Object updateEvent(EventDto event, String user);

    List<GroupDto> saveGroup(GroupDto dto, String token);

    List<GroupDto> findAllGroups(String token);

    List<GroupDto> deleteGroup(String name, String token);

//    List<EventDto> allEventsByGroup();
}
