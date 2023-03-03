package com.scheduler.persistence.entity;

import lombok.Data;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Data
public class CheckList {
    private String id;
    @Indexed(unique = true)
    private String name;
    private com.scheduler.user.persistence.entity.User user;
    private LocalDateTime dateTimeGenerated;
    private Map<String, Boolean> items;
}
