package com.academic.TranscriptSystem;

import com.academic.TranscriptSystem.entity.Admin;
import com.academic.TranscriptSystem.repository.AdminRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer {

    @Autowired
    private AdminRepository adminRepository;

    @PostConstruct
    public void init() {
        System.out.println(" INIT RUNNING");

        if (adminRepository.findByUsername("admin") == null) {
            Admin admin = new Admin();
            admin.setUsername("admin");
            admin.setPassword("$2a$10$7QJ5KzQ2K5Y5gXK8Z9YwOeWk3nQFhW2l7Y0k6GQvP2sR7k6Z8XJ2K");

            adminRepository.save(admin);

            System.out.println("ADMIN INSERTED");
        } else {
            System.out.println("️ ADMIN ALREADY EXISTS");
        }
    }
}