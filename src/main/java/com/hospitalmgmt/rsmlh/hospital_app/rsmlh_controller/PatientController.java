package com.hospitalmgmt.rsmlh.hospital_app.rsmlh_controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PatientController {
    @GetMapping("/")
    public String getPatients() {
        return "List of patients";
    }
}   