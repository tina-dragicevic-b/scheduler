package com.scheduler.user.security.jwt;

import com.scheduler.user.config.AppProperties;
import com.scheduler.user.model.LocalUser;
import com.scheduler.user.model.LoginRequest;
import com.scheduler.user.persistence.repository.UserRepository;
import io.jsonwebtoken.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Base64;
import java.util.Date;

@Service
@EnableConfigurationProperties(AppProperties.class)
public class TokenProvider {
    private static final Logger logger = LoggerFactory.getLogger(TokenProvider.class);

    private AppProperties appProperties;
    @Autowired
    private UserRepository userRepository;
//    @Autowired private TokenHolder tokenHolder;

    public TokenProvider(AppProperties appProperties) {
        this.appProperties = appProperties;
    }

    public String createToken(Authentication authentication) {
        LocalUser userPrincipal = (LocalUser) authentication.getPrincipal();

        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + appProperties.getAuth().getTokenExpirationMsec());
        appProperties.getAuth().setTokenSecret("");
        String encodedString = Base64.getEncoder().encodeToString(appProperties.getAuth().getTokenSecret().getBytes());
        var token =  Jwts.builder().setSubject(userPrincipal.getUser().getEmail()).setIssuedAt(new Date()).setExpiration(expiryDate)
                .signWith(SignatureAlgorithm.HS512, appProperties.getAuth().getTokenSecret()).compact();
//        tokenHolder.setAuthToken(token);
//        System.out.println(tokenHolder.getAuthToken());
        return token;
        //        return Jwts.builder().setSubject(userPrincipal.getUser().getId()).setIssuedAt(new Date()).setExpiration(expiryDate)
//                .signWith(SignatureAlgorithm.HS512, encodedString).compact();
    }

    public String createTokenForOauth2RegularLogin(LoginRequest loginRequest) {
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

        var email = loginRequest.getEmail();
        var pwd = passwordEncoder.encode(loginRequest.getPassword());
        var user = userRepository.findByEmail(email);
        if(user != null){
            if(user.getPassword().equals(pwd)){
                Date now = new Date();
                Date expiryDate = new Date(now.getTime() + appProperties.getAuth().getTokenExpirationMsec());
                appProperties.getAuth().setTokenSecret("");
                String encodedString = Base64.getEncoder().encodeToString(appProperties.getAuth().getTokenSecret().getBytes());
                return Jwts.builder().setSubject(email).setIssuedAt(new Date()).setExpiration(expiryDate)
                        .signWith(SignatureAlgorithm.HS512, appProperties.getAuth().getTokenSecret()).compact();
            }
            return "Bad Credentials. ";
        }
        return "Bad Credentials. ";

/*        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + appProperties.getAuth().getTokenExpirationMsec());
        appProperties.getAuth().setTokenSecret("");
        String encodedString = Base64.getEncoder().encodeToString(appProperties.getAuth().getTokenSecret().getBytes());
        return Jwts.builder().setSubject(email).setIssuedAt(new Date()).setExpiration(expiryDate)
                .signWith(SignatureAlgorithm.HS512, appProperties.getAuth().getTokenSecret()).compact();*/
    }
    /*public Long getUserIdFromToken(String token) {
        Claims claims = Jwts.parser().setSigningKey(appProperties.getAuth().getTokenSecret()).parseClaimsJws(token).getBody();

        return Long.parseLong(claims.getSubject());
    }*/

    public String  getUserIdFromToken(String token) {
        Claims claims = Jwts.parser().setSigningKey(appProperties.getAuth().getTokenSecret()).parseClaimsJws(token).getBody();

        return claims.getSubject();
    }
    public String getUserEmailFromToken(String token) {
        Claims claims = Jwts.parser().setSigningKey(appProperties.getAuth().getTokenSecret()).parseClaimsJws(token).getBody();

        return claims.getSubject();
    }
    public boolean validateToken(String authToken) {
        try {
            Jwts.parser().setSigningKey(appProperties.getAuth().getTokenSecret()).parseClaimsJws(authToken);
            return true;
        } catch (SignatureException ex) {
            logger.error("Invalid JWT signature");
        } catch (MalformedJwtException ex) {
            logger.error("Invalid JWT token");
        } catch (ExpiredJwtException ex) {
            logger.error("Expired JWT token");
        } catch (UnsupportedJwtException ex) {
            logger.error("Unsupported JWT token");
        } catch (IllegalArgumentException ex) {
            logger.error("JWT claims string is empty.");
        }
        return false;
    }
}
