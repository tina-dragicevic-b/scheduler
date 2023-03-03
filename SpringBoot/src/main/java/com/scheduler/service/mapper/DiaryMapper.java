package com.scheduler.service.mapper;

import com.scheduler.persistence.entity.Diary;
import com.scheduler.service.model.DiaryDto;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper
public interface DiaryMapper {
    DiaryDto entityToDto(Diary diary);
    List<DiaryDto> entitiesToDto(List<Diary> diary);
    Diary dtoToEntity(DiaryDto dto);
}
