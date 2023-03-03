package com.scheduler.service.model;

import com.scheduler.persistence.entity.Repetition;
import com.scheduler.persistence.entity.WeekDays;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;

@Getter @Setter
public class EventDto {
    private String id;
    private String name;
    private String description;
    private String startTime;
    private String endTime;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String fromDate;
    private String toDate;
    private Repetition repetition;
    private ArrayList<String> selectedRepetition;
    private ArrayList<WeekDays> weekDays;
    private GroupDto group;
    private String status;

    public void setPickedRepetition(String value){
        if(this.selectedRepetition == null){
            this.selectedRepetition = new ArrayList<>();
        }
        this.selectedRepetition.add(value);
    }
}
