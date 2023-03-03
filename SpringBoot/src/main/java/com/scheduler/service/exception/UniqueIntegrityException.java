package com.scheduler.service.exception;

public record UniqueIntegrityException(Integer responseCode, String responsePhrase, String description) { }
