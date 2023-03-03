package com.scheduler.persistence;

import com.scheduler.persistence.entity.Group;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface GroupRepository extends MongoRepository<Group, String> {
    List<Group> findGroupsByUser(String username);
    Group getGroupByName(String name);
    Group getGroupByNameAndUser(String name, String user);
}
