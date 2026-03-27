package com.hms.services.adminmanagement.repository;

import com.hms.services.adminmanagement.entity.HMS_TM_Add_Item_Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HMS_TM_Add_Item_CategoryRepository extends JpaRepository<HMS_TM_Add_Item_Category, String> {
}


