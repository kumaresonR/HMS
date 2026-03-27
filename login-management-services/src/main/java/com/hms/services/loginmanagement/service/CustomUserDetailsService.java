package com.hms.services.loginmanagement.service;

import com.hms.services.loginmanagement.configuration.AdminManagementInterface;
import com.hms.services.loginmanagement.entity.HMS_TM_UserDetails;
import com.hms.services.loginmanagement.model.RoleDto;
import com.hms.services.loginmanagement.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    AdminManagementInterface adminManagementInterface;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        HMS_TM_UserDetails user = userRepository.findByUserNameAndIsActiveTrue(username)
                .orElseThrow(() -> new UsernameNotFoundException("Invalid username & password"));
        RoleDto role =adminManagementInterface.getRole(user.getRoleId()).getBody();
        return new org.springframework.security.core.userdetails.User(
                user.getUserName(),
                user.getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority(role.getRoleName()))
        );
    }

}

