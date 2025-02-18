package com.comrepublic.shopx.auth.services;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.security.core.userdetails.UserDetailsService;
// import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
// import org.springframework.security.core.Authentication;
// import org.springframework.security.authentication.AuthenticationManager;
// import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ServerErrorException;

import com.comrepublic.shopx.auth.entities.User;
import com.comrepublic.shopx.auth.repositories.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // @Autowired
    // private AuthenticationManager authenticationManager;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User updateUser(UUID userId, User updatedUser) {
        Optional<User> existingUserOptional = userRepository.findById(userId);
        
        if (existingUserOptional.isPresent()) {
            User existingUser = existingUserOptional.get();
            
            existingUser.setFirstName(updatedUser.getFirstName());
            existingUser.setLastName(updatedUser.getLastName());
            existingUser.setPhoneNumber(updatedUser.getPhoneNumber());
            existingUser.setProvider(updatedUser.getProvider());
            existingUser.setUpdatedOn(updatedUser.getUpdatedOn());
            
            // Ensure password updates are encoded
            if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
                existingUser.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
            }
            
            return userRepository.save(existingUser);
        } else {
            throw new ServerErrorException("User not found", null);
        }
    }
    // public boolean updatePassword(UUID userId, String oldPassword, String newPassword) {
    //     Optional<User> userOptional = userRepository.findById(userId);
        
    //     if (userOptional.isPresent()) {
    //         User user = userOptional.get();
            
    //         // Validate the old password
    //         if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
    //             throw new BadCredentialsException("Incorrect old password");
    //         }
            
    //         // Update the password with the new one
    //         user.setPassword(passwordEncoder.encode(newPassword));
    //         userRepository.save(user);
    //         return true;
    //     }
        
    //     return false;
    // }

}