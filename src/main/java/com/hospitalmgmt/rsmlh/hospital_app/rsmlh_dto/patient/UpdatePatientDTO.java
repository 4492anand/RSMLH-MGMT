package com.hospitalmgmt.rsmlh.hospital_app.rsmlh_dto.patient;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class UpdatePatientDTO {
    @NotBlank(message = "First name cannot be blank")
    private String firstName;
    
    @NotBlank(message = "Last name cannot be blank")
    private String lastName;
    
    @Past(message = "Date of birth must be in the past")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate dateOfBirth;
    
    @Pattern(regexp = "^(Male|Female|Other)$", message = "Gender must be Male, Female, or Other")
    private String gender;

    private String address;
    
    @Pattern(regexp = "^[0-9+\\-() ]+$", message = "Invalid phone number format")
    private String phoneNumber;
    
    @Email(message = "Invalid email format")
    private String email;
    
    private String emergencyContact;
}