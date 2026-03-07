package com.smartcampus.controller.Auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.smartcampus.dto.Auth.LoginResponse;
import com.smartcampus.dto.Auth.SignupRequest;
import com.smartcampus.model.Auth.User;
import com.smartcampus.repository.Auth.UserRepository;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody SignupRequest request) {
        Optional<User> existingUser = userRepository.findByEmail(request.getEmail());
        if (existingUser.isPresent()) {
            return ResponseEntity.badRequest().body("Error: Email is already in use!");
        }

        User user = new User(
                request.getName(),
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                "USER");

        userRepository.save(user);

        return ResponseEntity.ok("User registered successfully!");
    }

    @GetMapping("/me")
    public com.smartcampus.dto.Auth.LoginResponse getCurrentUser(Authentication authentication) {

        String email = authentication.getName();
        String role = "USER";

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            role = userOpt.get().getRole();
        }

        return new LoginResponse(
                authentication.getName(),
                email,
                role);
    }
}