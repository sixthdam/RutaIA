package com.rutaia.backend.exceptions;

public class InvalidCredentialsException extends RuntimeException {
    public InvalidCredentialsException() { super("Credenciales inválidas"); }
}
