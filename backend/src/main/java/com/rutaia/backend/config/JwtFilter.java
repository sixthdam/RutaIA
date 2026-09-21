package com.rutaia.backend.config;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Collections;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtFilter extends GenericFilter {

    private final JwtService jwtService;

    @Override
    public void doFilter(ServletRequest request,
                         ServletResponse response,
                         FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest http = (HttpServletRequest) request;
        String header = http.getHeader("Authorization");

        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            String username = jwtService.validateToken(token);

            if (username != null) {
                // Extraemos el rol que venía dentro del token
                String role = jwtService.extractRole(token);

                // Convertimos el rol en una autoridad reconocida por Spring Security (ej: "ROLE_ESTUDIANTE" o "ROLE_ADMIN")
                UsernamePasswordAuthenticationToken auth = getAuth(role, username);

                SecurityContextHolder.getContext().setAuthentication(auth);
            }
        }
        chain.doFilter(request, response);
    }

    private static @NonNull UsernamePasswordAuthenticationToken getAuth(String role, String username) {
        List<SimpleGrantedAuthority> authorities = Collections.emptyList();
        if (role != null) {
            authorities = List.of(new SimpleGrantedAuthority("ROLE_" + role));
        }

        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(
                        username,
                        null,
                        authorities // <--- Aquí ya van los roles reales
                );
        return auth;
    }
}