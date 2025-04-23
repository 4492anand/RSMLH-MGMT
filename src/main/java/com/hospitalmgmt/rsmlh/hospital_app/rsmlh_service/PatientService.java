package com.hospitalmgmt.rsmlh.hospital_app.rsmlh_service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import java.util.Optional;
import org.springframework.stereotype.Service;

import com.hospitalmgmt.rsmlh.hospital_app.exception.DuplicatePatientException;
import com.hospitalmgmt.rsmlh.hospital_app.exception.GlobalExceptionHandler;
import com.hospitalmgmt.rsmlh.hospital_app.rsmlh_dto.CreatePatientDTO;
import com.hospitalmgmt.rsmlh.hospital_app.rsmlh_dto.PatientDTO;
import com.hospitalmgmt.rsmlh.hospital_app.rsmlh_entity.Patient;
import com.hospitalmgmt.rsmlh.hospital_app.rsmlh_repository.PatientRepository;

@Service
public class PatientService {

    public final PatientRepository patientRepository;
    public PatientService(PatientRepository patientRepository) {
        this.patientRepository = patientRepository;
    }

    public PatientDTO registerPatient(String firstName,String lastName,LocalDate dateOfBirth,
    String gender,String phoneNumber,String email,String emergencyContact) {
        CreatePatientDTO dto = new CreatePatientDTO();
        List<Patient> existingPatients = patientRepository.findByFirstNameAndLastNameAndDateOfBirth(
        dto.getFirstName(),
        dto.getLastName(),
        dto.getDateOfBirth()
    );
    if (!existingPatients.isEmpty()) {
        throw new DuplicatePatientException("Patient/s already exists!");
    }
        Patient patient = new Patient();
        patient.setFirstName(dto.getFirstName());
        patient.setLastName(dto.getLastName());
        patient.setDateOfBirth(dto.getDateOfBirth());
        patient.setGender(dto.getGender());
        patient.setAddress(dto.getAddress());
        patient.setPhoneNumber(dto.getPhoneNumber());
        patient.setEmail(dto.getEmail());
        patient.setEmergencyContact(dto.getEmergencyContact());
        patient = patientRepository.save(patient);

        PatientDTO patientDTO = new PatientDTO();
        patientDTO.setPatientId(patient.getPatientId());
        patientDTO.setFirstName(patient.getFirstName());
        patientDTO.setLastName(patient.getLastName());
        patientDTO.setDateOfBirth(patient.getDateOfBirth());
        patientDTO.setGender(patient.getGender());
        patientDTO.setPhoneNumber(patient.getPhoneNumber());
        patientDTO.setEmail(patient.getEmail());
        patientDTO.setEmergencyContact(patient.getEmergencyContact());
        return patientDTO;
    }

    public PatientDTO getPatientById(Long id) {
        Patient patient = patientRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Patient not found"));
        PatientDTO dto = new PatientDTO();
        dto.setPatientId(patient.getPatientId());
        dto.setFirstName(patient.getFirstName());
        dto.setLastName(patient.getLastName());
        dto.setDateOfBirth(patient.getDateOfBirth());
        dto.setGender(patient.getGender());
        dto.setPhoneNumber(patient.getPhoneNumber());
        return dto;
    }

    public List<PatientDTO> getAllPatients() {
        return patientRepository.findAll().stream().map(patient -> {
            PatientDTO dto = new PatientDTO();
            dto.setPatientId(patient.getPatientId());
            dto.setFirstName(patient.getFirstName());
            dto.setLastName(patient.getLastName());
            dto.setDateOfBirth(patient.getDateOfBirth());
            dto.setGender(patient.getGender());
            dto.setPhoneNumber(patient.getPhoneNumber());
            return dto;
        }).toList();
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

        // Save updated patient
        patient = patientRepository.save(patient);

        // Convert to DTO
        PatientDTO patientDTO = new PatientDTO();
        patientDTO.setPatientId(patient.getPatientId());
        patientDTO.setFirstName(patient.getFirstName());
        patientDTO.setLastName(patient.getLastName());
        patientDTO.setDateOfBirth(patient.getDateOfBirth());
        patientDTO.setGender(patient.getGender());
        patientDTO.setAddress(patient.getAddress());
        patientDTO.setPhoneNumber(patient.getPhoneNumber());
        patientDTO.setEmail(patient.getEmail());
        patientDTO.setEmergencyContact(patient.getEmergencyContact());

        return patientDTO;
    }


}



