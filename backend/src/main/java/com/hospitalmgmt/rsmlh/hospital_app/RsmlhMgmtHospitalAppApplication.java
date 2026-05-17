package com.hospitalmgmt.rsmlh.hospital_app;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;

@SpringBootApplication
//@EntityScan("com.hospitalmgmt.rsmlh.hospital_app.rsmlh_entity")
public class RsmlhMgmtHospitalAppApplication {
	private static final Logger log = LoggerFactory.getLogger(RsmlhMgmtHospitalAppApplication.class);
	
	public static void main(String[] args) {
		SpringApplication.run(RsmlhMgmtHospitalAppApplication.class, args);
	}
	
	@EventListener(ApplicationReadyEvent.class)
	public void onApplicationReady() {
		log.info("========================================");
		log.info("RSMLH Hospital Management Application Started Successfully!");
		log.info("========================================");
	}
}