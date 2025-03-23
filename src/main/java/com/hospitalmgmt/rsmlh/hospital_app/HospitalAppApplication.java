package com.hospitalmgmt.rsmlh.hospital_app;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
@SpringBootApplication	
@EntityScan("com.hospitalmgmt.rsmlh.hospital_app.rsmlh_entity")
public class HospitalAppApplication {
	public static void main(String[] args) {
		SpringApplication.run(HospitalAppApplication.class, args);
	}
}
