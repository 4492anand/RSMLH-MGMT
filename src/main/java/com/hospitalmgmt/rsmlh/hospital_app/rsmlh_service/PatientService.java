package com.hospitalmgmt.rsmlh.hospital_app.rsmlh_service;

import java.time.LocalDate;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hospitalmgmt.rsmlh.hospital_app.exception.DuplicatePatientException;
import com.hospitalmgmt.rsmlh.hospital_app.exception.PatientNotFoundException;
import com.hospitalmgmt.rsmlh.hospital_app.exception.ValidationException;
import com.hospitalmgmt.rsmlh.hospital_app.rsmlh_dto.patient.PatientDTO;
import com.hospitalmgmt.rsmlh.hospital_app.rsmlh_dto.patient.UpdatePatientDTO;
import com.hospitalmgmt.rsmlh.hospital_app.rsmlh_entity.Patient;
import com.hospitalmgmt.rsmlh.hospital_app.rsmlh_repository.PatientRepository;

@Service
public class PatientService {
    private static final Logger log = LoggerFactory.getLogger(PatientService.class);

    private final PatientRepository patientRepository;
    public PatientService(PatientRepository patientRepository) {
        this.patientRepository = patientRepository;
    }

    @Transactional
    public PatientDTO registerPatient(String firstName, String lastName, LocalDate dateOfBirth,
    String gender, String address, String phoneNumber, String email, String emergencyContact) {
        if (patientRepository.existsByFirstNameAndLastNameAndDateOfBirth(firstName, lastName, dateOfBirth)) {
            throw new DuplicatePatientException("Patient already exists with the same name and date of birth");
        }
        if (patientRepository.existsByEmail(email)) {
            throw new DuplicatePatientException("Email already registered: " + email);
        }
        if (patientRepository.existsByPhoneNumber(phoneNumber)) {
            throw new DuplicatePatientException("Phone number already registered: " + phoneNumber);
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

        if (dto.getFirstName() != null || dto.getLastName() != null || dto.getDateOfBirth() != null) {
            String firstName = dto.getFirstName() != null ? dto.getFirstName() : patient.getFirstName();
            String lastName = dto.getLastName() != null ? dto.getLastName() : patient.getLastName();
            LocalDate dateOfBirth = dto.getDateOfBirth() != null ? dto.getDateOfBirth() : patient.getDateOfBirth();
            
            List<Patient> existingPatients = patientRepository.findByFirstNameAndLastNameAndDateOfBirth(firstName, lastName, dateOfBirth);
            if (!existingPatients.isEmpty() && existingPatients.stream().anyMatch(p -> !p.getPatientId().equals(id))) {
                throw new DuplicatePatientException("Another patient already exists with the same name and date of birth");
            }
            
            patient.setFirstName(firstName);
            patient.setLastName(lastName);
            patient.setDateOfBirth(dateOfBirth);
        }
        
        if (dto.getEmail() != null) {
            patientRepository.findByEmail(dto.getEmail()).ifPresent(existingPatient -> {
                if (!existingPatient.getPatientId().equals(id)) {
                    throw new DuplicatePatientException("Email already registered: " + dto.getEmail());
                }
            });
            patient.setEmail(dto.getEmail());
        }
        
        if (dto.getPhoneNumber() != null) {
            patientRepository.findByPhoneNumber(dto.getPhoneNumber()).ifPresent(existingPatient -> {
                if (!existingPatient.getPatientId().equals(id)) {
                    throw new DuplicatePatientException("Phone number already registered: " + dto.getPhoneNumber());
                }
            });
            patient.setPhoneNumber(dto.getPhoneNumber());
        }
        
        if (dto.getGender() != null) patient.setGender(dto.getGender());
        if (dto.getAddress() != null) patient.setAddress(dto.getAddress());
        if (dto.getEmergencyContact() != null) patient.setEmergencyContact(dto.getEmergencyContact());

        return toPatientDTO(patientRepository.save(patient));
    }

    @Transactional
    public void deletePatient(Long id) {
        if (!patientRepository.existsById(id)) {
            throw new PatientNotFoundException("Patient not found with ID: " + id);
        }
        patientRepository.deleteById(id);
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



