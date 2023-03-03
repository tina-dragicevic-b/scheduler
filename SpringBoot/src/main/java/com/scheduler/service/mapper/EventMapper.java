package com.scheduler.service.mapper;

import com.scheduler.persistence.entity.Event;
import com.scheduler.service.model.EventDto;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper
public interface EventMapper {
    Event eventDtoToEvent(EventDto eventDto);
    EventDto eventToEventDto(Event event);
    List<EventDto> eventsToEventDto(List<Event> events);
}
