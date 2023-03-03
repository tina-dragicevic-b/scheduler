package com.scheduler.service.model;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
@Getter @Setter
public class DiaryDto {

    private String id;
    private String user;
    private LocalDateTime dateTimeGenerated;
    private LocalDateTime dateTimeModified;
    private String text;
}
