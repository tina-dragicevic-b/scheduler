package com.scheduler.persistence;

import com.scheduler.persistence.entity.Diary;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface DiaryRepository extends MongoRepository<Diary, String> {
    List<Diary> findDiariesByUser(String  user);
    Diary findDiaryByUserAndId(String id, String  user);
    Diary findDiaryById(String id);

}
