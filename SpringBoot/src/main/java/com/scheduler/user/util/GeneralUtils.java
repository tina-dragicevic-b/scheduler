package com.scheduler.user.util;

import com.scheduler.user.model.LocalUser;
import com.scheduler.user.model.SocialProvider;
import com.scheduler.user.model.UserInfo;
import com.scheduler.user.persistence.entity.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class GeneralUtils {
    public static List<SimpleGrantedAuthority> buildSimpleGrantedAuthorities(final String role) {
        List<SimpleGrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority(role));
        return authorities;
    }

    public static SocialProvider toSocialProvider(String providerId) {
        for (SocialProvider socialProvider : SocialProvider.values()) {
            if (socialProvider.getProviderType().equals(providerId)) {
                return socialProvider;
            }
        }
        return SocialProvider.LOCAL;
    }

    public static UserInfo buildUserInfo(LocalUser localUser) {
        List<String> roles = localUser.getAuthorities().stream().map(GrantedAuthority::getAuthority).toList();
        User user = localUser.getUser();
        var role = roles.get(0);
        return new UserInfo(user.getId().toString(), user.getDisplayName(), user.getEmail(), role);
    }
}
