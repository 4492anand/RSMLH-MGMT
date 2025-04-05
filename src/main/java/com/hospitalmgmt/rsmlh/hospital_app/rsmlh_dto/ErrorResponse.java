package com.hospitalmgmt.rsmlh.hospital_app.rsmlh_dto;

public class ErrorResponse {
    private int status;
    private String error;
    private String message;

    // Add this constructor manually
    public ErrorResponse(int status, String error, String message) {
        this.status = status;
        this.error = error;
        this.message = message;
    }

    public ErrorResponse() {
    }

    // Getters and Setters (or use Lombok @Data)
    public int getStatus() { return status; }
    public String getError() { return error; }
    public String getMessage() { return message; }
}