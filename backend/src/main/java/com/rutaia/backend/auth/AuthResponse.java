package com.rutaia.backend.auth;

public record AuthResponse(String token, String role, Integer idUsuario, String experiencia) {}