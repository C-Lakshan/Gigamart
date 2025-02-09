package com.comrepublic.shopx.auth.services;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
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
}