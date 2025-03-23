package com.hospitalmgmt.rsmlh.hospital_app.rsmlh_dto;

import java.time.LocalDateTime;

public class AppointmentDetailDTO {
private Long appointmentId;
    private PatientDTO patient;
    private DoctorDTO doctor;
    private LocalDateTime appointmentDateTime;
    private String status;
    private String reasonForVisit;
    private String diagnosis;
    private String treatment;
    private String prescriptions;
    private String testResults;
    private String followUpInstructions;
    public Long getAppointmentId() {
        return appointmentId;
    }
    public void setAppointmentId(Long appointmentId) {
        this.appointmentId = appointmentId;
    }
    public PatientDTO getPatient() {
        return patient;
    }
    public void setPatient(PatientDTO patient) {
        this.patient = patient;
    }
    public DoctorDTO getDoctor() {
        return doctor;
    }
    public void setDoctor(DoctorDTO doctor) {
        this.doctor = doctor;
    }
    public LocalDateTime getAppointmentDateTime() {
        return appointmentDateTime;
    }
    public void setAppointmentDateTime(LocalDateTime appointmentDateTime) {
        this.appointmentDateTime = appointmentDateTime;
    }
    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }
    public String getReasonForVisit() {
        return reasonForVisit;
    }
    public void setReasonForVisit(String reasonForVisit) {
        this.reasonForVisit = reasonForVisit;
    }
    public String getDiagnosis() {
        return diagnosis;
    }
    public void setDiagnosis(String diagnosis) {
        this.diagnosis = diagnosis;
    }
    public String getTreatment() {
        return treatment;
    }
    public void setTreatment(String treatment) {
        this.treatment = treatment;
    }
    public String getPrescriptions() {
        return prescriptions;
    }
    public void setPrescriptions(String prescriptions) {
        this.prescriptions = prescriptions;
    }
    public String getTestResults() {
        return testResults;
    }
    public void setTestResults(String testResults) {
        this.testResults = testResults;
    }
    public String getFollowUpInstructions() {
        return followUpInstructions;
    }
    public void setFollowUpInstructions(String followUpInstructions) {
        this.followUpInstructions = followUpInstructions;
    }
    @Override
    public String toString() {
        return "AppointmentDetailDTO [appointmentId=" + appointmentId + ", patient=" + patient + ", doctor=" + doctor
                + ", appointmentDateTime=" + appointmentDateTime + ", status=" + status + ", reasonForVisit="
                + reasonForVisit + ", diagnosis=" + diagnosis + ", treatment=" + treatment + ", prescriptions="
                + prescriptions + ", testResults=" + testResults + ", followUpInstructions=" + followUpInstructions
                + "]";
    }
}
