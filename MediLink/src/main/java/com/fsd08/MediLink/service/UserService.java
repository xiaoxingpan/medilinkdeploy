package com.fsd08.MediLink.service;

import com.fsd08.MediLink.entity.Authority;
import com.fsd08.MediLink.entity.User;
import com.fsd08.MediLink.entity.VerificationToken;
import com.fsd08.MediLink.exception.UserAlreadyExistsException;
import com.fsd08.MediLink.registration.RegistrationRequest;
import com.fsd08.MediLink.repository.AuthorityRepository;
import com.fsd08.MediLink.repository.UserRepository;
import com.fsd08.MediLink.repository.VerificationTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final AuthorityRepository authorityRepository;

    private final PasswordEncoder passwordEncoder;

    private final VerificationTokenRepository tokenRepository;

    public User getUser(String username) {
        return userRepository.findById(username).orElse(null);
    }

    public Optional<User> findUserByUsername(String username){
        return userRepository.findByUsername(username);
    }

    public User updateUserPatch(int id, Map<String, Object> updates){
        Optional<User> userOptional = userRepository.findById(String.valueOf(id));
        if (!userOptional.isPresent()) {
            throw new RuntimeException("User not found");  // Or handle it as per your requirement
        }

        User user = userOptional.get();
        updates.forEach((key, value)->{
            switch (key){
                case "email":
                    user.setEmail((String) value);
                    break;
                case "name":
                    System.out.println("name= "+(String) value);
                    user.setName((String) value);
                    break;
                case "telephone":
                    user.setTelephone((String) value);
                    break;
                case "address":
                    user.setAddress((String) value);
                    break;
                case "avatar":
                    user.setAvatar((String) value);
                    break;
                case "description":
                    System.out.println("name= "+(String) value);
                    user.setDescription((String) value);
                    break;
                case "postal":
                    user.setPostal((String) value);
                    break;
            }
        });

        return userRepository.save(user);  // Saving the user entity, not the Optional
    }

    public List<User> getUsers(){
        return userRepository.findAll();

    }
    public void saveUserVerificationToken(User theUser, String token) {
        var verificationToken = new VerificationToken(token, theUser);
        tokenRepository.save(verificationToken);
    }

    public String validateToken(String theToken) {
        VerificationToken token = tokenRepository.findByToken(theToken);
        if(token == null){
            return "Invalid verification token";
        }
        User user = token.getUser();
        Calendar calendar = Calendar.getInstance();
        if ((token.getExpirationTime().getTime()-calendar.getTime().getTime())<= 0){
            tokenRepository.delete(token);
            return "Verification link already expired," +
                    " Please, click the link below to receive a new verification link";
        }
        user.setEnabled(true);
        userRepository.save(user);
        return "valid";
    }

    public User registerUser(RegistrationRequest request) {
        Optional<User> user = userRepository.findByUsername(request.username());
        if (user.isPresent()){
            throw new UserAlreadyExistsException(
                    "User with email "+request.username() + " already exists");
        }
        var newUser = new User();
        newUser.setName(request.name());
        newUser.setUsername(request.username());
        newUser.setEmail(request.email());
        newUser.setPassword(passwordEncoder.encode(request.password()));
        newUser.setAuthority(request.authority());
        return userRepository.save(newUser);

    }
}
