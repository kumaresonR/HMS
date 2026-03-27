package com.hms.services.adminmanagement.repository;

import com.hms.services.adminmanagement.entity.HMS_TW_Add_Item_Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HMS_TW_Add_Item_CategoryRepository extends JpaRepository<HMS_TW_Add_Item_Category, String> {

    List<HMS_TW_Add_Item_Category> findByDeletedFalse();

    Optional<HMS_TW_Add_Item_Category> findByIdAndDeletedFalse(String id);
}



