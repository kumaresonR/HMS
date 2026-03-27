package com.hms.services.adminmanagement.service;

import com.hms.services.adminmanagement.entity.HMS_TM_Employee;
import com.hms.services.adminmanagement.entity.HMS_TM_MedicineCategory;
import com.hms.services.adminmanagement.entity.HMS_TM_Role;
import com.hms.services.adminmanagement.entity.HMS_TW_MedicineCategory;
import com.hms.services.adminmanagement.repository.HMS_TM_EmployeeRepository;
import com.hms.services.adminmanagement.repository.HMS_TM_MedicineCategoryRepository;
import com.hms.services.adminmanagement.repository.HMS_TW_MedicineCategoryRepository;
import com.hms.services.adminmanagement.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class MedicineCategoryService {

    @Autowired
    private HMS_TW_MedicineCategoryRepository twMedicineCategoryRepository;

    @Autowired
    private HMS_TM_MedicineCategoryRepository tmMedicineCategoryRepository;

    public HMS_TW_MedicineCategory createMedicineCategory(HMS_TW_MedicineCategory category) {
        return twMedicineCategoryRepository.save(category);
    }

    public HMS_TW_MedicineCategory getMedicineCategoryById(String id) {
        return twMedicineCategoryRepository.findByIdAndDeletedFalse(id)
                .orElse(null);
    }

    public List<HMS_TW_MedicineCategory> getAllMedicineCategories() {
        return twMedicineCategoryRepository.findByDeletedFalse();
    }

    public HMS_TW_MedicineCategory updateMedicineCategory(String id, HMS_TW_MedicineCategory updatedCategory) {
        HMS_TW_MedicineCategory existingCategory = getMedicineCategoryById(id);
        existingCategory.setCategoryName(updatedCategory.getCategoryName());
        existingCategory.setAuthStat(updatedCategory.getAuthStat());
        existingCategory.setModNo(updatedCategory.getModNo());
        return twMedicineCategoryRepository.save(existingCategory);
    }

    public HMS_TW_MedicineCategory approveMedicineCategory(String id) {

        HMS_TW_MedicineCategory category = getMedicineCategoryById(id);

        if ("UNAUTHORIZED".equals(category.getAuthStat())) {

            HMS_TM_MedicineCategory tmCategory = new HMS_TM_MedicineCategory();
            tmCategory.setId(category.getId());
            tmCategory.setCategoryName(category.getCategoryName());
            tmCategory.setModNo(category.getModNo());
            tmCategory.setAuthStat("AUTHORIZED");

            tmMedicineCategoryRepository.save(tmCategory);

            category.setAuthStat("AUTHORIZED");
            category.setRecordStat("OPENED");

            twMedicineCategoryRepository.save(category);

            return category;
        } else {
            throw new RuntimeException("Medicine category is already approved or rejected");
        }
    }

    public void deleteMedicineCategory(String id, String authStat) {
        HMS_TM_MedicineCategory tmCategory = tmMedicineCategoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Medicine category not found in TM with id: " + id));

        if ("UNAUTHORIZED".equals(authStat)) {
            tmMedicineCategoryRepository.delete(tmCategory);

            Optional<HMS_TW_MedicineCategory> twCategoryOptional = twMedicineCategoryRepository.findById(id);

            if (twCategoryOptional.isPresent()) {
                HMS_TW_MedicineCategory twCategory = twCategoryOptional.get();
                twCategory.setAuthStat("UNAUTHORIZED");
                twCategory.setRecordStat("CLOSED");
                twMedicineCategoryRepository.save(twCategory);
            }

        } else {
            throw new RuntimeException("Invalid authorization status, only UNAUTHORIZED is allowed");
        }
    }

    public HMS_TM_MedicineCategory getMedicineCategoryByIds(String id) {
        return tmMedicineCategoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Medicine category not found with id: " + id));
    }

    public HMS_TM_MedicineCategory updateMedicineCategory(String id, HMS_TM_MedicineCategory updatedCategory) {
        HMS_TM_MedicineCategory existingCategory = getMedicineCategoryByIds(id);
        existingCategory.setCategoryName(updatedCategory.getCategoryName());
        existingCategory.setAuthStat(updatedCategory.getAuthStat());
        return tmMedicineCategoryRepository.save(existingCategory);
    }

    public List<HMS_TM_MedicineCategory> getAllMedicineCategoriesTM() {
        return tmMedicineCategoryRepository.findAll();
    }

    public void deleteTwMedicineCategory(String categoryId) {
        Optional<HMS_TW_MedicineCategory> categoryOptional = twMedicineCategoryRepository.findById(categoryId);
        if (categoryOptional.isPresent()) {
            HMS_TW_MedicineCategory category = categoryOptional.get();
            category.setDeleted(true);
            twMedicineCategoryRepository.save(category);
        } else {
            throw new RuntimeException("Medicine category not found with ID: " + categoryId);
        }
    }
}



