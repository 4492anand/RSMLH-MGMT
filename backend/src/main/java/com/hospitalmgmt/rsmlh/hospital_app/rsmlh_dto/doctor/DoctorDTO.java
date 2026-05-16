package com.hospitalmgmt.rsmlh.hospital_app.rsmlh_dto.doctor;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;


@Data
public class DoctorDTO {

    private Long doctorId;
    
    @NotBlank(message = "First name is required")
    @Size(min = 2, max = 50, message = "First name must be between 2 and 50 characters")
    private String firstName;
    
    @NotBlank(message = "Last name is required")
    @Size(min = 2, max = 50, message = "Last name must be between 2 and 50 characters")
    private String lastName;

    @NotBlank(message = "Gender is required")
    @Pattern(regexp = "^(Male|Female|Other)$", message = "Invalid gender")
    private String gender;
    
    @NotBlank(message = "Specialization is required")
    @Size(min = 2, max = 100, message = "Specialization must be between 2 and 100 characters")
    @Pattern(regexp = "^(CARDIOLOGY|DERMATOLOGY|EMERGENCY_MEDICINE|ENDOCRINOLOGY|GASTROENTEROLOGY|GENERAL_PRACTICE|GERIATRICS|HEMATOLOGY|INFECTIOUS_DISEASE|INTERNAL_MEDICINE|NEPHROLOGY|NEUROLOGY|OBSTETRICS_AND_GYNECOLOGY|ONCOLOGY|OPHTHALMOLOGY|ORTHOPEDICS|OTOLARYNGOLOGY|PEDIATRICS|PSYCHIATRY|PULMONOLOGY|RADIOLOGY|RHEUMATOLOGY|SURGERY|UROLOGY)$", message = "Invalid specialization")
    private String specialization;
    
    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^[0-9+\\-() ]{1,20}$", message = "Invalid phone number format. Must be 1-20 characters")
    private String phoneNumber;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    private String email;
    
    @Size(max = 200, message = "Address must not exceed 200 characters")
    private String address;
}
