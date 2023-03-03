package com.scheduler.user.model;


public record JwtAuthenticationResponse(String accessToken, UserInfo user) {
}
