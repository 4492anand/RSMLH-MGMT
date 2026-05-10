package com.hospitalmgmt.rsmlh.hospital_app.rsmlh_controller;
import com.hospitalmgmt.rsmlh.hospital_app.rsmlh_dto.patient.CreatePatientDTO;
import com.hospitalmgmt.rsmlh.hospital_app.rsmlh_dto.patient.PatientDTO;
import com.hospitalmgmt.rsmlh.hospital_app.rsmlh_dto.patient.UpdatePatientDTO;
import com.hospitalmgmt.rsmlh.hospital_app.rsmlh_service.PatientService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/rsmlhmgmt/patients")
public class PatientController extends BaseController {
    private static final Logger log = LoggerFactory.getLogger(PatientController.class);
    private final PatientService patientService;
    public PatientController(PatientService patientService) {
        this.patientService = patientService;
    }
    

    @PostMapping("/registerPatient")
    public ResponseEntity<PatientDTO> addPatient(@Valid @RequestBody CreatePatientDTO dto) {
        log.debug("Registering new patient: {} {}", dto.getFirstName(), dto.getLastName());
        PatientDTO patient = patientService.registerPatient(dto.getFirstName(), dto.getLastName(), 
                dto.getDateOfBirth(), dto.getGender(), dto.getAddress(), dto.getPhoneNumber(), 
                dto.getEmail(), dto.getEmergencyContact());
        log.debug("Patient registered successfully with ID: {}", patient.getPatientId());
        return new ResponseEntity<>(patient, HttpStatus.CREATED);
    }

    @GetMapping("/patientId/{id}")
    public ResponseEntity<PatientDTO> getPatientById(@PathVariable Long id) {
        log.debug("Fetching patient with ID: {}", id);
        PatientDTO patient = patientService.getPatientById(id);
        return ResponseEntity.ok(patient);
    }
    @GetMapping("/allPatients")
    public ResponseEntity<List<PatientDTO>> getAllPatients() {
        log.debug("Fetching all patients");
        List<PatientDTO> patients = patientService.getAllPatients();
        log.debug("Retrieved {} patients", patients.size());
        return ResponseEntity.ok(patients);
    }

    @PutMapping("/updatePatient/{id}")
    public ResponseEntity<PatientDTO> updatePatient(
            @PathVariable Long id,
            @Valid @RequestBody UpdatePatientDTO dto) {
        log.debug("Updating patient with ID: {}", id);
        PatientDTO updated = patientService.updatePatient(id, dto);
        log.debug("Patient updated successfully: {}", id);
        return ResponseEntity.ok(updated);
    }
    @DeleteMapping("/deletePatient/{id}")
    public ResponseEntity<Void> deletePatient(@PathVariable Long id) {
        log.debug("Deleting patient with ID: {}", id);
        patientService.deletePatient(id);
        log.debug("Patient deleted successfully: {}", id);
        return ResponseEntity.noContent().build();
    }
}
