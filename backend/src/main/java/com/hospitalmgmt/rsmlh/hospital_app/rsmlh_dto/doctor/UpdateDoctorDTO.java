package com.hospitalmgmt.rsmlh.hospital_app.rsmlh_dto.doctor;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class UpdateDoctorDTO {

    @Pattern(regexp = "^[0-9+\\-() ]{1,20}$", message = "Invalid phone number format. Must be 1-20 characters")
    private String phoneNumber;

    @Email(message = "Invalid email format")
    private String email;
    private String firstName;
    private String lastName;
    private String specialization;
    private String address;
}
