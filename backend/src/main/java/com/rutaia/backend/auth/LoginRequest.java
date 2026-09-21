package com.rutaia.backend.auth;

public record LoginRequest(
        String correo,
        String password
) {
}