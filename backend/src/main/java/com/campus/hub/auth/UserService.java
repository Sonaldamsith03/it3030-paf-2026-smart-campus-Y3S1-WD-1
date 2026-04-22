package com.campus.hub.auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public List<User> getTechnicians() {
        return userRepository.findByRole("TECHNICIAN");
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}
