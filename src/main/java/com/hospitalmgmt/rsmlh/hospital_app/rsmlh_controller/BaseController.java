package com.hospitalmgmt.rsmlh.hospital_app.rsmlh_controller;

import com.hospitalmgmt.rsmlh.hospital_app.exception.BaseException;
import com.hospitalmgmt.rsmlh.hospital_app.exception.ErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.stream.Collectors;

public abstract class BaseController {

    @ExceptionHandler(BaseException.class)
    public ResponseEntity<ErrorResponse> handleBaseException(BaseException ex) {
        ErrorResponse error = new ErrorResponse(
                ex.getStatus().value(),
                ex.getStatus().getReasonPhrase(),
                ex.getMessage()
        );
        return ResponseEntity.status(ex.getStatus()).body(error);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationException(MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult().getFieldErrors().stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .collect(Collectors.joining(", "));
        ErrorResponse error = new ErrorResponse(
                HttpStatus.BAD_REQUEST.value(),
                "Validation Failed",
                message
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErrorResponse> handleHttpMessageNotReadable(HttpMessageNotReadableException ex) {
        String message = "Invalid request format";
        
        if (ex.getMessage().contains("LocalDate")) {
            message = "Invalid date format. Expected format: yyyy-MM-dd (e.g., 1990-12-31)";
        } else if (ex.getMessage().contains("LocalDateTime")) {
            message = "Invalid date-time format. Expected format: yyyy-MM-dd'T'HH:mm:ss (e.g., 2024-12-31T14:30:00)";
        } else if (ex.getMessage().contains("JSON parse error")) {
            message = "Invalid JSON format. Please check your request body";
        }
        
        ErrorResponse error = new ErrorResponse(
                HttpStatus.BAD_REQUEST.value(),
                "Invalid Request",
                message
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }
}
