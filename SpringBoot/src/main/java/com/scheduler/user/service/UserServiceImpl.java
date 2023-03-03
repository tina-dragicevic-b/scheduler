package com.scheduler.user.service;

import com.scheduler.user.exception.OAuth2AuthenticationProcessingException;
import com.scheduler.user.exception.UserAlreadyExistAuthenticationException;
import com.scheduler.user.model.LocalUser;
import com.scheduler.user.model.SignUpRequest;
import com.scheduler.user.model.SocialProvider;
import com.scheduler.user.persistence.entity.User;
import com.scheduler.user.persistence.repository.UserRepository;
import com.scheduler.user.security.jwt.TokenProvider;
import com.scheduler.user.security.oauth2.user.OAuth2UserInfo;
import com.scheduler.user.security.oauth2.user.OAuth2UserInfoFactory;
import com.scheduler.user.util.GeneralUtils;
import lombok.AllArgsConstructor;
import lombok.Setter;
import org.mapstruct.factory.Mappers;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.oidc.OidcIdToken;
import org.springframework.security.oauth2.core.oidc.OidcUserInfo;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.Calendar;
import java.util.Date;
import java.util.Map;
import java.util.Optional;
@AllArgsConstructor
@Service
public class UserServiceImpl implements UserService {
   //@Autowired
   private final UserMapper USER_MAPPER = Mappers.getMapper(UserMapper.class);

   private UserRepository userRepository;

   private TokenProvider tokenProvider;
   // @Autowired
    //private PasswordEncoder passwordEncoder;

    @Override
    @Transactional(value = "transactionManager")
    public User registerNewUser(final SignUpRequest signUpRequest) throws UserAlreadyExistAuthenticationException {
        if (signUpRequest.getUserID() != null && userRepository.existsById(signUpRequest.getUserID())) {
            System.out.println("User with User id " + signUpRequest.getUserID() + " already exist");
            throw new UserAlreadyExistAuthenticationException("User with User id " + signUpRequest.getUserID() + " already exist");
        } else if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            System.out.println("User with email id " + signUpRequest.getEmail() + " already exist");
            throw new UserAlreadyExistAuthenticationException("User with email id " + signUpRequest.getEmail() + " already exist");
        }
        User user = buildUser(signUpRequest);
        Date now = Calendar.getInstance().getTime();
        user.setCreatedDate(now);
        user.setModifiedDate(now);
        user = userRepository.save(user);
//        userRepository.flush();
        return user;
    }

    private User buildUser(final SignUpRequest formDTO) {
       // var enc = new BCryptPasswordEncoder();
//        var a = enc.encode(signUpRequest.getPassword());
//        signUpRequest.setPassword(a);
//        System.out.println(signUpRequest.getPassword());
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        User user = new User();
        user.setDisplayName(formDTO.getDisplayName());
        user.setEmail(formDTO.getEmail());
        user.setPassword(passwordEncoder.encode(formDTO.getPassword()));
//        user.setPassword(formDTO.getPassword());
        user.setRole("ROLE_USER");
        user.setProvider(formDTO.getSocialProvider().getProviderType());
        user.setEnabled(true);
        user.setProviderUserId(formDTO.getProviderUserId());
        return user;
    }
    // done
    @Override
    public User findUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    @Override
    public Optional<User> findUserById(String id) {
        return userRepository.findById(id);
    }

    @Override
    @Transactional
    public LocalUser processUserRegistration(String registrationId, Map<String, Object> attributes, OidcIdToken idToken, OidcUserInfo userInfo) {
        OAuth2UserInfo oAuth2UserInfo = OAuth2UserInfoFactory.getOAuth2UserInfo(registrationId, attributes);
        if (StringUtils.isEmpty(oAuth2UserInfo.getName())) {
            throw new OAuth2AuthenticationProcessingException("Name not found from OAuth2 provider");
        } else if (StringUtils.isEmpty(oAuth2UserInfo.getEmail())) {
            throw new OAuth2AuthenticationProcessingException("Email not found from OAuth2 provider");
        }
        SignUpRequest userDetails = toUserRegistrationObject(registrationId, oAuth2UserInfo);
        User user = findUserByEmail(oAuth2UserInfo.getEmail());
        if (user != null) {
            if (!user.getProvider().equals(registrationId) && !user.getProvider().equals(SocialProvider.LOCAL.getProviderType())) {
                throw new OAuth2AuthenticationProcessingException(
                        "Looks like you're signed up with " + user.getProvider() + " account. Please use your " + user.getProvider() + " account to login.");
            }
            //user = updateExistingUser(user, oAuth2UserInfo);
        } else {
            user = registerNewUser(userDetails);
        }

        return LocalUser.create(user, attributes, idToken, userInfo);
    }

    @Override
    public void saveUserPreference(String token, String preference) {
        assert token != null;
        var user = tokenProvider.getUserEmailFromToken(token);
        var entity = userRepository.findByEmail(user);
        assert entity != null;
        entity.setThemePreference(preference);
        userRepository.save(entity);
    }

    private User updateExistingUser(User existingUser, OAuth2UserInfo oAuth2UserInfo) {
        existingUser.setDisplayName(oAuth2UserInfo.getName());
        return userRepository.save(existingUser);
    }

    private SignUpRequest toUserRegistrationObject(String registrationId, OAuth2UserInfo oAuth2UserInfo) {
        return SignUpRequest.getBuilder().addProviderUserID(oAuth2UserInfo.getId()).addDisplayName(oAuth2UserInfo.getName()).addEmail(oAuth2UserInfo.getEmail())
                .addSocialProvider(GeneralUtils.toSocialProvider(registrationId)).addPassword("changeit").build();
    }
}
