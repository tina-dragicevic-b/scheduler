package com.scheduler.persistence.entity;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter @Setter
public class Diary {
    private String id;
    private String user;
    private LocalDateTime dateTimeGenerated;
    private LocalDateTime dateTimeModified;
    private String text;
}
