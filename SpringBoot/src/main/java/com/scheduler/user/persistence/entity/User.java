package com.scheduler.user.persistence.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.mongodb.core.index.Indexed;

import java.io.Serializable;
import java.util.Date;
@Getter @Setter
@NoArgsConstructor
public class User implements Serializable {
    //private static final long serialVersionUID = 65981149772133526L;

    private String id;
    private String providerUserId;
    @Indexed(unique = true)
    private String email;
    private boolean enabled;
    private String displayName;
    protected Date createdDate;
    protected Date modifiedDate;
    private String password;
    private String provider;
    @JsonIgnore
    private String role;
    private String themePreference;

//    private Set<Role> roles;
}
