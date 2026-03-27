package com.hms.services.inventorymanagement.repository;

import com.hms.services.inventorymanagement.entity.HMS_TM_AddItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AddItemRepository extends JpaRepository<HMS_TM_AddItem, String> {
    List<HMS_TM_AddItem> findByDeletedFalse();

    Optional<HMS_TM_AddItem> findByIdAndDeletedFalse(String id);
}

