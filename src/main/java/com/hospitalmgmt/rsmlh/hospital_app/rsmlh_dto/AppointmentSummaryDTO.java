package com.hospitalmgmt.rsmlh.hospital_app.rsmlh_dto;

import java.time.LocalDateTime;

public class AppointmentSummaryDTO {

private Long appointmentId;
    private String patientName;
    private String doctorName;
    private LocalDateTime appointmentDateTime;
    private String status;

    
    public Long getAppointmentId() {
        return appointmentId;
    }


    public void setAppointmentId(Long appointmentId) {
        this.appointmentId = appointmentId;
    }


    public String getPatientName() {
        return patientName;
    }


    public void setPatientName(String patientName) {
        this.patientName = patientName;
    }


    public String getDoctorName() {
        return doctorName;
    }


    public void setDoctorName(String doctorName) {
        this.doctorName = doctorName;
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


    @Override
    public String toString() {
        return "AppointmentSummaryDTO [appointmentId=" + appointmentId + ", patientName=" + patientName
                + ", doctorName=" + doctorName + ", appointmentDateTime=" + appointmentDateTime + ", status=" + status
                + "]";
    }

    

}
