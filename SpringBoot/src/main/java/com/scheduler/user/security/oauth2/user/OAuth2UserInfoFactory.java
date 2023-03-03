package com.scheduler.user.security.oauth2.user;

import com.scheduler.user.exception.OAuth2AuthenticationProcessingException;
import com.scheduler.user.model.SocialProvider;

import java.util.Map;

public class OAuth2UserInfoFactory {
    public static OAuth2UserInfo getOAuth2UserInfo(String registrationId, Map<String, Object> attributes) {
        if (registrationId.equalsIgnoreCase(SocialProvider.GOOGLE.getProviderType())) {
            return new GoogleOAuth2UserInfo(attributes);
        }
//        else if (registrationId.equalsIgnoreCase(SocialProvider.GITHUB.getProviderType())) {
//            return new GithubOAuth2UserInfo(attributes);
//        }
        else {
            throw new OAuth2AuthenticationProcessingException("Sorry! Login with " + registrationId + " is not supported yet.");
        }
    }
}
