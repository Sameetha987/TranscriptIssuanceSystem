package com.academic.TranscriptSystem.controller;

import com.academic.TranscriptSystem.dto.LoginRequestDTO;
import com.academic.TranscriptSystem.entity.Admin;
import com.academic.TranscriptSystem.repository.AdminRepository;
import com.academic.TranscriptSystem.response.ApiResponse;

import jakarta.validation.Valid;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import com.academic.TranscriptSystem.security.JwtUtil;


@RestController
@RequestMapping("/api/auth/admin")
public class AuthController {

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;


    public AuthController(AdminRepository adminRepository,
                          PasswordEncoder passwordEncoder,
                          JwtUtil jwtUtil) {
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
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
        String token = jwtUtil.generateToken(admin.getUsername(), "ADMIN");
        return new ApiResponse<>(true, "Login successful", token);
    }
}
