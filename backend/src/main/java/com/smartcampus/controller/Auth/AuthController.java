package com.smartcampus.controller.Auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.smartcampus.dto.Auth.LoginResponse;
import com.smartcampus.dto.Auth.SignupRequest;
import com.smartcampus.model.Auth.User;
import com.smartcampus.repository.Auth.UserRepository;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;

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

        if (request.getPictureUrl() != null) {
            user.setPictureUrl(request.getPictureUrl());
        }

        userRepository.save(user);

        return ResponseEntity.ok("User registered successfully!");
    }

    @GetMapping("/me")
    public LoginResponse getCurrentUser(Authentication authentication) {
        String email = null;
        String nameFallback = authentication.getName();
        String pictureFallback = null;

        if (authentication instanceof OAuth2AuthenticationToken) {
            OAuth2User oUser = ((OAuth2AuthenticationToken) authentication).getPrincipal();
            email = oUser.getAttribute("email");
            nameFallback = oUser.getAttribute("name");
            pictureFallback = oUser.getAttribute("picture");
        } else if (authentication.getPrincipal() instanceof OAuth2User) {
            OAuth2User oUser = (OAuth2User) authentication.getPrincipal();
            email = oUser.getAttribute("email");
            nameFallback = oUser.getAttribute("name");
            pictureFallback = oUser.getAttribute("picture");
        } else {
            email = authentication.getName();
        }

        if (email != null) {
            Optional<User> userOpt = userRepository.findByEmail(email);
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                return new LoginResponse(
                        user.getName(),
                        user.getEmail(),
                        user.getRole(),
                        user.getPictureUrl());
            }
        }

        return new LoginResponse(
                nameFallback,
                email,
                "USER",
                pictureFallback);
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(Authentication authentication, @RequestBody SignupRequest request) {
        String email = null;
        if (authentication instanceof OAuth2AuthenticationToken) {
            OAuth2User oUser = ((OAuth2AuthenticationToken) authentication).getPrincipal();
            email = oUser.getAttribute("email");
        } else if (authentication.getPrincipal() instanceof OAuth2User) {
            OAuth2User oUser = (OAuth2User) authentication.getPrincipal();
            email = oUser.getAttribute("email");
        } else {
            email = authentication.getName();
        }

        if (email == null)
            return ResponseEntity.badRequest().body("User email not found");

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = userOpt.get();
        if (request.getName() != null && !request.getName().isEmpty()) {
            user.setName(request.getName());
        }
        if (request.getPictureUrl() != null) {
            user.setPictureUrl(request.getPictureUrl());
        }

        userRepository.save(user);
        return ResponseEntity.ok(user);
    }
}