package com.scheduler.persistence.entity;

import lombok.Data;
import org.springframework.data.mongodb.core.index.Indexed;

import java.util.UUID;
@Data
public class Group {
    private String id;
    private String name;
    private String color;
    private String user;
}
