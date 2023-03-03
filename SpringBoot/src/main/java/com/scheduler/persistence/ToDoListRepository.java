package com.scheduler.persistence;

import com.scheduler.persistence.entity.CheckList;
import com.scheduler.user.persistence.entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.awt.print.Pageable;
import java.util.List;

@Repository
public interface ToDoListRepository extends MongoRepository<CheckList, String> {

    List<CheckList> findAllByUser_Email(String user);
    List<CheckList> findAllByUser_Email(String user, Pageable pageable);
    List<CheckList> findAllByUser(User user);

    CheckList findByIdAndUser_Email(String id, String user);


}
