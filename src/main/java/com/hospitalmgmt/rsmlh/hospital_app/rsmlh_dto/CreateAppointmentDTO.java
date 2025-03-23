package com.hospitalmgmt.rsmlh.hospital_app.rsmlh_dto;

import java.time.LocalDateTime;

public class CreateAppointmentDTO {

private Long patientId;
    private Long doctorId;
    private LocalDateTime appointmentDateTime;
    private String reasonForVisit;

    
    public Long getPatientId() {
        return patientId;
    }
    public void setPatientId(Long patientId) {
        this.patientId = patientId;
    }
    public Long getDoctorId() {
        return doctorId;
    }
    public void setDoctorId(Long doctorId) {
        this.doctorId = doctorId;
    }
    public LocalDateTime getAppointmentDateTime() {
        return appointmentDateTime;
    }
    public void setAppointmentDateTime(LocalDateTime appointmentDateTime) {
        this.appointmentDateTime = appointmentDateTime;
    }
    public String getReasonForVisit() {
        return reasonForVisit;
    }
    public void setReasonForVisit(String reasonForVisit) {
        this.reasonForVisit = reasonForVisit;
    }
    @Override
    public String toString() {
        return "CreateAppointmentDTO [patientId=" + patientId + ", doctorId=" + doctorId + ", appointmentDateTime="
                + appointmentDateTime + ", reasonForVisit=" + reasonForVisit + "]";
    }

    

}
