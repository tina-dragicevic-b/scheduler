package com.scheduler.user.model;

import lombok.Data;
import lombok.Setter;

import javax.validation.constraints.NotBlank;
@Data
@Setter
public class LoginRequest {
    @NotBlank
    private String email;

    @NotBlank
    private String password;
}
