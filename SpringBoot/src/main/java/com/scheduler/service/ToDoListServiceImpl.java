package com.scheduler.service;

import com.scheduler.persistence.ToDoListRepository;
import com.scheduler.service.mapper.ToDoListMapper;
import com.scheduler.service.model.ToDoListDto;
import com.scheduler.user.persistence.entity.User;
import com.scheduler.user.persistence.repository.UserRepository;
import com.scheduler.user.security.jwt.TokenProvider;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Random;

@Service
@AllArgsConstructor
@Getter
public class ToDoListServiceImpl implements ToDoListService {

    private final ToDoListRepository toDoListRepository;

    private static final ToDoListMapper TO_DO_LIST_MAPPER = Mappers.getMapper(ToDoListMapper.class);

    private TokenProvider tokenProvider;

    private final UserRepository userRepository;

    @Override
    public void create(ToDoListDto dto, String user) {
        assert user != null;
        var current = getUserFromToken(user);
//        System.out.println(current);
        if(dto.getName().equals("To Do")){
            Random randomSuffix = new Random();
            var suffix = randomSuffix.nextInt(10000, 99999);
            dto.setName("To Do#" + suffix);
        }
        var entity = TO_DO_LIST_MAPPER.dtoToEntity(dto);
        entity.setUser(current);
        toDoListRepository.save(entity);
    }

    private User getUserFromToken(String  token){
        assert token != null;
        return userRepository.findByEmail(tokenProvider.getUserEmailFromToken(token));
    }

    private String getUser(User user){
        assert user != null;
        return tokenProvider.getUserEmailFromToken(user.getEmail());
    }
    @Override
    public List<ToDoListDto> findAll(String  user) {

        return TO_DO_LIST_MAPPER.entityListToDtoList(toDoListRepository.findAllByUser_Email(getUserFromToken(user).getEmail()));
    }

    @Override
    public ToDoListDto findListById(String  user, String id) {
        assert user != null && id != null;
        return TO_DO_LIST_MAPPER.entityToDto(toDoListRepository.findByIdAndUser_Email(id, getUserFromToken(user).getEmail()));
    }

    @Override
    public void addItem(String item) {
    }

    @Override
    public void deleteItem(String item) {
    }

    @Override
    public void deleteList(String id) {
        assert id != null;
        var list = toDoListRepository.findById(id).orElseThrow();
        toDoListRepository.delete(list);
    }
}
