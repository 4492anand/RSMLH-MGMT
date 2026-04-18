package com.hospitalmgmt.rsmlh.hospital_app.rsmlh_controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.hospitalmgmt.rsmlh.hospital_app.rsmlh_dto.doctor.DoctorDTO;
import com.hospitalmgmt.rsmlh.hospital_app.rsmlh_service.DoctorService;

import java.util.List;

@RestController
@RequestMapping("/rsmlhmgmt/doctors")
public class DoctorController extends BaseController {
    private static final Logger log = LoggerFactory.getLogger(DoctorController.class);

    private final DoctorService doctorService;
    public DoctorController(DoctorService doctorService) {
        this.doctorService = doctorService;
    }

    @PostMapping("/addDoctor")
    public ResponseEntity<DoctorDTO> addDoctor(
            @RequestParam String firstName,
            @RequestParam String lastName,
            @RequestParam String specialization,
            @RequestParam String phoneNumber,
            @RequestParam String email) {
        log.debug("Adding new doctor: {} {}, specialization: {}", firstName, lastName, specialization);
        DoctorDTO createdDoctor = doctorService.addDoctor(firstName, lastName, specialization, phoneNumber, email);
        log.debug("Doctor added successfully with ID: {}", createdDoctor.getDoctorId());
        return new ResponseEntity<>(createdDoctor, HttpStatus.CREATED);
    }

    @GetMapping("/doctorId/{id}")
    public ResponseEntity<DoctorDTO> getDoctorById(@PathVariable Long id) {
        log.debug("Fetching doctor with ID: {}", id);
        DoctorDTO doctor = doctorService.getDoctorById(id);
        return ResponseEntity.ok(doctor);
    } 
    
    @GetMapping("/getAllDoctors")
    public ResponseEntity<List<DoctorDTO>> getAllDoctors() {
        log.debug("Fetching all doctors");
        List<DoctorDTO> doctors = doctorService.getAllDoctors();
        log.debug("Retrieved {} doctors", doctors.size());
        return new ResponseEntity<>(doctors, HttpStatus.OK);
    }
}