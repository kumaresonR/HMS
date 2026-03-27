package com.hms.services.ambulancemanagement.security;



import com.hms.services.ambulancemanagement.configuration.LoginInterface;
import com.hms.services.ambulancemanagement.exception.CustomException;
import com.hms.services.ambulancemanagement.model.SignInResponse;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
public class TokenValidationFilter extends OncePerRequestFilter {


    private final LoginInterface loginInterface;

    @Autowired
    public TokenValidationFilter(LoginInterface loginInterface) {
        this.loginInterface = loginInterface;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String token = getTokenRequest(request);
        if(token != null) {
            try {
                SignInResponse tokenValue = loginInterface.getTokenInfo(token).getBody();
                if (tokenValue == null) {
                    response.setStatus(HttpStatus.UNAUTHORIZED.value());
                    response.getWriter().write("{\"error\":\"Invalid or expired token\"}");
                    return;
                }
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(tokenValue, null, Collections.emptyList());
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authentication);
            } catch (Exception e) {
                response.setStatus(HttpStatus.UNAUTHORIZED.value());
                response.getWriter().write("{\"error\":\"Token validation failed\"}");
                return;
            }
        }
        filterChain.doFilter(request, response);
    }

    private String getTokenRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}

