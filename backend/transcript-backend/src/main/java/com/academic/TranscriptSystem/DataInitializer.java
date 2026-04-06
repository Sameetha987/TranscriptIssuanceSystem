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
        if (adminRepository.findByUsername("admin").isEmpty()) {
            Admin admin = new Admin();
            admin.setUsername("admin");

            admin.setPassword("$2a$10$zI1L8FE0HZZy6H5ISyLOdOvzrmB3Sq8nFiC.208Jz1Y6HGaVdXKBe");

            adminRepository.save(admin);
            System.out.println("Admin inserted into DB");
        }
    }
}