package com.hospitalmgmt.rsmlh.hospital_app.rsmlh_service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hospitalmgmt.rsmlh.hospital_app.exception.DuplicatePatientException;
import com.hospitalmgmt.rsmlh.hospital_app.exception.PatientNotFoundException;
import com.hospitalmgmt.rsmlh.hospital_app.rsmlh_dto.PatientDTO;
import com.hospitalmgmt.rsmlh.hospital_app.rsmlh_dto.UpdatePatientDTO;
import com.hospitalmgmt.rsmlh.hospital_app.rsmlh_entity.Patient;
import com.hospitalmgmt.rsmlh.hospital_app.rsmlh_repository.PatientRepository;

@Service
public class PatientService {

    public final PatientRepository patientRepository;
    public PatientService(PatientRepository patientRepository) {
        this.patientRepository = patientRepository;
    }

    @Transactional
    public PatientDTO registerPatient(String firstName, String lastName, LocalDate dateOfBirth,
    String gender, String address, String phoneNumber, String email, String emergencyContact) {
        if (firstName == null || firstName.trim().isEmpty()) {
            throw new IllegalArgumentException("First name is required");
        }
        if (lastName == null || lastName.trim().isEmpty()) {
            throw new IllegalArgumentException("Last name is required");
        }
        if (dateOfBirth == null) {
            throw new IllegalArgumentException("Date of birth is required");
        }
        if (phoneNumber == null || phoneNumber.trim().isEmpty()) {
            throw new IllegalArgumentException("Phone number is required");
        }
        if (email == null || email.trim().isEmpty()) {
            throw new IllegalArgumentException("Email is required");
        }
        
        if (patientRepository.existsByFirstNameAndLastNameAndDateOfBirth(firstName, lastName, dateOfBirth)) {
            throw new DuplicatePatientException("Patient already exists with the same name and date of birth");
        }
        
        Patient patient = new Patient();
        patient.setFirstName(firstName);
        patient.setLastName(lastName);
        patient.setDateOfBirth(dateOfBirth);
        patient.setGender(gender);
        patient.setAddress(address);
        patient.setPhoneNumber(phoneNumber);
        patient.setEmail(email);
        patient.setEmergencyContact(emergencyContact);
        return toPatientDTO(patientRepository.save(patient));
    }

    // returns full dto based on patient ID

    public PatientDTO getPatientById(Long id) {
        return toPatientDTO(patientRepository.findById(id)
            .orElseThrow(() -> new PatientNotFoundException("Patient not found with ID: " + id)));
    }

    public List<PatientDTO> getAllPatients() {
        return patientRepository.findAll().stream().map(this::toPatientDTO).toList();
    }

    @Transactional
    public PatientDTO updatePatient(Long id, UpdatePatientDTO dto) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new PatientNotFoundException("Patient not found with ID: " + id));

        if (dto.getFirstName() != null) patient.setFirstName(dto.getFirstName());
        if (dto.getLastName() != null) patient.setLastName(dto.getLastName());
        if (dto.getDateOfBirth() != null) patient.setDateOfBirth(dto.getDateOfBirth());
        if (dto.getGender() != null) patient.setGender(dto.getGender());
        if (dto.getAddress() != null) patient.setAddress(dto.getAddress());
        if (dto.getPhoneNumber() != null) patient.setPhoneNumber(dto.getPhoneNumber());
        if (dto.getEmail() != null) patient.setEmail(dto.getEmail());
        if (dto.getEmergencyContact() != null) patient.setEmergencyContact(dto.getEmergencyContact());

        return toPatientDTO(patientRepository.save(patient));
    }

    private PatientDTO toPatientDTO(Patient patient) {
        PatientDTO dto = new PatientDTO();
        dto.setPatientId(patient.getPatientId());
        dto.setFirstName(patient.getFirstName());
        dto.setLastName(patient.getLastName());
        dto.setDateOfBirth(patient.getDateOfBirth());
        dto.setGender(patient.getGender());
        dto.setAddress(patient.getAddress());
        dto.setPhoneNumber(patient.getPhoneNumber());
        dto.setEmail(patient.getEmail());
        dto.setEmergencyContact(patient.getEmergencyContact());
        return dto;
    }


}



