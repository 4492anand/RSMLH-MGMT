package com.hospitalmgmt.rsmlh.hospital_app.rsmlh_controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.hospitalmgmt.rsmlh.hospital_app.rsmlh_dto.CreateDoctorDTO;
import com.hospitalmgmt.rsmlh.hospital_app.rsmlh_dto.DoctorDTO;
import com.hospitalmgmt.rsmlh.hospital_app.rsmlh_service.DoctorService;

import java.util.List;

@RestController
@RequestMapping("/api/doctors")
public class DoctorController {

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
        DoctorDTO createdDoctor = doctorService.addDoctor(firstName, lastName, specialization, phoneNumber, email);
        return new ResponseEntity<>(createdDoctor, HttpStatus.CREATED);
    }

    @GetMapping("/doctorId/{id}")
    public ResponseEntity<DoctorDTO> getDoctorById(@PathVariable Long id) {
        try {
            DoctorDTO doctor = doctorService.getDoctorById(id);
            return new ResponseEntity<>(doctor, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    } 
    
    @GetMapping("/getAllDoctors")
    public ResponseEntity<List<DoctorDTO>> getAllDoctors() {
        List<DoctorDTO> doctors = doctorService.getAllDoctors();
        return new ResponseEntity<>(doctors, HttpStatus.OK);
    }
}
