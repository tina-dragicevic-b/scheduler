package com.scheduler.service;

import com.scheduler.persistence.DiaryRepository;
import com.scheduler.persistence.entity.Diary;
import com.scheduler.service.mapper.DiaryMapper;
import com.scheduler.service.model.DiaryDto;
import com.scheduler.user.persistence.repository.UserRepository;
import com.scheduler.user.security.jwt.TokenProvider;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@AllArgsConstructor
@Getter
public class DiaryServiceImpl implements DiaryService {
    private final DiaryRepository diaryRepository;
    private final TokenProvider tokenProvider;
    private final UserRepository userRepository;
    private static final DiaryMapper DIARY_MAPPER = Mappers.getMapper(DiaryMapper.class);


    @Override
    public List<DiaryDto> allUserDiaries(String token) {
        return DIARY_MAPPER.entitiesToDto(diaryRepository.findDiariesByUser(tokenProvider.getUserEmailFromToken(token)));
    }

    @Override
    public List<DiaryDto> saveDiary(String token, DiaryDto dto) {
//        var user = userRepository.findByEmail(currentUser);
        if(dto.getText() == null){
            return allUserDiaries(token);
        }
        dto.setUser(tokenProvider.getUserEmailFromToken(token));
        dto.setDateTimeGenerated(LocalDateTime.now());
        diaryRepository.save(DIARY_MAPPER.dtoToEntity(dto));
        return allUserDiaries(token);
    }

    @Override
    public List<DiaryDto> deleteDiary(String diaryId, String user) {
        var currentUser = tokenProvider.getUserEmailFromToken(user);
//        var diary = diaryRepository.findDiaryByUserAndId(diaryId, user);
        var diary = diaryRepository.findDiaryById(diaryId);
        if (diary != null && diary.getUser().equals(currentUser)) {
            diaryRepository.delete(diary);
        } else {
            System.out.println("Diary not found. ");
        }
        return allUserDiaries(user);
    }

    @Override
    public List<DiaryDto> updateDiary(DiaryDto dto, String user) {
        if(dto.getText() == null){
            return allUserDiaries(user);
        }
        dto.setDateTimeModified(LocalDateTime.now());
        diaryRepository.save(DIARY_MAPPER.dtoToEntity(dto));
        return allUserDiaries(user);
    }

    @Override
    public DiaryDto getDiaryById(String diaryId, String user) {
        if(user == null){
            return null;
        }
        var currentUser = tokenProvider.getUserEmailFromToken(user);
        var diary = diaryRepository.findDiaryById(diaryId);
        if (diary != null && diary.getUser().equals(currentUser)) {
            return DIARY_MAPPER.entityToDto(diary);
        }
        return null;
    }
}
