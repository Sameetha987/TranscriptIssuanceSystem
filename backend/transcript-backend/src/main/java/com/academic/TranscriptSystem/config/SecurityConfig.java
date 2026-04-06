package com.academic.TranscriptSystem.config;

import com.academic.TranscriptSystem.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;


@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                .cors(cors -> {})
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth

                        // ALWAYS FIRST
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // PUBLIC
                        .requestMatchers("/api/v1/auth/**").permitAll()
                        .requestMatchers("/api/v1/transcripts/public/**").permitAll()

                        // ROLE BASED
                        .requestMatchers("/api/v1/admin/**").hasAuthority("ADMIN")
                        .requestMatchers("/api/v1/student/**").hasAuthority("STUDENT")
                        .requestMatchers("/api/v1/transcripts/my").hasAuthority("STUDENT")
                        .requestMatchers("/api/v1/transcripts/student/**").hasAuthority("STUDENT")
                        .requestMatchers("/api/v1/transcripts/verify/**").hasAnyAuthority("ADMIN", "STUDENT")
                        .requestMatchers("/api/v1/subjects/**").hasAnyAuthority("ADMIN","STUDENT")
                        .requestMatchers("/api/v1/transcripts/**").hasAuthority("ADMIN")

                        // fallback
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
