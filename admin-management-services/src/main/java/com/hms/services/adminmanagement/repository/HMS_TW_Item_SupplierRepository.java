package com.hms.services.adminmanagement.repository;

import com.hms.services.adminmanagement.entity.HMS_TW_Item_Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HMS_TW_Item_SupplierRepository extends JpaRepository<HMS_TW_Item_Supplier, String> {
    Optional<HMS_TW_Item_Supplier> findByIdAndDeletedFalse(String id);

    List<HMS_TW_Item_Supplier> findByDeletedFalse();
}



