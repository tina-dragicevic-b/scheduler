package com.scheduler.service.model;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor @Getter
public class UserDto {
    private String email;
    private String themePreference;
    private String displayName;
}
