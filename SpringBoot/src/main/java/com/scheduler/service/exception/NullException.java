package com.scheduler.service.exception;

public record NullException(Integer responseCode, String responsePhrase, String description) { }
