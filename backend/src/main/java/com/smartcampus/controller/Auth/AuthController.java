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
import com.smartcampus.dto.Auth.AdminCreateUserRequest;
import com.smartcampus.dto.Auth.UpdateProfileRequest;
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
        String email = resolveEmail(authentication);
        String nameFallback = resolveName(authentication);
        String pictureFallback = resolvePicture(authentication);

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

    @PutMapping("/me/profile")
    public ResponseEntity<?> updateCurrentUserProfile(@RequestBody UpdateProfileRequest request,
            Authentication authentication) {
        String email = resolveEmail(authentication);
        if (email == null || email.isBlank()) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body("User not found");
        }

        User user = userOpt.get();

        if (request.getName() == null || request.getName().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Name is required");
        }

        user.setName(request.getName().trim());
        user.setPictureUrl(
                request.getPictureUrl() == null || request.getPictureUrl().trim().isEmpty()
                        ? null
                        : request.getPictureUrl().trim());

        userRepository.save(user);

        return ResponseEntity.ok(new LoginResponse(
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.getPictureUrl()));
    }

    private String resolveEmail(Authentication authentication) {
        if (authentication == null) {
            return null;
        }

        if (authentication instanceof OAuth2AuthenticationToken) {
            OAuth2User oUser = ((OAuth2AuthenticationToken) authentication).getPrincipal();
            return oUser.getAttribute("email");
        }

        if (authentication.getPrincipal() instanceof OAuth2User) {
            OAuth2User oUser = (OAuth2User) authentication.getPrincipal();
            return oUser.getAttribute("email");
        }

        return authentication.getName();
    }

    private String resolveName(Authentication authentication) {
        if (authentication == null) {
            return null;
        }

        if (authentication instanceof OAuth2AuthenticationToken) {
            OAuth2User oUser = ((OAuth2AuthenticationToken) authentication).getPrincipal();
            return oUser.getAttribute("name");
        }

        if (authentication.getPrincipal() instanceof OAuth2User) {
            OAuth2User oUser = (OAuth2User) authentication.getPrincipal();
            return oUser.getAttribute("name");
        }

        return authentication.getName();
    }

    private String resolvePicture(Authentication authentication) {
        if (authentication == null) {
            return null;
        }

        if (authentication instanceof OAuth2AuthenticationToken) {
            OAuth2User oUser = ((OAuth2AuthenticationToken) authentication).getPrincipal();
            return oUser.getAttribute("picture");
        }

        if (authentication.getPrincipal() instanceof OAuth2User) {
            OAuth2User oUser = (OAuth2User) authentication.getPrincipal();
            return oUser.getAttribute("picture");
        }

        return null;
    }
}