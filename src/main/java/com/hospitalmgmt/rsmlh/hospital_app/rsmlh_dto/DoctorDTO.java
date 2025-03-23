package com.hospitalmgmt.rsmlh.hospital_app.rsmlh_dto;

public class DoctorDTO {

    private Long doctorId;
    private String firstName;
    private String lastName;
    private String specialization;
    private String phoneNumber;
    public Long getDoctorId() {
        return doctorId;
    }
    public void setDoctorId(Long doctorId) {
        this.doctorId = doctorId;
    }
    public String getFirstName() {
        return firstName;
    }
    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }
    public String getLastName() {
        return lastName;
    }
    public void setLastName(String lastName) {
        this.lastName = lastName;
    }
    public String getSpecialization() {
        return specialization;
    }
    public void setSpecialization(String specialization) {
        this.specialization = specialization;
    }
    public String getPhoneNumber() {
        return phoneNumber;
    }
    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }
    @Override
    public String toString() {
        return "DoctorDTO [doctorId=" + doctorId + ", firstName=" + firstName + ", lastName=" + lastName
                + ", specialization=" + specialization + ", phoneNumber=" + phoneNumber + "]";
    }

    

    

}
