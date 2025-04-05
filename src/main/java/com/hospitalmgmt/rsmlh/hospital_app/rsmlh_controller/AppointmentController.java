package com.hospitalmgmt.rsmlh.hospital_app.rsmlh_controller;

import java.util.List;
import javax.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.hospitalmgmt.rsmlh.hospital_app.rsmlh_dto.AppointmentDetailDTO;
import com.hospitalmgmt.rsmlh.hospital_app.rsmlh_dto.AppointmentSummaryDTO;
import com.hospitalmgmt.rsmlh.hospital_app.rsmlh_dto.CreateAppointmentDTO;
import com.hospitalmgmt.rsmlh.hospital_app.rsmlh_service.AppointmentService;




@RestController
@RequestMapping("/appointment")
public class AppointmentController {
    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @PostMapping("/schedule")
    public ResponseEntity<AppointmentSummaryDTO> scheduleRSMLHAppointment(@RequestBody CreateAppointmentDTO dto) {
        AppointmentSummaryDTO appointment = appointmentService.scheduleAppointment(dto);
        return new ResponseEntity<>(appointment, HttpStatus.CREATED);
    }

    @GetMapping("getAppointment/{id}")
    public ResponseEntity<AppointmentDetailDTO> getRSMLHAppointmentById(@PathVariable Long id) {
        try {
            AppointmentDetailDTO appointment = appointmentService.getAppointmentDetailsbyId(id);
            return ResponseEntity.ok(appointment);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/allAppointments")
    public ResponseEntity<List<AppointmentSummaryDTO>> getAllRMLHAppointments() {
        List<AppointmentSummaryDTO> appointments = appointmentService.getAllAppointments();
        return ResponseEntity.ok(appointments);
    }

    @PostMapping("/scheduleAppointment")
    public ResponseEntity<AppointmentSummaryDTO> scheduleAppointment(@Valid @RequestBody CreateAppointmentDTO dto) {
        AppointmentSummaryDTO summary = appointmentService.scheduleAppointment(dto);
        return ResponseEntity.ok(summary);
    }

// update appointment details
    @PutMapping("updateappointment/{id}")  
    public ResponseEntity<String> completeAppointment(
        @RequestParam("appointmentId") Long appointmentId,
        @RequestParam("diagnosis") String diagnosis,
        @RequestParam("treatment") String treatment,
        @RequestParam("prescriptions") String prescriptions,
        @RequestParam("testResults") String testResults,
        @RequestParam("followUpInstructions") String followUpInstructions) {
    try {
        appointmentService.updateAppointment(appointmentId, diagnosis, treatment, prescriptions, testResults, followUpInstructions);
        return ResponseEntity.ok("Appointment completed successfully.");
    } catch (RuntimeException e) {
        return ResponseEntity.status(404).body(e.getMessage()); // Return 404 if appointment not found
    }
    }
}