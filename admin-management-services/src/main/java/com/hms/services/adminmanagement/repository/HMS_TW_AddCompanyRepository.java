package com.hms.services.adminmanagement.repository;

import com.hms.services.adminmanagement.entity.HMS_TW_AddCompany;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HMS_TW_AddCompanyRepository extends JpaRepository<HMS_TW_AddCompany, String> {
    List<HMS_TW_AddCompany> findByDeletedFalse();

    Optional<HMS_TW_AddCompany> findByIdAndDeletedFalse(String id);
}




