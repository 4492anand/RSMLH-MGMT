package com.hospitalmgmt.rsmlh.hospital_app.rsmlh_controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.hospitalmgmt.rsmlh.hospital_app.rsmlh_dto.doctor.CreateDoctorDTO;
import com.hospitalmgmt.rsmlh.hospital_app.rsmlh_dto.doctor.DoctorDTO;
import com.hospitalmgmt.rsmlh.hospital_app.rsmlh_dto.doctor.UpdateDoctorDTO;
import com.hospitalmgmt.rsmlh.hospital_app.rsmlh_entity.Specialization;
import com.hospitalmgmt.rsmlh.hospital_app.rsmlh_service.DoctorService;

import jakarta.validation.Valid;

import java.util.Arrays;
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
    public ResponseEntity<DoctorDTO> addDoctor(@Valid @RequestBody CreateDoctorDTO dto) {
        log.debug("Adding new doctor: {}", dto);
        DoctorDTO createdDoctor = doctorService.addDoctor(dto);
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

    @GetMapping("/specializations")
    public ResponseEntity<List<String>> getSpecializations() {
        List<String> specs = Arrays.stream(Specialization.values())
                .map(Specialization::name)
                .toList();
        return ResponseEntity.ok(specs);
    }

    @PutMapping("/updateDoctor/{id}")
    public ResponseEntity<DoctorDTO> updateDoctor(
            @PathVariable Long id,
            @Valid @RequestBody UpdateDoctorDTO updateDTO) {
        log.debug("Updating doctor with ID: {}", id);
        DoctorDTO updatedDoctor = doctorService.updateDoctor(id, updateDTO);
        log.debug("Doctor updated successfully: {}", id);
        return ResponseEntity.ok(updatedDoctor);
    }
}