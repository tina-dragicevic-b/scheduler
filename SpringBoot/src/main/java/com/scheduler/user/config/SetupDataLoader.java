package com.scheduler.user.config;

import com.scheduler.user.model.SocialProvider;
import com.scheduler.user.persistence.entity.User;
import com.scheduler.user.persistence.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Calendar;
import java.util.Date;

@Component
public class SetupDataLoader implements ApplicationListener<ContextRefreshedEvent> {

    private boolean alreadySetup = false;

    @Autowired
    private UserRepository userRepository;

//    @Autowired
//    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void onApplicationEvent(final ContextRefreshedEvent event) {
        if (alreadySetup) {
            return;
        }
        // Create initial roles
//        Role userRole = createRoleIfNotFound(Role.ROLE_USER);
//        Role adminRole = createRoleIfNotFound(Role.ROLE_ADMIN);
//        Role modRole = createRoleIfNotFound(Role.ROLE_MODERATOR);

        createUserIfNotFound("admin@tinaD.com", "ROLE_USER");
        alreadySetup = true;
    }

    @Transactional
    public User createUserIfNotFound(final String email, String role) {
//        private final User createUserIfNotFound(final String email, Set<Role> roles) {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            user = new User();
            user.setDisplayName("Admin");
            user.setEmail(email);
            user.setPassword(passwordEncoder.encode("admin@"));
            user.setRole(role);
            user.setProvider(SocialProvider.LOCAL.getProviderType());
            user.setEnabled(true);
            Date now = Calendar.getInstance().getTime();
            user.setCreatedDate(now);
            user.setModifiedDate(now);
            user = userRepository.save(user);
        }
        return user;
    }
//
//    @Transactional
//    private final Role createRoleIfNotFound(final String name) {
//        Role role = roleRepository.findByName(name);
//        if (role == null) {
//            role = roleRepository.save(new Role(name));
//        }
//        return role;
//    }
}