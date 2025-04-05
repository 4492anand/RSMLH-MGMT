package com.hospitalmgmt.rsmlh.hospital_app.rsmlh_service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import com.hospitalmgmt.rsmlh.hospital_app.rsmlh_dto.AppointmentDetailDTO;
import com.hospitalmgmt.rsmlh.hospital_app.rsmlh_dto.AppointmentSummaryDTO;
import com.hospitalmgmt.rsmlh.hospital_app.rsmlh_dto.CreateAppointmentDTO;
import com.hospitalmgmt.rsmlh.hospital_app.rsmlh_dto.DoctorDTO;
import com.hospitalmgmt.rsmlh.hospital_app.rsmlh_dto.PatientDTO;
import com.hospitalmgmt.rsmlh.hospital_app.rsmlh_entity.Appointment;
import com.hospitalmgmt.rsmlh.hospital_app.rsmlh_entity.Doctor;
import com.hospitalmgmt.rsmlh.hospital_app.rsmlh_entity.Patient;
import com.hospitalmgmt.rsmlh.hospital_app.rsmlh_repository.AppointmentRepository;
import com.hospitalmgmt.rsmlh.hospital_app.rsmlh_repository.DoctorRepository;
import com.hospitalmgmt.rsmlh.hospital_app.rsmlh_repository.PatientRepository;

@Service
public class AppointmentService {
    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;

    public AppointmentService(AppointmentRepository appointmentRepository,
        PatientRepository patientRepository,
        DoctorRepository doctorRepository) {
        this.appointmentRepository = appointmentRepository;
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
    }

    public AppointmentSummaryDTO scheduleAppointment(CreateAppointmentDTO dto) {
        Patient patient = patientRepository.findById(dto.getPatientId())
            .orElseThrow(() -> new RuntimeException("Patient not found"));
        Doctor doctor = doctorRepository.findById(dto.getDoctorId())
            .orElseThrow(() -> new RuntimeException("Doctor not found"));

        Appointment appointment = new Appointment();
        appointment.setPatient(patient);
        appointment.setDoctor(doctor);
        appointment.setAppointmentDateTime(dto.getAppointmentDateTime());
        appointment.setReasonForVisit(dto.getReasonForVisit());
        appointment.setStatus("scheduled");
        appointment = appointmentRepository.save(appointment);

        AppointmentSummaryDTO summaryDTO = new AppointmentSummaryDTO();
        summaryDTO.setAppointmentId(appointment.getAppointmentId());
        summaryDTO.setPatientName(patient.getFirstName() + " " + patient.getLastName());
        summaryDTO.setDoctorName(doctor.getFirstName() + " " + doctor.getLastName());
        summaryDTO.setAppointmentDateTime(appointment.getAppointmentDateTime());
        summaryDTO.setStatus(appointment.getStatus());
        return summaryDTO;
    }

    public Appointment updateAppointment(Long appointmentId, String diagnosis, String treatment,
        String prescriptions, String testResults, String followUpInstructions) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
            .orElseThrow(() -> new RuntimeException("Appointment not found"));
        appointment.setStatus("completed");
        appointment.setDiagnosis(diagnosis);
        appointment.setTreatment(treatment);
        appointment.setPrescriptions(prescriptions);
        appointment.setTestResults(testResults);
        appointment.setFollowUpInstructions(followUpInstructions);
        appointmentRepository.save(appointment);
        return appointment;
    }


    public AppointmentDetailDTO getAppointmentDetailsbyId(Long id) {
        Appointment appointment = appointmentRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Appointment not found"));
        AppointmentDetailDTO dto = new AppointmentDetailDTO();
        dto.setAppointmentId(appointment.getAppointmentId());
        // Map Patient to PatientDTO
        PatientDTO patientDTO = new PatientDTO();
        patientDTO.setPatientId(appointment.getPatient().getPatientId());
        patientDTO.setFirstName(appointment.getPatient().getFirstName());
        patientDTO.setLastName(appointment.getPatient().getLastName());
        patientDTO.setDateOfBirth(appointment.getPatient().getDateOfBirth());
        patientDTO.setGender(appointment.getPatient().getGender());
        patientDTO.setPhoneNumber(appointment.getPatient().getPhoneNumber());
        dto.setPatient(patientDTO);
        // Map Doctor to DoctorDTO
        DoctorDTO doctorDTO = new DoctorDTO();
        doctorDTO.setDoctorId(appointment.getDoctor().getDoctorId());
        doctorDTO.setFirstName(appointment.getDoctor().getFirstName());
        doctorDTO.setLastName(appointment.getDoctor().getLastName());
        doctorDTO.setSpecialization(appointment.getDoctor().getSpecialization());
        doctorDTO.setPhoneNumber(appointment.getDoctor().getPhoneNumber());
        dto.setDoctor(doctorDTO);
        // Other fields
        dto.setAppointmentDateTime(appointment.getAppointmentDateTime());
        dto.setStatus(appointment.getStatus());
        dto.setReasonForVisit(appointment.getReasonForVisit());
        dto.setDiagnosis(appointment.getDiagnosis());
        dto.setTreatment(appointment.getTreatment());
        dto.setPrescriptions(appointment.getPrescriptions());
        dto.setTestResults(appointment.getTestResults());
        dto.setFollowUpInstructions(appointment.getFollowUpInstructions());
        return dto;
    }

    // get all appointments
    
    public List<AppointmentSummaryDTO> getAllAppointments() {
        List<Appointment> appointments = appointmentRepository.findAll();
        return appointments.stream().map(appointment -> {
            AppointmentSummaryDTO dto = new AppointmentSummaryDTO();
            dto.setAppointmentId(appointment.getAppointmentId());
            dto.setPatientName(appointment.getPatient().getFirstName() + " " + appointment.getPatient().getLastName());
            dto.setDoctorName(appointment.getDoctor().getFirstName() + " " + appointment.getDoctor().getLastName());
            dto.setAppointmentDateTime(appointment.getAppointmentDateTime());
            dto.setStatus(appointment.getStatus());
            return dto;
        }).collect(Collectors.toList());
    }
}