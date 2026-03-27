package com.hms.services.inventorymanagement.service;

import com.hms.services.inventorymanagement.entity.HMS_TM_AddItem;
import com.hms.services.inventorymanagement.repository.AddItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AddItemService {

    @Autowired
    private AddItemRepository repository;

    public HMS_TM_AddItem createItem(HMS_TM_AddItem addItem) {
        return repository.save(addItem);
    }

    public List<HMS_TM_AddItem> getAllItems() {
        return repository.findByDeletedFalse();
    }

    public Optional<HMS_TM_AddItem> getItemById(String id) {
        return repository.findByIdAndDeletedFalse(id);
    }

    public HMS_TM_AddItem updateItem(String id, HMS_TM_AddItem updatedItem) {
        return repository.findById(id)
                .map(existingItem -> {
                    updatedItem.setId(existingItem.getId());
                    return repository.save(updatedItem);
                })
                .orElse(null);
    }

    public void deleteItem(String id) {
        Optional<HMS_TM_AddItem> hmsTmAddItem = repository.findById(id);
        if (hmsTmAddItem.isPresent()) {
            HMS_TM_AddItem hmsTmAddItem1 = hmsTmAddItem.get();
            hmsTmAddItem1.setDeleted(true);
            repository.save(hmsTmAddItem1);
        } else {
            throw new RuntimeException("Item Stock found with ID: " + id);
        }
    }
}
