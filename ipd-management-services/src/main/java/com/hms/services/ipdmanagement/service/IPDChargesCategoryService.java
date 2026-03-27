package com.hms.services.ipdmanagement.service;

import com.hms.services.ipdmanagement.entity.HMS_TM_IPDChargesCategory;
import com.hms.services.ipdmanagement.exception.CustomException;
import com.hms.services.ipdmanagement.repository.IPDChargesCategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class IPDChargesCategoryService {

    private final IPDChargesCategoryRepository categoryRepository;

    @Autowired
    public IPDChargesCategoryService(IPDChargesCategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    // Create a new category
    public HMS_TM_IPDChargesCategory createCategory(HMS_TM_IPDChargesCategory category) {
        category.setCreatedAt(LocalDateTime.now());
        try {
            return categoryRepository.save(category);
        } catch (Exception ex) {
            throw new CustomException("Failed to create category: " + ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Get categories by chargeTypeId
    public List<HMS_TM_IPDChargesCategory> getCategoriesByChargeTypeId(String chargeTypeId) {
        List<HMS_TM_IPDChargesCategory> categories = categoryRepository.findByChargeTypeIdAndIsActiveTrue(chargeTypeId);
        if (categories.isEmpty()) {
            throw new CustomException("No categories found with Charge Type ID " + chargeTypeId, HttpStatus.NOT_FOUND);
        }
        return categories;
    }

    // Get categories by chargeTypeId
    public HMS_TM_IPDChargesCategory getByChargeTypeId(String chargeCategoryId) {
        Optional<HMS_TM_IPDChargesCategory> categories = categoryRepository.findByChargeCategoryIdAndIsActiveTrue(chargeCategoryId);
        return categories.get();
    }

    // Get all active categories
    public List<HMS_TM_IPDChargesCategory> getAllCategories() {
        return categoryRepository.findByIsActiveTrue();
    }

    // Update category
    public HMS_TM_IPDChargesCategory updateCategory(String chargeCategoryId, HMS_TM_IPDChargesCategory updatedCategory) {
        HMS_TM_IPDChargesCategory existingCategory = getCategoryById(chargeCategoryId);
        existingCategory.setChargeCategory(updatedCategory.getChargeCategory());
        existingCategory.setLastModifiedAt(LocalDateTime.now());
        existingCategory.setLastModifiedBy(updatedCategory.getLastModifiedBy());
        return categoryRepository.save(existingCategory);
    }

    // Soft delete a category
    public void softDeleteCategory(String chargeCategoryId) {
        HMS_TM_IPDChargesCategory category = getCategoryById(chargeCategoryId);
        category.setActive(false);
        category.setLastModifiedAt(LocalDateTime.now());
        categoryRepository.save(category);
    }

    // Helper method to find category by ID with custom exception
    private HMS_TM_IPDChargesCategory getCategoryById(String chargeCategoryId) {
        return categoryRepository.findById(chargeCategoryId)
                .orElseThrow(() -> new CustomException("Category with ID " + chargeCategoryId + " not found", HttpStatus.NOT_FOUND));
    }
}

