package com.scheduler;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.http.HttpMethod;

@SpringBootApplication
public class Scheduler {
    public static void main(String[] args) {
//        System.out.println("\ndate time:\t" + LocalDateTime.now() + "\n");
        SpringApplication.run(Scheduler.class, args);
    }

    //@Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        return application.sources(Scheduler.class);
    }
}
