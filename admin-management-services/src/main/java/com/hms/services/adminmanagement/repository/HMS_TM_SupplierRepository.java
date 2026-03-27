package com.hms.services.adminmanagement.repository;

import com.hms.services.adminmanagement.entity.HMS_TM_Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HMS_TM_SupplierRepository extends JpaRepository<HMS_TM_Supplier, String> {
}



