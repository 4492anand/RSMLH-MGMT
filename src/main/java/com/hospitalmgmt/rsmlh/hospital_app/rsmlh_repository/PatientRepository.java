package com.hospitalmgmt.rsmlh.hospital_app.rsmlh_repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.hospitalmgmt.rsmlh.hospital_app.rsmlh_entity.Patient;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {
    List<Patient> findByFirstNameAndLastNameAndDateOfBirth(
        String firstName,
        String lastName,
        LocalDate dateOfBirth
    );
}
