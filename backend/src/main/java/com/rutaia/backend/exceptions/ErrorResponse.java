package com.rutaia.backend.exceptions;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.time.LocalDateTime;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ErrorResponse(
        LocalDateTime timestamp,
        int status,
        String message,
        String errorCode,
        Map<String, String> errors
) {
    public ErrorResponse(LocalDateTime timestamp, int status, String message, String errorCode) {
        this(timestamp, status, message, errorCode, null);
    }
}