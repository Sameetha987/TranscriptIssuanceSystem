package com.academic.TranscriptSystem.controller;

import com.academic.TranscriptSystem.dto.LoginRequestDTO;
import com.academic.TranscriptSystem.entity.Admin;
import com.academic.TranscriptSystem.repository.AdminRepository;
import com.academic.TranscriptSystem.response.ApiResponse;

import jakarta.validation.Valid;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth/admin")
public class AuthController {

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(AdminRepository adminRepository,
                          PasswordEncoder passwordEncoder) {
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public ApiResponse<String> login(@Valid @RequestBody LoginRequestDTO request) {

        Admin admin = adminRepository.findByUsername(request.getUsername())
                .orElse(null);

        if (admin == null) {
            return new ApiResponse<>(false, "Admin not found", null);
        }

        boolean passwordMatches = passwordEncoder.matches(
                request.getPassword(),
                admin.getPassword()
        );

        if (!passwordMatches) {
            return new ApiResponse<>(false, "Invalid password", null);
        }

        return new ApiResponse<>(true, "Login successful", "Login OK");
    }
}
