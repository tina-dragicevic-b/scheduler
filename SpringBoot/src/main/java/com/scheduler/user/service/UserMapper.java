package com.scheduler.user.service;

import com.scheduler.service.model.UserDto;
import com.scheduler.user.persistence.entity.User;
import org.mapstruct.Mapper;

@Mapper

public interface UserMapper {
    User dtoToEntity(UserDto dto);
    UserDto entityToDto(User entity);
}
