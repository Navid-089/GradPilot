package com.gradpilot.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.lang.NonNull;

import javax.crypto.SecretKey;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final String jwtSecret;

    public JwtAuthenticationFilter(String jwtSecret) {
        this.jwtSecret = jwtSecret;
    }

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            String token = authHeader.substring(7);
            SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes());
            System.out.println("JWT Secret length: " + jwtSecret.length());

            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            String email = claims.getSubject();
            Number userIdNumber = claims.get("userId", Number.class);
            // Integer userId = userIdNumber != null ? userIdNumber.intValue() : null;
            String userType = claims.get("userType", String.class);
            Integer userId = null;
            if ("MENTOR".equalsIgnoreCase(userType)) {
                Number mentorId = claims.get("mentorId", Number.class);
                userId = mentorId != null ? mentorId.intValue() : null;
            } else {
                Number normalUserId = claims.get("userId", Number.class);
                userId = normalUserId != null ? normalUserId.intValue() : null;
            }

            System.out.println("JWT Token Debug - Email: " + email + ", UserID: " + userId);
            System.out.println("All claims: " + claims);

            if (userId == null) {
                logger.error("User ID not found in token claims");
                filterChain.doFilter(request, response);
                return;
            }

            Map<String, Object> principal = new HashMap<>();
            principal.put("email", email);
            principal.put("userId", userId);
            principal.put("userType", userType);

            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                    principal, null, new ArrayList<>());

            SecurityContextHolder.getContext().setAuthentication(authentication);

        } catch (Exception e) {
            logger.error("Cannot set user authentication: {}", e);
            SecurityContextHolder.clearContext();
        }

        filterChain.doFilter(request, response);
    }

}