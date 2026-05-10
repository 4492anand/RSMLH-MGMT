package com.hospitalmgmt.rsmlh.hospital_app.rsmlh_dto.doctor;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class CreateDoctorDTO {

    @NotBlank(message = "First name is required")
    private String firstName;
    
    @NotBlank(message = "Last name is required")
    private String lastName;
    
    @NotBlank(message = "Specialization is required")
    private String specialization;
    
    @NotBlank(message = "Phone number is required")
    private String phoneNumber;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

}
