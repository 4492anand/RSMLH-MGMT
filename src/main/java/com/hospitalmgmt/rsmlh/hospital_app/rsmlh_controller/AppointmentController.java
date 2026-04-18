package com.hospitalmgmt.rsmlh.hospital_app.rsmlh_controller;

import java.util.List;

import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.hospitalmgmt.rsmlh.hospital_app.rsmlh_dto.appointment.AppointmentDetailDTO;
import com.hospitalmgmt.rsmlh.hospital_app.rsmlh_dto.appointment.AppointmentSummaryDTO;
import com.hospitalmgmt.rsmlh.hospital_app.rsmlh_dto.appointment.CreateAppointmentDTO;
import com.hospitalmgmt.rsmlh.hospital_app.rsmlh_service.AppointmentService;

@RestController
@RequestMapping("/rsmlhmgmt/appointments")
public class AppointmentController extends BaseController {
    private static final Logger log = LoggerFactory.getLogger(AppointmentController.class);
    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @PostMapping("/schedule")
    public ResponseEntity<AppointmentSummaryDTO> scheduleRSMLHAppointment(@Valid @RequestBody CreateAppointmentDTO dto) {
        log.debug("Scheduling appointment for patient ID: {} with doctor ID: {}", dto.getPatientId(), dto.getDoctorId());
        AppointmentSummaryDTO appointment = appointmentService.scheduleAppointment(dto);
        log.debug("Appointment scheduled successfully with ID: {}", appointment.getAppointmentId());
        return new ResponseEntity<>(appointment, HttpStatus.CREATED);
    }

    @GetMapping("getAppointment/{id}")
    public ResponseEntity<AppointmentDetailDTO> getRSMLHAppointmentById(@PathVariable Long id) {
        log.debug("Fetching appointment details for ID: {}", id);
        AppointmentDetailDTO appointment = appointmentService.getAppointmentDetailsbyId(id);
        return ResponseEntity.ok(appointment);
    }

    @GetMapping("/allAppointments")
    public ResponseEntity<List<AppointmentSummaryDTO>> getAllRMLHAppointments() {
        log.debug("Fetching all appointments");
        List<AppointmentSummaryDTO> appointments = appointmentService.getAllAppointments();
        log.debug("Retrieved {} appointments", appointments.size());
        return ResponseEntity.ok(appointments);
    }

    @PostMapping("/scheduleAppointment")
    public ResponseEntity<AppointmentSummaryDTO> scheduleAppointment(@Validated @RequestBody CreateAppointmentDTO dto) {
        log.debug("Scheduling appointment for patient ID: {} with doctor ID: {}", dto.getPatientId(), dto.getDoctorId());
        AppointmentSummaryDTO summary = appointmentService.scheduleAppointment(dto);
        log.debug("Appointment scheduled with ID: {}", summary.getAppointmentId());
        return ResponseEntity.ok(summary);
    }

    @PutMapping("updateappointment/{id}")  
    public ResponseEntity<String> completeAppointment(
        @RequestParam("appointmentId") Long appointmentId,
        @RequestParam("diagnosis") String diagnosis,
        @RequestParam("treatment") String treatment,
        @RequestParam("prescriptions") String prescriptions,
        @RequestParam("testResults") String testResults,
        @RequestParam("followUpInstructions") String followUpInstructions) {
        log.debug("Updating appointment ID: {} with diagnosis: {}", appointmentId, diagnosis);
        appointmentService.updateAppointment(appointmentId, diagnosis, treatment, prescriptions, testResults, followUpInstructions);
        log.debug("Appointment updated successfully: {}", appointmentId);
        return ResponseEntity.ok("Appointment completed successfully.");
    }
}