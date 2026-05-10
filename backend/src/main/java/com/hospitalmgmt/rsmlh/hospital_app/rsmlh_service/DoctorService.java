package com.hospitalmgmt.rsmlh.hospital_app.rsmlh_service;

import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.hospitalmgmt.rsmlh.hospital_app.exception.DuplicatePatientException;
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

    public DoctorDTO addDoctor(DoctorDTO dto) {
        log.debug("Adding doctor: {}",  dto);
        if (doctorRepository.existsByPhoneNumber(dto.getPhoneNumber())) {
            log.debug("Duplicate phone number detected: {}", dto.getPhoneNumber());
            throw new DuplicatePatientException(dto.getPhoneNumber());
        }
        Doctor doctor = new Doctor();
        doctor.setFirstName(dto.getFirstName());
        doctor.setLastName(dto.getLastName());
        doctor.setSpecialization(dto.getSpecialization());
        doctor.setPhoneNumber(dto.getPhoneNumber());
        doctor.setEmail(dto.getEmail());
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
        
        doctor = doctorRepository.save(doctor);
        log.debug("Doctor updated successfully: {}", id);
        return toDoctorDTO(doctor);
    }

    private DoctorDTO toDoctorDTO(Doctor doctor) {
        DoctorDTO dto = new DoctorDTO();
        dto.setDoctorId(doctor.getDoctorId());
        dto.setFirstName(doctor.getFirstName());
        dto.setLastName(doctor.getLastName());
        dto.setSpecialization(doctor.getSpecialization());
        dto.setPhoneNumber(doctor.getPhoneNumber());
        return dto;
    }
}