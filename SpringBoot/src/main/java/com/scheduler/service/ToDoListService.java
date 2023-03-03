package com.scheduler.service;

import com.scheduler.service.model.ToDoListDto;
import com.scheduler.user.persistence.entity.User;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface ToDoListService {
    void create(ToDoListDto dto, String user);

//    List<ToDoListDto> findAll(User user);
    List<ToDoListDto> findAll(String  user);

    ToDoListDto findListById(String user, String id);

    void addItem(String item);

    void deleteItem(String item);

    void deleteList(String id);
}
