package com.estoque.GerenciadorEstoque.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http)
            throws Exception {

        http
            // Para API REST, desabilitamos CSRF
            .csrf(csrf -> csrf.disable())

            .authorizeHttpRequests(auth -> auth

                // Cadastro pode ser feito sem login
                .requestMatchers("/usuarios").permitAll()

                // H2 Console
                .requestMatchers("/h2-console/**").permitAll()

                // Demais endpoints precisam de autenticação
                .anyRequest().authenticated()
            )

            // Permite o funcionamento do H2 Console
            .headers(headers -> headers
                .frameOptions(frame -> frame.sameOrigin())
            );

        return http.build();
    }
}