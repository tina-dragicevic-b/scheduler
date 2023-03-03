package com.scheduler.service;

import com.scheduler.persistence.entity.Diary;
import com.scheduler.service.model.DiaryDto;

import java.util.List;

public interface DiaryService {
    List<DiaryDto> allUserDiaries(String user);

    List<DiaryDto> saveDiary(String user, DiaryDto dto);

    List<DiaryDto> deleteDiary(String diaryId, String user);

    List<DiaryDto> updateDiary(DiaryDto dto, String user);

    DiaryDto getDiaryById(String diaryId, String user);

}
