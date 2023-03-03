package com.scheduler.user.model;

import lombok.Value;

public record ApiResponse(Boolean success, String message) {
}
