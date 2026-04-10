package com.hospitalmgmt.rsmlh.hospital_app.rsmlh_service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;

import com.hospitalmgmt.rsmlh.hospital_app.exception.DuplicatePatientException;
import com.hospitalmgmt.rsmlh.hospital_app.rsmlh_dto.PatientDTO;
import com.hospitalmgmt.rsmlh.hospital_app.rsmlh_entity.Patient;
import com.hospitalmgmt.rsmlh.hospital_app.rsmlh_repository.PatientRepository;

@Service
public class PatientService {

    public final PatientRepository patientRepository;
    public PatientService(PatientRepository patientRepository) {
        this.patientRepository = patientRepository;
    }

    public PatientDTO registerPatient(String firstName, String lastName, LocalDate dateOfBirth,
    String gender, String phoneNumber, String email, String emergencyContact) {
        if (patientRepository.existsByFirstNameAndLastNameAndDateOfBirth(firstName, lastName, dateOfBirth)) {
            throw new DuplicatePatientException("Patient/s already exists!");
        }
        Patient patient = new Patient();
        patient.setFirstName(firstName);
        patient.setLastName(lastName);
        patient.setDateOfBirth(dateOfBirth);
        patient.setGender(gender);
        patient.setPhoneNumber(phoneNumber);
        patient.setEmail(email);
        patient.setEmergencyContact(emergencyContact);
        return toPatientDTO(patientRepository.save(patient));
    }

    // returns full dto based on patient ID

    public PatientDTO getPatientById(Long id) {
        return toPatientDTO(patientRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Patient not found")));
    }

    public List<PatientDTO> getAllPatients() {
        return patientRepository.findAll().stream().map(this::toPatientDTO).toList();
    }

    public PatientDTO updatePatient(Long id, String firstName, String lastName, LocalDate dateOfBirth,
                                   String gender, String address, String phoneNumber, String email,
                                   String emergencyContact) {
        // Find the patient
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        List<Patient> existingPatients = patientRepository.findByFirstNameAndLastNameAndDateOfBirth(
                firstName, lastName, dateOfBirth
        );
        if (!existingPatients.isEmpty() && existingPatients.stream().noneMatch(p -> p.getPatientId().equals(id))) {
            throw new DuplicatePatientException("Another patient already exists with the same first name, last name, and date of birth.");
        }

        // Update patient fields
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



