package com.hospitalmgmt.rsmlh.hospital_app.rsmlh_entity;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "patient", uniqueConstraints = {
    @UniqueConstraint(columnNames = {
        "first_name", 
        "last_name", 
        "date_of_birth"
    })
})
@Getter
@Setter
public class Patient {
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Id
    @Column(name = "patient_id")
    private Long patientId;
    @Column(name = "first_name")
    private String firstName;
    @Column(name = "last_name")
    private String lastName;
    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;
    @Column(name="gender")
    private String gender;
    @Column(name = "address")
    private String address;
    @Column(nullable = false,unique = true, name = "phone_number")
    private String phoneNumber;
    @Column(nullable = false, unique = true, name = "email")
    private String email;
    @Column(name = "emergency_contact")
    private String emergencyContact;

}
