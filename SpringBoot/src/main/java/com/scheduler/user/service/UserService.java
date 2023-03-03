package com.scheduler.user.service;

import com.scheduler.user.exception.UserAlreadyExistAuthenticationException;
import com.scheduler.user.model.LocalUser;
import com.scheduler.user.model.SignUpRequest;
import com.scheduler.user.persistence.entity.User;
import org.springframework.security.oauth2.core.oidc.OidcIdToken;
import org.springframework.security.oauth2.core.oidc.OidcUserInfo;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;
public interface UserService {
    public User registerNewUser(SignUpRequest signUpRequest) throws UserAlreadyExistAuthenticationException;

    User findUserByEmail(String email);

    Optional<User> findUserById(String id);

    LocalUser processUserRegistration(String registrationId, Map<String, Object> attributes, OidcIdToken idToken, OidcUserInfo userInfo);

    void saveUserPreference(String toke, String preference);
}
