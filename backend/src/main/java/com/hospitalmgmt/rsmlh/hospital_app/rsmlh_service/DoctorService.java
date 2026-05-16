package com.hospitalmgmt.rsmlh.hospital_app.rsmlh_service;

import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.hospitalmgmt.rsmlh.hospital_app.exception.DuplicatePatientException;
import com.hospitalmgmt.rsmlh.hospital_app.rsmlh_dto.doctor.CreateDoctorDTO;
import com.hospitalmgmt.rsmlh.hospital_app.rsmlh_dto.doctor.DoctorDTO;
import com.hospitalmgmt.rsmlh.hospital_app.rsmlh_dto.doctor.UpdateDoctorDTO;
import com.hospitalmgmt.rsmlh.hospital_app.rsmlh_entity.Doctor;
import com.hospitalmgmt.rsmlh.hospital_app.rsmlh_repository.DoctorRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DoctorService {
    private final DoctorRepository doctorRepository;
    private static final Logger log = LoggerFactory.getLogger(DoctorService.class);

    public DoctorService(DoctorRepository doctorRepository) {
        this.doctorRepository = doctorRepository;
    }

    public DoctorDTO addDoctor(CreateDoctorDTO dto) {
        log.debug("Adding doctor: {}",  dto);
        if (doctorRepository.existsByPhoneNumber(dto.getPhoneNumber())) {
            log.debug("Duplicate phone number detected: {}", dto.getPhoneNumber());
            throw new DuplicatePatientException(dto.getPhoneNumber());
        }
        Doctor doctor = new Doctor();
        doctor.setFirstName(dto.getFirstName());
        doctor.setLastName(dto.getLastName());
        doctor.setGender(dto.getGender());
        doctor.setSpecialization(dto.getSpecialization());
        doctor.setPhoneNumber(dto.getPhoneNumber());
        doctor.setEmail(dto.getEmail());
        doctor.setAddress(dto.getAddress());
        doctor = doctorRepository.save(doctor);
        log.debug("doctor-repo {}", doctor);
        return toDoctorDTO(doctor);
    }

    public DoctorDTO getDoctorById(Long id) {
        log.debug("Fetching doctor by ID: {}", id);
        Doctor doctor = doctorRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Doctor not found"));
        return toDoctorDTO(doctor);
    }

    public List<DoctorDTO> getAllDoctors() {
        log.debug("Fetching all doctors from database");
        return doctorRepository.findAll().stream().map(this::toDoctorDTO).collect(Collectors.toList());
    }

    public DoctorDTO updateDoctor(Long id, UpdateDoctorDTO updateDTO) {
        log.debug("Updating doctor with ID: {}", id);
        Doctor doctor = doctorRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Doctor not found"));
        
        if (updateDTO.getFirstName() != null) {
            doctor.setFirstName(updateDTO.getFirstName());
        }
        if (updateDTO.getLastName() != null) {
            doctor.setLastName(updateDTO.getLastName());
        }
        if (updateDTO.getPhoneNumber() != null && !updateDTO.getPhoneNumber().equals(doctor.getPhoneNumber())) {
            if (doctorRepository.existsByPhoneNumber(updateDTO.getPhoneNumber())) {
                throw new DuplicatePatientException(updateDTO.getPhoneNumber());
            }
            doctor.setPhoneNumber(updateDTO.getPhoneNumber());
        }
        
        if (updateDTO.getEmail() != null) {
            doctor.setEmail(updateDTO.getEmail());
        }
        if (updateDTO.getAddress() != null) {
            doctor.setAddress(updateDTO.getAddress());
        }
        if (updateDTO.getSpecialization() != null) {
            doctor.setSpecialization(updateDTO.getSpecialization());
        }
        doctor = doctorRepository.save(doctor);
        log.debug("Doctor updated successfully: {}", id);
        return toDoctorDTO(doctor);
    }

    public DoctorDTO deleteDoctor(Long id) {
        log.debug("Deleting doctor with ID: {}", id);
        Doctor doctor = doctorRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Doctor not found"));
        doctorRepository.delete(doctor);
        log.debug("Doctor deleted successfully: {}", id);
        return toDoctorDTO(doctor);
    }

    private DoctorDTO toDoctorDTO(Doctor doctor) {
        DoctorDTO dto = new DoctorDTO();
        dto.setDoctorId(doctor.getDoctorId());
        dto.setFirstName(doctor.getFirstName());
        dto.setLastName(doctor.getLastName());
        dto.setGender(doctor.getGender());
        dto.setSpecialization(doctor.getSpecialization());
        dto.setPhoneNumber(doctor.getPhoneNumber());
        dto.setEmail(doctor.getEmail());
        dto.setAddress(doctor.getAddress());
        return dto;
    }
}