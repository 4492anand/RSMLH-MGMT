package com.hospitalmgmt.rsmlh.hospital_app.rsmlh_dto.doctor;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class CreateDoctorDTO {

    @NotBlank(message = "First name is required")
    private String firstName;
    
    @NotBlank(message = "Last name is required")
    private String lastName;

    @NotBlank(message = "Gender is required")
    @Pattern(regexp = "^(Male|Female|Other)$", message = "Invalid gender")
    private String gender;

    @NotBlank(message = "Specialization is required")
    @Pattern(regexp = "^(CARDIOLOGY|DERMATOLOGY|EMERGENCY_MEDICINE|ENDOCRINOLOGY|GASTROENTEROLOGY|GENERAL_PRACTICE|GERIATRICS|HEMATOLOGY|INFECTIOUS_DISEASE|INTERNAL_MEDICINE|NEPHROLOGY|NEUROLOGY|OBSTETRICS_AND_GYNECOLOGY|ONCOLOGY|OPHTHALMOLOGY|ORTHOPEDICS|OTOLARYNGOLOGY|PEDIATRICS|PSYCHIATRY|PULMONOLOGY|RADIOLOGY|RHEUMATOLOGY|SURGERY|UROLOGY)$", message = "Invalid specialization")
    private String specialization;
    
    @NotBlank(message = "Phone number is required")
    private String phoneNumber;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    private String address;

}
