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
import com.smartcampus.dto.Auth.AdminCreateUserRequest;
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

    @PostMapping("/admin/users")
    public ResponseEntity<?> createUserByAdmin(@RequestBody AdminCreateUserRequest request, Authentication authentication) {
        // Ensure the caller is an admin
        String authEmail = null;
        if (authentication != null) {
            authEmail = authentication.getName();
        }

        if (authEmail == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        Optional<User> authUserOpt = userRepository.findByEmail(authEmail);
        if (authUserOpt.isEmpty() || !"ADMIN".equalsIgnoreCase(authUserOpt.get().getRole())) {
            return ResponseEntity.status(403).body("Forbidden: Admins only");
        }

        Optional<User> existingUser = userRepository.findByEmail(request.getEmail());
        if (existingUser.isPresent()) {
            return ResponseEntity.badRequest().body("Error: Email is already in use!");
        }

        String role = (request.getRole() == null || request.getRole().isBlank())
                ? "USER"
                : request.getRole().toUpperCase();

        User user = new User(
                request.getName(),
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                role);

        if (request.getPictureUrl() != null) {
            user.setPictureUrl(request.getPictureUrl());
        }

        userRepository.save(user);

        return ResponseEntity.ok("User created successfully by admin!");
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
}