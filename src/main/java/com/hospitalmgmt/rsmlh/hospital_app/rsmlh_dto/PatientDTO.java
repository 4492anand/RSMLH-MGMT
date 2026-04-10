package com.hospitalmgmt.rsmlh.hospital_app.rsmlh_dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
@Getter
@Setter
public class PatientDTO {
    private Long patientId;
    private String firstName;
    private String lastName;
    private LocalDate dateOfBirth;
    private String gender;
    private String address;
    private String phoneNumber;
    private String email;
    private String emergencyContact;

    @Override
    public String toString() {
        return "PatientDTO [patientId=" + patientId + ", firstName=" + firstName + ", lastName=" + lastName
                + ", dateOfBirth=" + dateOfBirth + ", gender=" + gender + ", address=" + address + ", phoneNumber="
                + phoneNumber + ", email=" + email + ", emergencyContact=" + emergencyContact + "]";
    }
}
