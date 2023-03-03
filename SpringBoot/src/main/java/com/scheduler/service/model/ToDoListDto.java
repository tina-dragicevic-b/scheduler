package com.scheduler.service.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Getter @Setter
@AllArgsConstructor @NoArgsConstructor
public class ToDoListDto {
    private String id;
    private String name;
    private String userEmail;
    private LocalDateTime dateTimeGenerated;
//    private HashMap<String, Boolean> items;
    private Map<String, Boolean> items;
}
