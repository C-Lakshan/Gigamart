package com.comrepublic.shopx.auth.services;

import com.comrepublic.shopx.auth.entities.Authority;
import com.comrepublic.shopx.auth.repositories.AuthorityRepository;

import jakarta.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class AuthorityService {

    @Autowired
    private AuthorityRepository authorityRepository;

    public List<Authority> getUserAuthority() {
        List<Authority> authorities = new ArrayList<>();
        Authority userAuthority = authorityRepository.findByRoleCode("USER");
        authorities.add(userAuthority);
        return authorities;
    }

    public List<Authority> getAdminAuthority() {
        List<Authority> authorities = new ArrayList<>();
        Authority adminAuthority = authorityRepository.findByRoleCode("ADMIN");
        authorities.add(adminAuthority);
        return authorities;
    }

    
    @PostConstruct
    public void initRoles() {
        if (authorityRepository.findByRoleCode("USER") == null) {
            createAuthority("USER", "Standard User Role");
        }
        if (authorityRepository.findByRoleCode("ADMIN") == null) {
            createAuthority("ADMIN", "Administrator Role");
        }
    }

    public Authority createAuthority(String roleCode, String roleDescription) {
        // Check if authority already exists
        Authority existingAuthority = authorityRepository.findByRoleCode(roleCode);
        if (existingAuthority != null) {
            return existingAuthority;
        }

        // Create new authority if it doesn't exist
        Authority authority = Authority.builder()
                .roleCode(roleCode)
                .roleDescription(roleDescription)
                .build();
        
        return authorityRepository.save(authority);
    }
}
