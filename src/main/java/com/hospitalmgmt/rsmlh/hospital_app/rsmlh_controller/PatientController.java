package com.hospitalmgmt.rsmlh.hospital_app.rsmlh_controller;
import com.hospitalmgmt.rsmlh.hospital_app.rsmlh_dto.PatientDTO;
import com.hospitalmgmt.rsmlh.hospital_app.rsmlh_service.PatientService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/rsmlhmgmt/patients")
public class PatientController {
    private final PatientService patientService;
    public PatientController(PatientService patientService) {
        this.patientService = patientService;
    }
    

    @PostMapping("/registerPatient")
    public ResponseEntity<PatientDTO> addPatient(
            @RequestParam String firstName,
            @RequestParam String lastName,
            @RequestParam LocalDate dateOfBirth,
            @RequestParam String gender,
            @RequestParam String phoneNumber,
            @RequestParam String email,
            @RequestParam String emergencyContact) {
        PatientDTO patient = patientService.registerPatient(firstName, lastName, dateOfBirth, gender, phoneNumber, email, emergencyContact);
        return new ResponseEntity<>(patient, HttpStatus.CREATED);
    }


    @GetMapping("/patientId/{id}")
    public ResponseEntity<PatientDTO> getPatientById(@PathVariable Long id) {
        try {
            PatientDTO patient = patientService.getPatientById(id);
            return ResponseEntity.ok(patient);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/allPatients")
    public ResponseEntity<List<PatientDTO>> getAllPatients() {
        List<PatientDTO> patients = patientService.getAllPatients();
        return ResponseEntity.ok(patients);
    }

    @PutMapping("/updatePatient/{id}")
    public ResponseEntity<PatientDTO> updatePatient(
            @PathVariable Long id,
            @RequestParam String firstName,
            @RequestParam String lastName,
            @RequestParam LocalDate dateOfBirth,
            @RequestParam String gender,
            @RequestParam String address,
            @RequestParam String phoneNumber,
            @RequestParam String email,
            @RequestParam String emergencyContact) {
        try {   
            PatientDTO updatedPatient = patientService.updatePatient(id,firstName, lastName, dateOfBirth, gender, address, phoneNumber, email, emergencyContact);
            return ResponseEntity.ok(updatedPatient);
        }
        catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }        
}
