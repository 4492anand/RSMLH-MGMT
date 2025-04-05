package com.hospitalmgmt.rsmlh.hospital_app.rsmlh_service;

import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.hospitalmgmt.rsmlh.hospital_app.exception.DuplicatePatientException;
import com.hospitalmgmt.rsmlh.hospital_app.rsmlh_dto.DoctorDTO;
import com.hospitalmgmt.rsmlh.hospital_app.rsmlh_entity.Doctor;
import com.hospitalmgmt.rsmlh.hospital_app.rsmlh_repository.DoctorRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DoctorService {
    private final DoctorRepository doctorRepository;
    private static final Logger logger = LoggerFactory.getLogger(DoctorService.class);

    // Constructor injection for DoctorRepository
    public DoctorService(DoctorRepository doctorRepository) {
        this.doctorRepository = doctorRepository;
    }

    public DoctorDTO addDoctor(String firstName, 
    String lastName, String specialization,
    String phoneNumber, String email)
    {
        // Check if a doctor with the same phone number already exists
        if (doctorRepository.existsByPhoneNumber(phoneNumber)) {
            throw new DuplicatePatientException(phoneNumber);
        }
    // Create a new Doctor entity
        Doctor doctor = new Doctor();
        doctor.setFirstName(firstName);
        doctor.setLastName(lastName);
        doctor.setSpecialization(specialization);
        doctor.setPhoneNumber(phoneNumber);
        doctor.setEmail(email);

        // Save the doctor to the database
        doctor = doctorRepository.save(doctor);
        logger.debug("doctor-repo {}", doctor);

        // Map the saved Doctor entity to a DoctorDTO
        DoctorDTO doctorDTO = new DoctorDTO();
        doctorDTO.setDoctorId(doctor.getDoctorId());
        doctorDTO.setFirstName(doctor.getFirstName());
        doctorDTO.setLastName(doctor.getLastName());
        doctorDTO.setSpecialization(doctor.getSpecialization());
        doctorDTO.setPhoneNumber(doctor.getPhoneNumber());
        logger.debug("doctor-dto {}", doctorDTO);
        return doctorDTO;
    }

    public DoctorDTO getDoctorById(Long id) {
        // Fetch the doctor from the database
        Doctor doctor = doctorRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Doctor not found"));

        // Map the Doctor entity to a DoctorDTO
        DoctorDTO dto = new DoctorDTO();
        dto.setDoctorId(doctor.getDoctorId());
        dto.setFirstName(doctor.getFirstName());
        dto.setLastName(doctor.getLastName());
        dto.setSpecialization(doctor.getSpecialization());
        dto.setPhoneNumber(doctor.getPhoneNumber());

        return dto;
    }

    public List<DoctorDTO> getAllDoctors() {
        // Fetch all doctors and map them to DoctorDTOs
        return doctorRepository.findAll().stream().map(doctor -> {
            DoctorDTO dto = new DoctorDTO();
            dto.setDoctorId(doctor.getDoctorId());
            dto.setFirstName(doctor.getFirstName());
            dto.setLastName(doctor.getLastName());
            dto.setSpecialization(doctor.getSpecialization());
            dto.setPhoneNumber(doctor.getPhoneNumber());
            return dto;
        }).collect(Collectors.toList());
    }
}