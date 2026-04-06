package com.smartcampus.controller.Auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.smartcampus.dto.Auth.AdminUserResponse;
import com.smartcampus.dto.Auth.LoginResponse;
import com.smartcampus.dto.Auth.SignupRequest;
<<<<<<< Updated upstream
=======
import com.smartcampus.dto.Auth.AdminCreateUserRequest;
import com.smartcampus.dto.Auth.AdminUpdateUserRequest;
import com.smartcampus.dto.Auth.UpdateProfileRequest;
>>>>>>> Stashed changes
import com.smartcampus.model.Auth.User;
import com.smartcampus.repository.Auth.UserRepository;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Comparator;
import java.util.List;
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

<<<<<<< Updated upstream
=======
    @PostMapping("/admin/users")
    public ResponseEntity<?> createUserByAdmin(@RequestBody AdminCreateUserRequest request, Authentication authentication) {
        if (!isAdmin(authentication)) {
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

    @GetMapping("/admin/users")
    public ResponseEntity<?> listUsersByAdmin(Authentication authentication) {
        if (!isAdmin(authentication)) {
            return ResponseEntity.status(403).body("Forbidden: Admins only");
        }

        List<AdminUserResponse> users = userRepository.findAll().stream()
                .sorted(Comparator.comparing(User::getId))
                .map(this::toAdminUserResponse)
                .toList();

        return ResponseEntity.ok(users);
    }

    @PutMapping("/admin/users/{id}")
    public ResponseEntity<?> updateUserByAdmin(@PathVariable Long id,
            @RequestBody AdminUpdateUserRequest request,
            Authentication authentication) {
        if (!isAdmin(authentication)) {
            return ResponseEntity.status(403).body("Forbidden: Admins only");
        }

        Optional<User> targetOpt = userRepository.findById(id);
        if (targetOpt.isEmpty()) {
            return ResponseEntity.status(404).body("User not found");
        }

        User target = targetOpt.get();

        if (request.getName() == null || request.getName().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Name is required");
        }
        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Email is required");
        }

        String normalizedEmail = request.getEmail().trim();
        if (!normalizedEmail.equalsIgnoreCase(target.getEmail())) {
            Optional<User> emailOwner = userRepository.findByEmail(normalizedEmail);
            if (emailOwner.isPresent()) {
                return ResponseEntity.badRequest().body("Error: Email is already in use!");
            }
            target.setEmail(normalizedEmail);
        }

        target.setName(request.getName().trim());
        target.setRole((request.getRole() == null || request.getRole().isBlank())
                ? "USER"
                : request.getRole().trim().toUpperCase());
        target.setPictureUrl((request.getPictureUrl() == null || request.getPictureUrl().trim().isEmpty())
                ? null
                : request.getPictureUrl().trim());

        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            target.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        userRepository.save(target);
        return ResponseEntity.ok(toAdminUserResponse(target));
    }

    @DeleteMapping("/admin/users/{id}")
    public ResponseEntity<?> deleteUserByAdmin(@PathVariable Long id, Authentication authentication) {
        if (!isAdmin(authentication)) {
            return ResponseEntity.status(403).body("Forbidden: Admins only");
        }

        String authEmail = resolveEmail(authentication);
        Optional<User> targetOpt = userRepository.findById(id);
        if (targetOpt.isEmpty()) {
            return ResponseEntity.status(404).body("User not found");
        }

        User target = targetOpt.get();
        if (authEmail != null && authEmail.equalsIgnoreCase(target.getEmail())) {
            return ResponseEntity.badRequest().body("You cannot delete your own account.");
        }

        userRepository.delete(target);
        return ResponseEntity.ok("User deleted successfully.");
    }

>>>>>>> Stashed changes
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

    private boolean isAdmin(Authentication authentication) {
        String email = resolveEmail(authentication);
        if (email == null || email.isBlank()) {
            return false;
        }

        Optional<User> userOpt = userRepository.findByEmail(email);
        return userOpt.isPresent() && "ADMIN".equalsIgnoreCase(userOpt.get().getRole());
    }

    private AdminUserResponse toAdminUserResponse(User user) {
        return new AdminUserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.getPictureUrl());
    }
}