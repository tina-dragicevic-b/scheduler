package com.scheduler.persistence;

import com.scheduler.persistence.entity.Event;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
@Repository
public interface EventRepository extends MongoRepository<Event, String> {
//    public interface EventRepository extends MongoRepository<Event, UUID> {
//    Optional findEventByName(String name);
    Event findEventByName(String name);

    Event findEventById(String id);

    List<Event> findEventByUser(String user);

    List<Event> findEventByUserAndStatus(String user, String status);
}
