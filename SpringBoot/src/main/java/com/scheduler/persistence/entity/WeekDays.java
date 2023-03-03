package com.scheduler.persistence.entity;

import java.util.stream.Stream;

public enum WeekDays {
    Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday;

    public static Stream<WeekDays> stream() {
        return Stream.of(WeekDays.values());
    }
}