package com.hospitalmgmt.rsmlh.hospital_app.rsmlh_repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.hospitalmgmt.rsmlh.hospital_app.rsmlh_entity.Doctor;

@Repository
public interface DoctorRepository  extends JpaRepository<Doctor , Long> {

    boolean existsByPhoneNumber(String phoneNumber);

}
