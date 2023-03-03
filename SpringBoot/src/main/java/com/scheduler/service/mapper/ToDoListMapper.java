package com.scheduler.service.mapper;

import com.scheduler.persistence.entity.CheckList;
import com.scheduler.service.model.ToDoListDto;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper
public interface ToDoListMapper {
    List<ToDoListDto> entityListToDtoList(List<CheckList> checkLists);

    List<CheckList> dtoListToEntityList(List<ToDoListDto> checkLists);

    ToDoListDto entityToDto(CheckList checkList);

    CheckList dtoToEntity(ToDoListDto dto);
}
