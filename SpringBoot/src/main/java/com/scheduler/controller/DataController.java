package com.scheduler.controller;

import com.scheduler.user.security.jwt.TokenProvider;
import com.scheduler.user.service.UserMapper;
import com.scheduler.user.service.UserService;
import lombok.AllArgsConstructor;
import org.mapstruct.factory.Mappers;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@AllArgsConstructor
public class DataController {

    private final UserService userService;

    private final TokenProvider tokenProvider;

    private final UserMapper USER_MAPPER = Mappers.getMapper(UserMapper.class);


    @GetMapping("/current")
    public ResponseEntity<?> getUser(String token) {

        assert token != null;
        var user = tokenProvider.getUserEmailFromToken(token);

        assert user != null;
//        System.out.println(user);
//        System.out.println(userService.findUserByEmail(user).getDisplayName());
        return new ResponseEntity<>(USER_MAPPER.entityToDto(userService.findUserByEmail(user)), HttpStatus.OK);
    }

    @PostMapping("/theme")
    public ResponseEntity<Object> saveUserPreference(String token, @RequestBody String preference){
        userService.saveUserPreference(token, preference);
        System.out.println(preference);
        return new ResponseEntity<>(null, HttpStatus.OK);
    }
}
