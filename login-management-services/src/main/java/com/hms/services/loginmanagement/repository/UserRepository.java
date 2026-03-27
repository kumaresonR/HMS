package com.hms.services.loginmanagement.repository;

import com.hms.services.loginmanagement.entity.HMS_TM_UserDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

import java.time.LocalDate;

@Repository
public interface UserRepository extends JpaRepository<HMS_TM_UserDetails, String> {


    Optional<HMS_TM_UserDetails> findByUserNameAndIsActiveTrue(String username);
    HMS_TM_UserDetails findByEmployeeIdAndIsActiveTrue(String employeeId);

}


