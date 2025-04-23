package com.hospitalmgmt.rsmlh.hospital_app.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

// File: src/main/java/com/hospitalmgmt/rsmlh/hospital_app/exception/DuplicatePatientException.java
@ResponseStatus(HttpStatus.CONFLICT)
public class DuplicatePatientException extends RuntimeException {
    public DuplicatePatientException(String message) {
        super(message);
    }

    public DuplicatePatientException(String message, Throwable cause) {
        super(message, cause);
    }
}

@ResponseStatus(HttpStatus.NOT_FOUND)
class PatientNotFoundException extends RuntimeException {
    public PatientNotFoundException(String message) {
        super(message);
    }

    public PatientNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}