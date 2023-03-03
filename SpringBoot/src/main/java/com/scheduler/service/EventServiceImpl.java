package com.scheduler.service;

import com.scheduler.persistence.EventRepository;
import com.scheduler.persistence.GroupRepository;
import com.scheduler.persistence.entity.Event;
import com.scheduler.persistence.entity.Group;
import com.scheduler.persistence.entity.Repetition;
import com.scheduler.persistence.entity.WeekDays;
import com.scheduler.service.exception.NullException;
import com.scheduler.service.mapper.EventMapper;
import com.scheduler.service.mapper.GroupMapper;
import com.scheduler.service.model.EventDto;
import com.scheduler.service.model.GroupDto;
import com.scheduler.user.security.jwt.TokenProvider;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.mapstruct.factory.Mappers;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Data
@Service
@AllArgsConstructor
public class EventServiceImpl implements EventService {

    private final EventRepository eventRepository;
    private final GroupRepository groupRepository;
    private static final EventMapper MAPPER = Mappers.getMapper(EventMapper.class);
    private static final GroupMapper GROUP_MAPPER = Mappers.getMapper(GroupMapper.class);
    private final MongoTemplate mongoTemplate;
    private TokenProvider tokenProvider;

    private int getEnumOrdinal(WeekDays value){
        return WeekDays.valueOf(value.toString()).ordinal();
    }
    @Override
    public List<EventDto> findAll(String token) {
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");
        //var events = eventRepository.findAll();
        var name = tokenProvider.getUserEmailFromToken(token);
        var events = eventRepository.findEventByUser(name);
        var eventsDto = new ArrayList<EventDto>();
        events.forEach(e -> {
            var dto = MAPPER.eventToEventDto(e);
            var date = LocalDate.parse(e.getFromDate(), dateFormatter);
            var time = LocalTime.parse(e.getStartTime(), timeFormatter);
            dto.setStartDate(LocalDateTime.of(date, time));

            // SET REPETITION
            selectedRepetitionForDto(dto);
            /*if(dto.getRepetition() != null && dto.getRepetition().equals(Repetition.Weekly)){

                dto.getWeekDays().forEach(w -> dto.setPickedRepetition(String.valueOf(getEnumOrdinal(w))));

            } else if (dto.getRepetition() != null && dto.getRepetition().equals(Repetition.Daily)) {

                WeekDays.stream().forEach(w -> dto.setPickedRepetition(String.valueOf(getEnumOrdinal(w))));

            } else if (dto.getRepetition() != null) {

                dto.setPickedRepetition(dto.getRepetition().toString());
            }*/
            //  PARSE DATE-TIME ACCORDING TO TYPE
            if(dto.getStatus().equals("single-time") || dto.getStatus().equals("classic-r")){
                if(dto.getEndTime().equals("00:00")){
                    date = LocalDate.parse(e.getToDate(), dateFormatter);
                    time = LocalTime.parse(dto.getEndTime(), timeFormatter);
                }
                else if(!Objects.equals(dto.getEndTime(), "00:00")) {
                    date = LocalDate.parse(e.getFromDate(), dateFormatter);
                    time = LocalTime.parse(dto.getEndTime(), timeFormatter);
                }
                //dto.setEndDate(LocalDateTime.of(date, time));
            }
            else {
                if(e.getToDate() != null){
                    date = LocalDate.parse(e.getToDate(), dateFormatter);
                    time = LocalTime.parse(e.getEndTime(), timeFormatter);
                } else {
                    if(e.getRepetition() != Repetition.Yearly && e.getRepetition() != Repetition.None) {
                        date = LocalDate.parse(e.getFromDate(), dateFormatter).plusYears(1);
                        time = LocalTime.parse(e.getEndTime(), timeFormatter);
                    }
                }
            }
            dto.setEndDate(LocalDateTime.of(date, time));
            eventsDto.add(dto);
            if(Objects.equals(dto.getName(), "AD")){
                System.out.println(dto.getStartDate() + " " + dto.getEndDate());
            }
        });

//        var eventsDto = MAPPER.eventsToEventDto(events);
//        eventsDto.stream().forEach(e -> {
//            e.setStartDate(LocalDateTime.parse(e.getStartDate()+e.getStartTime(), formatter));
//            e.setEndDate(LocalDateTime.parse(e.getEndDate()+e.getEndTime(), formatter));
//        });
        return eventsDto;
    }

    private void selectedRepetitionForDto(EventDto dto){
        if(dto.getRepetition() != null && dto.getRepetition().equals(Repetition.Weekly)){

            dto.getWeekDays().forEach(w -> dto.setPickedRepetition(String.valueOf(getEnumOrdinal(w))));

        } else if (dto.getRepetition() != null && dto.getRepetition().equals(Repetition.Daily)) {

            WeekDays.stream().forEach(w -> dto.setPickedRepetition(String.valueOf(getEnumOrdinal(w))));

        } else if (dto.getRepetition() != null) {

            dto.setPickedRepetition(dto.getRepetition().toString());
        }
    }
    private EventDto repetitiveEvent(EventDto dto){
        if(dto.getStartDate() == null) dto.setStartDate(LocalDateTime.now().plusDays(1));
        if(dto.getEndDate() == null) {
            //dto.setEndDate(dto.getStartDate().plusDays(1));
            if(dto.getStartTime() == null) {
                dto.setStartTime("00:00");
                dto.setEndTime("00:00");
                dto.setStatus("all-day-r");
                return dto;
            }
            if(!dto.getRepetition().equals(Repetition.Yearly)){
                dto.setEndDate(dto.getStartDate().plusYears(1));
            }
        }
        if(dto.getStartTime() == null) {
            dto.setStartTime("00:00");
            dto.setEndTime("23:59");
            dto.setStatus("all-day-r");
        }
        else if(dto.getStartTime() != null && dto.getEndTime() == null){
                dto.setEndTime((parseHour(dto.getStartTime()).plusHours(1)).toString());
                dto.setStatus("classic-r");
        }
        else if (parseHour(dto.getStartTime()).isAfter(parseHour(dto.getEndTime())) ) dto.setStatus("long-event");
        else dto.setStatus("classic-r");
        return dto;
    }
    private EventDto noRepetitionEvent(EventDto dto){

        if(dto.getStartDate() == null) dto.setStartDate(LocalDateTime.now().plusDays(1));
        if(dto.getEndDate() == null || dto.getEndDate().equals(dto.getStartDate().plusDays(1))) {
            dto.setEndDate(dto.getStartDate().plusDays(1));
            if(dto.getStartTime() == null) {
                dto.setStatus("all-day");
                dto.setStartTime("00:00");
                dto.setEndTime("00:00");
                return dto;
            }
        }
        if(dto.getStartDate().equals(dto.getEndDate().minusDays(1)) && dto.getStartTime().equals("00:00") && dto.getEndTime().equals("00:00")){
            dto.setStatus("all-day");
            return dto;
        }
        //if(dto.getStartTime() == null) dto.setStartTime("00:00");
        if(dto.getEndTime() == null){
            if (dto.getStartDate().plusDays(1).equals(dto.getEndDate())) {
                dto.setEndTime((parseHour(dto.getStartTime()).plusHours(1)).toString());
                dto.setStatus("single-time");
            } else {
                dto.setEndTime("00:00");
                dto.setStatus("long-event");
            }
        }
        else if(dto.getEndTime() != null){
            if (dto.getStartDate().plusDays(1).equals(dto.getEndDate())) {
                if(parseHour(dto.getStartTime()).isAfter(parseHour(dto.getEndTime()))){
                    dto.setStatus("long-event");
                } else {  dto.setStatus("single-time"); }
            } else {
                dto.setStatus("long-event");
            }
        }
        return dto;
    }
    private EventDto defineEventType(EventDto dto){
        if(dto.getSelectedRepetition().isEmpty() || dto.getSelectedRepetition().size() == 0){
            dto.setRepetition(Repetition.None);
        }
        else {
            if(dto.getSelectedRepetition().size() > 1 ){
                dto.setRepetition(Repetition.Weekly);
                var weekDays = new ArrayList<WeekDays>();
                dto.getSelectedRepetition().forEach(a -> {
                    System.out.println(dto.getSelectedRepetition().size());
                    if(!Objects.equals(a, "Weekly")){
                        weekDays.add(WeekDays.valueOf(a));
                    }
                });
                dto.setWeekDays(weekDays);
            }
            else{
                dto.getSelectedRepetition().forEach( a -> {
                    if(!Objects.equals(a, "Daily") && !a.equals("Monthly") && !a.equals("Yearly") && !Objects.equals(a, "None")){
                        dto.setRepetition(Repetition.Weekly);
                        var weekDays = new ArrayList<WeekDays>();
//                        weekDays.add(WeekDays.valueOf(a));
                        if(!Objects.equals(a, "Weekly")){
                            weekDays.add(WeekDays.valueOf(a));
                        }
                        dto.setWeekDays(weekDays);
                    } else dto.setRepetition(Repetition.valueOf(dto.getSelectedRepetition().get(0)));

                });
//                dto.setRepetition(Repetition.valueOf(dto.getSelectedRepetition().get(0)));
            }
            /*dto.getSelectedRepetition().stream().forEach(r -> {

            });*/
        }
        return dto.getRepetition().equals(Repetition.None) ? noRepetitionEvent(dto)  : repetitiveEvent(dto);
    }

    private LocalTime parseHour(String hour){

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm");
//        var a = LocalTime.parse(hour, formatter);
//        return a;
        if(hour == null){
            hour = "00:00";
        }
        return LocalTime.parse(hour, formatter);
    }

    private void defineStartEndTimeHour(com.scheduler.persistence.entity.Event event, EventDto dto){
        event.setStartTime((parseHour(dto.getStartTime())).toString());
        event.setEndTime((parseHour(dto.getEndTime())).toString());
        event.setFromDate((dto.getStartDate().toLocalDate()).toString());
        if(dto.getEndDate() != null){
            event.setToDate((dto.getEndDate().toLocalDate()).toString());
        }
    }
    @Override
    public Object save(EventDto event, String token) {
        if (event == null)
            return new NullException(400, "Null Exception", "Received model is empty; No data to save. ");

        if(event.getStartDate() != null) event.setStartDate(event.getStartDate().plusDays(1));
        if(event.getEndDate() != null) event.setEndDate(event.getEndDate().plusDays(1));
        if(event.getStartDate().equals(event.getEndDate())) event.setEndDate(event.getEndDate().plusDays(1));
        else if(event.getEndDate() != null && event.getStartDate().isAfter(event.getEndDate())) { event.setEndDate(event.getStartDate().plusDays(1)); }

        var defined = defineEventType(event);
        var mapped = MAPPER.eventDtoToEvent(defined);
        defineStartEndTimeHour(mapped, defined);

        mapped.setUser(tokenProvider.getUserEmailFromToken(token));
        return eventRepository.save(mapped);
    }

    @Override
    public List<EventDto> delete(String id, String token) {
        eventRepository.delete(eventRepository.findEventById(id));
        return findAll(token);
    }

    @Override
    public EventDto getEventById(String id, String token) {
        var dto = MAPPER.eventToEventDto(eventRepository.findEventById(id));
        selectedRepetitionForDto(dto);
        return dto;
    }

    private void addMappedEvents(List<Event> events, List<EventDto> mapped){
        events.forEach( e -> mapped.add(MAPPER.eventToEventDto(e)));
    }
    @Override
    public List<EventDto> overlap(String user) {

        assert user != null;
        var currentUser = tokenProvider.getUserEmailFromToken(user);
        var mappedEventsByStatus = new ArrayList<EventDto>();

        var singleTime = eventRepository.findEventByUserAndStatus(currentUser, "single-time");
        var classicR = eventRepository.findEventByUserAndStatus(currentUser, "classic-r");
        var longEvent = eventRepository.findEventByUserAndStatus(currentUser, "long-event");

        addMappedEvents(singleTime, mappedEventsByStatus);
        addMappedEvents(classicR, mappedEventsByStatus);
        addMappedEvents(longEvent, mappedEventsByStatus);

        return mappedEventsByStatus;
    }

    @Override
    public Object updateEvent(EventDto event, String user) {
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");

        if(event.getStartDate() != null){
            //event.setStartDate(event.getStartDate().plusDays(1));

        } else {
            var date = LocalDate.parse(event.getFromDate(), dateFormatter);
            var time = LocalTime.parse(event.getStartTime(), timeFormatter);
            event.setStartDate(LocalDateTime.of(date, time)); }

        if( event.getEndDate() != null){
            //event.setEndDate(event.getEndDate().plusDays(1));
        } else {
            if(event.getToDate() != null) {
            var date = LocalDate.parse(event.getToDate(), dateFormatter);
            var time = LocalTime.parse(event.getEndTime(), timeFormatter);
            event.setEndDate(LocalDateTime.of(date, time)); }
        }


        if(event.getEndDate().equals(event.getStartDate())) event.setEndDate(event.getEndDate().plusDays(1));
        else if(event.getStartDate().isAfter(event.getEndDate())) { event.setEndDate(event.getStartDate().plusDays(1)); }

        var defined = defineEventType(event);
        var mapped = MAPPER.eventDtoToEvent(defined);
        defineStartEndTimeHour(mapped, defined);
        mapped.setUser(tokenProvider.getUserEmailFromToken(user));
        return eventRepository.save(mapped);
    }

    @Override
    public List<GroupDto> saveGroup(GroupDto group, String token){
        if(group.getName() == null){
            System.out.println("Group name not defined. ");
            return findAllGroups(token);
        }
        var user = tokenProvider.getUserEmailFromToken(token);
        var groupExists = groupRepository.getGroupByNameAndUser(group.getName(), user);
        if(groupExists != null){
            System.out.println("Group already exists. ");
            return findAllGroups(token);
        }
        group.setUser(user);
        if(group.getColor() == null){
            group.setColor("#7affca");
        }
        groupRepository.save(GROUP_MAPPER.groupDtoToGroup(group));
        return findAllGroups(token);
    }

    @Override
    public List<GroupDto> findAllGroups(String token) {
        var user = tokenProvider.getUserEmailFromToken(token);
        var defaultGroupNone = groupRepository.getGroupByName("None");
        var defaultGroupFreeTime = groupRepository.getGroupByName("Free Time");
        var defaultGroupGym = groupRepository.getGroupByName("Gym");
        var userGroups = groupRepository.findGroupsByUser(user);
        userGroups.add(defaultGroupNone);
        userGroups.add(defaultGroupFreeTime);
        userGroups.add(defaultGroupGym);
        userGroups.sort(Comparator.comparing(Group::getName));
        return GROUP_MAPPER.groupsToDtoList(userGroups);
    }

    @Override
    public List<GroupDto> deleteGroup(String name, String token) {
        if(name == null){
            return  findAllGroups(token);
        }
        var u = tokenProvider.getUserEmailFromToken(token);
//        var g = groupRepository.getGroupByName(name);
        var g = groupRepository.getGroupByNameAndUser(name, u);
        if(g != null && g.getUser().equals(u)){
            groupRepository.delete(g);
        }
        return findAllGroups(token);
    }
}
