package com.fsd08.MediLink.controller;

import com.fsd08.MediLink.MediLinkApplication;
import com.fsd08.MediLink.entity.Authority;
import com.fsd08.MediLink.entity.User;
import com.fsd08.MediLink.entity.VerificationToken;
import com.fsd08.MediLink.event.RegistrationCompleteEvent;
import com.fsd08.MediLink.registration.RegistrationRequest;
import com.fsd08.MediLink.repository.UserRepository;
import com.fsd08.MediLink.repository.AuthorityRepository;
import com.fsd08.MediLink.repository.VerificationTokenRepository;
import com.fsd08.MediLink.service.JwtService;
import com.fsd08.MediLink.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.springframework.context.ApplicationEventPublisher;

@RestController
@CrossOrigin(origins = "*", allowedHeaders = "*")
@RequiredArgsConstructor
public class UserController {
    // private static final Gson gson = new Gson();

    private static final Logger logger = LoggerFactory.getLogger(MediLinkApplication.class);

    private final UserService userService;

    private final UserRepository userRepository;

    private final AuthorityRepository authorityRepository;

    private final PasswordEncoder passwordEncoder;

    private final JwtService jwtService;

    private final ApplicationEventPublisher publisher;
    private final VerificationTokenRepository tokenRepository;

    @PutMapping("/users/updatePut/{id}")
    public ResponseEntity<Object> updateUserPut(@RequestBody User updatedItem) {
        User result = userRepository.save(updatedItem);
        return ResponseEntity.ok(result);
    }

    @PatchMapping("/users/updatePatch/{id}")
    public ResponseEntity<Object> updateUserPatch(@PathVariable int id, @RequestBody Map<String, Object> updates) {
        User result = userService.updateUserPatch(id, updates);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<User> getUserById(@PathVariable int id) {
        User result = userRepository.findById(id);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/users")
    public List<User> getAllUsers() {
        List<User> results = userRepository.findAll();
        return results;
    }

    @PostMapping("/register")
    public ResponseEntity<Object> registerUser(@RequestBody RegistrationRequest registrationRequest, final HttpServletRequest request){
        Map<String, Object> result = new HashMap<>();
        // Check if username exists in the DB
        if (userRepository.existsByUsername(registrationRequest.username())) {
            result.put("msg", "Username is already taken!");
            return new ResponseEntity<>(result, HttpStatus.BAD_REQUEST);
        }
        // Check if email exists in the DB
        if (userRepository.existsByEmail(registrationRequest.email())) {
            result.put("msg", "Email is already taken!");
            return new ResponseEntity<>(result, HttpStatus.BAD_REQUEST);
        }
        // check if the password and empty
        if (registrationRequest.password() == null || registrationRequest.password().isEmpty()) {
            result.put("msg", "Failed to register user: password empty.");
            return new ResponseEntity<>(result, HttpStatus.BAD_REQUEST);
        }
        // check if the password and confirm password is the same
        else if (!registrationRequest.password().equals(registrationRequest.confirmPassword())) {
            result.put("msg", "Failed to register user: Passwords do not match.");
            return new ResponseEntity<>(result, HttpStatus.BAD_REQUEST);
        }else {
            User user = userService.registerUser(registrationRequest);
            // create user authority
            Authority authority = new Authority(user.getUsername(), user.getAuthority());
            authorityRepository.save(authority);
            publisher.publishEvent(new RegistrationCompleteEvent(user, applicationUrl(request)));
            result.put("msg", "Registration Success, please check your email for registration confirmation");
            result.put("user", user);
            return ResponseEntity.ok(result);
        }
    }

    public String applicationUrl(HttpServletRequest request) {
        return "http://"+request.getServerName()+":"
                +request.getServerPort()+request.getContextPath();
    }

    @GetMapping("/verifyEmail")
    public String sendVerificationToken(@RequestParam("token") String token){
        VerificationToken theToken = tokenRepository.findByToken(token);
        if (theToken.getUser().isEnabled()){
            return "This account has already been verified, please login.";
        }
        String verificationResult = userService.validateToken(token);
        if (verificationResult.equalsIgnoreCase("valid")){
            return "<h1>Email verified successfully. Now you can <a href='http://localhost:3000/login'>login</a> to your account<h1>";
        }
        return "Invalid verification link";
    }
}
