package com.rutaia.backend.exceptions;

public class EmailAlreadyExistsException extends RuntimeException {
    public EmailAlreadyExistsException() { super("El correo ya está registrado"); }
}