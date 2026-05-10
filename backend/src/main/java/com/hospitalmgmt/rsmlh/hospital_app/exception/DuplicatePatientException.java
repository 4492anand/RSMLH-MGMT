package com.hospitalmgmt.rsmlh.hospital_app.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class DuplicatePatientException extends BaseException {
    public DuplicatePatientException(String message) {
        super(message, HttpStatus.CONFLICT);
    }
}