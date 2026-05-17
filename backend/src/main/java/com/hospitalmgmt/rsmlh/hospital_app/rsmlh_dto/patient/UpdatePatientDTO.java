package com.hospitalmgmt.rsmlh.hospital_app.rsmlh_dto.patient;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class UpdatePatientDTO {
    
    @Pattern(regexp = "^[0-9+\\-() ]{1,20}$", message = "Invalid phone number format. Must be 1-20 characters")
    private String phoneNumber;
    @Email(message = "Invalid email format")
    private String email;
    @Pattern(regexp = "^[0-9]{10}$", message = "Emergency contact must be 10 digits")
    private String emergencyNumber;
    private String address;
}