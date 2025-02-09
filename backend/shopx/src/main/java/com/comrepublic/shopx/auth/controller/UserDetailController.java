package com.comrepublic.shopx.auth.controller;

import java.security.Principal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.comrepublic.shopx.auth.dto.UserDetailsDto;
import com.comrepublic.shopx.auth.entities.User;
import com.comrepublic.shopx.auth.services.UserService;

@RestController
@CrossOrigin
@RequestMapping("/api/user")
public class UserDetailController {

    @Autowired
    private UserDetailsService userDetailsService;
    @Autowired
    private UserService userService; // Inject UserService

    @GetMapping("/profile")
    public ResponseEntity<UserDetailsDto> getUserProfile(Principal principal) {
        User user = (User) userDetailsService.loadUserByUsername(principal.getName());

        if (null == user) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        UserDetailsDto userDetailsDto = UserDetailsDto.builder()
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .id(user.getId())
                .phoneNumber(user.getPhoneNumber())
                .addressList(user.getAddressList())
                .authorityList(user.getAuthorities().toArray()).build();

        return new ResponseEntity<>(userDetailsDto, HttpStatus.OK);

    }

    // New endpoint to fetch all users
    @GetMapping("/all")
    public ResponseEntity<List<UserDetailsDto>> getAllUsers() {
        List<User> users = userService.getAllUsers();

        List<UserDetailsDto> userDetailsDtoList = users.stream()
                .map(user -> UserDetailsDto.builder()
                        .firstName(user.getFirstName())
                        .lastName(user.getLastName())
                        .email(user.getEmail())
                        .id(user.getId())
                        .phoneNumber(user.getPhoneNumber())
                        .addressList(user.getAddressList())
                        .authorityList(user.getAuthorities().toArray())
                        .build())
                .collect(Collectors.toList());

        return new ResponseEntity<>(userDetailsDtoList, HttpStatus.OK);
    }

    @PutMapping("/userProfile/{userId}")
    public ResponseEntity<User> updateUser(@PathVariable UUID userId, @RequestBody User updatedUser) {
        User user = userService.updateUser(userId, updatedUser);
        return ResponseEntity.ok(user);
    }
}
