package com.hospitalmgmt.rsmlh.hospital_app.rsmlh_controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.hospitalmgmt.rsmlh.hospital_app.rsmlh_dto.AppointmentDetailDTO;
import com.hospitalmgmt.rsmlh.hospital_app.rsmlh_dto.AppointmentSummaryDTO;
import com.hospitalmgmt.rsmlh.hospital_app.rsmlh_dto.CreateAppointmentDTO;
import com.hospitalmgmt.rsmlh.hospital_app.rsmlh_service.AppointmentService;

import java.util.List;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {
    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @PostMapping
    public ResponseEntity<AppointmentSummaryDTO> scheduleAppointment(@RequestBody CreateAppointmentDTO dto) {
        AppointmentSummaryDTO appointment = appointmentService.scheduleAppointment(dto);
        return new ResponseEntity<>(appointment, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AppointmentDetailDTO> getAppointmentById(@PathVariable Long id) {
        try {
            AppointmentDetailDTO appointment = appointmentService.getAppointmentDetails(id);
            return ResponseEntity.ok(appointment);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
/*   @GetMapping
    public ResponseEntity<List<AppointmentSummaryDTO>> getAllAppointments() {
        List<AppointmentSummaryDTO> appointments = appointmentService.getAllAppointments();
        return ResponseEntity.ok(appointments);
    }

    
     @PutMapping("/{id}")
    public ResponseEntity<AppointmentDetailDTO> completeAppointment(@PathVariable Long id, @RequestBody CompleteAppointmentDTO dto) {
        AppointmentDetailDTO updatedAppointment = appointmentService.completeAppointment(id, dto);
        return ResponseEntity.ok(updatedAppointment);
    } */
  
}