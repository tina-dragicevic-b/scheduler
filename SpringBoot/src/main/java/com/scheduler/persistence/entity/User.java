package com.scheduler.persistence.entity;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.mongodb.core.index.Indexed;

import java.util.ArrayList;
import java.util.UUID;

//@Data
@Getter @Setter
public class User {
    private String id;
    private String firstName;
    private String LastName;
    //@Indexed(unique = true)
    private String email;
    private String password;
    private ArrayList<String> preferences;
    // private Date dateOfBirth;
}
