package com.hms.services.ipdmanagement.security;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final TokenValidationFilter tokenValidationFilter;

    public SecurityConfig(TokenValidationFilter tokenValidationFilter) {
        this.tokenValidationFilter = tokenValidationFilter;
    }


    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(sessionManagement ->
                        sessionManagement.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .addFilterBefore(tokenValidationFilter, UsernamePasswordAuthenticationFilter.class)
                .authorizeHttpRequests(authorizeRequests -> authorizeRequests
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/health","/actuator/health").permitAll()
                        .requestMatchers(HttpMethod.POST,"/ipd-prescription/prescriptionNo").permitAll()
                        // Allow service-to-service calls (used by other microservices)
                        .requestMatchers(HttpMethod.GET, "/ipd-operation/searchByDate").permitAll()
                        .requestMatchers(HttpMethod.PUT,"/ipd-operation/update/*").permitAll()
                        .requestMatchers(HttpMethod.PUT,"/ipd-operation/updateStatus/*").permitAll()
                        // Restrict GET endpoints - only allow public endpoints
                        .requestMatchers(HttpMethod.GET, "/health", "/actuator/**").permitAll()
                        .requestMatchers(AUTH_LIST).permitAll()
                        .anyRequest().authenticated()
                );
        return http.build();
    }


    private static final String[] AUTH_LIST = {
            "/api/v1/auth/**",
            "/v3/api-docs/**",
            "/v3/api-docs.yaml",
            "/swagger-ui/**",
            "/swagger-ui.html"
    };
}
