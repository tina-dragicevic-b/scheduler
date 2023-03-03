package com.scheduler.service.mapper;

import com.scheduler.persistence.entity.Group;
import com.scheduler.service.model.GroupDto;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper
public interface GroupMapper {
    Group groupDtoToGroup(GroupDto dto);

    List<GroupDto> groupsToDtoList(List<Group> groups);
}
