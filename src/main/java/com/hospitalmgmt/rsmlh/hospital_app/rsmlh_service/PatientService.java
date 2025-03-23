package com.hospitalmgmt.rsmlh.hospital_app.rsmlh_service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.hospitalmgmt.rsmlh.hospital_app.rsmlh_dto.CreatePatientDTO;
import com.hospitalmgmt.rsmlh.hospital_app.rsmlh_dto.PatientDTO;
import com.hospitalmgmt.rsmlh.hospital_app.rsmlh_entity.Patient;
import com.hospitalmgmt.rsmlh.hospital_app.rsmlh_repository.PatientRepository;

@Service
public class PatientService {

    private final PatientRepository patientRepository;

    public PatientService(PatientRepository patientRepository) {
        this.patientRepository = patientRepository;
    }

    public PatientDTO registerPatient(CreatePatientDTO dto) {
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
        }).collect(Collectors.toList());
    }
}