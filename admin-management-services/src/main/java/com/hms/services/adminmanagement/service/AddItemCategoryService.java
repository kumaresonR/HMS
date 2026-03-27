package com.hms.services.adminmanagement.service;

import com.hms.services.adminmanagement.entity.HMS_TM_Add_Item_Category;
import com.hms.services.adminmanagement.entity.HMS_TW_Add_Item_Category;
import com.hms.services.adminmanagement.repository.HMS_TM_Add_Item_CategoryRepository;
import com.hms.services.adminmanagement.repository.HMS_TW_Add_Item_CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AddItemCategoryService {

    @Autowired
    private HMS_TW_Add_Item_CategoryRepository twAddItemCategoryRepository;

    @Autowired
    private HMS_TM_Add_Item_CategoryRepository tmAddItemCategoryRepository;

    public List<HMS_TW_Add_Item_Category> createItemCategories(List<HMS_TW_Add_Item_Category> categories) {
        return twAddItemCategoryRepository.saveAll(categories);
    }

    public HMS_TW_Add_Item_Category getItemCategoryById(String id) {
        return twAddItemCategoryRepository.findByIdAndDeletedFalse(id)
                .orElse(null);
    }

    public List<HMS_TW_Add_Item_Category> getAllTwItemCategories() {
        return twAddItemCategoryRepository.findByDeletedFalse();
    }

    public HMS_TW_Add_Item_Category updateItemCategory(String id, HMS_TW_Add_Item_Category updatedCategory) {
        HMS_TW_Add_Item_Category existingCategory = getItemCategoryById(id);
        existingCategory.setItemCategory(updatedCategory.getItemCategory());
        existingCategory.setDescription(updatedCategory.getDescription());
        existingCategory.setModNo(updatedCategory.getModNo());
        return twAddItemCategoryRepository.save(existingCategory);
    }

    public HMS_TW_Add_Item_Category approveItemCategory(String id) {
        HMS_TW_Add_Item_Category twCategory = getItemCategoryById(id);

        if ("UNAUTHORIZED".equalsIgnoreCase(twCategory.getAuthStat())) {
            HMS_TM_Add_Item_Category tmCategory = new HMS_TM_Add_Item_Category();
            tmCategory.setItemCategory(twCategory.getItemCategory());
            tmCategory.setDescription(twCategory.getDescription());
            tmCategory.setId(twCategory.getId());
            tmCategory.setModNo(twCategory.getModNo());
            tmCategory.setAuthStat("AUTHORIZED");
            tmAddItemCategoryRepository.save(tmCategory);

            twCategory.setAuthStat("AUTHORIZED");
            twCategory.setRecordStat("OPENED");
            return twAddItemCategoryRepository.save(twCategory);
        } else {
            throw new RuntimeException("Item category is already approved or rejected.");
        }
    }

    public void deleteItemCategory(String id, String authStat) {
        HMS_TM_Add_Item_Category tmCategory = tmAddItemCategoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item category not found in TM with id: " + id));

        if ("UNAUTHORIZED".equalsIgnoreCase(authStat)) {
            tmAddItemCategoryRepository.delete(tmCategory);

            Optional<HMS_TW_Add_Item_Category> twCategoryOptional = twAddItemCategoryRepository.findById(id);

            if (twCategoryOptional.isPresent()) {
                HMS_TW_Add_Item_Category twCategory = twCategoryOptional.get();
                twCategory.setAuthStat("UNAUTHORIZED");
                twCategory.setRecordStat("CLOSED");
                twAddItemCategoryRepository.save(twCategory);
            }
        } else {
            throw new RuntimeException("Invalid authorization status. Only UNAUTHORIZED status is allowed for deletion.");
        }
    }

    public HMS_TM_Add_Item_Category getItemCategoryByIds(String id) {
        return tmAddItemCategoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item category not found with id: " + id));
    }

    public List<HMS_TM_Add_Item_Category> getAllTmItemCategories() {
        return tmAddItemCategoryRepository.findAll();
    }

    public HMS_TM_Add_Item_Category updateItemCategory(String id, HMS_TM_Add_Item_Category updatedCategory) {
        HMS_TM_Add_Item_Category existingCategory = getItemCategoryByIds(id);
        existingCategory.setItemCategory(updatedCategory.getItemCategory());
        existingCategory.setDescription(updatedCategory.getDescription());
        return tmAddItemCategoryRepository.save(existingCategory);
    }

    public void deleteTwItemCategory(String id) {
        Optional<HMS_TW_Add_Item_Category> categoryOptional = twAddItemCategoryRepository.findById(id);
        if (categoryOptional.isPresent()) {
            HMS_TW_Add_Item_Category category = categoryOptional.get();
            category.setDeleted(true);
            twAddItemCategoryRepository.save(category);
        } else {
            throw new RuntimeException("Item category not found with id: " + id);
        }
    }
}



