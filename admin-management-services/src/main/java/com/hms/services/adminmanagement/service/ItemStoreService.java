package com.hms.services.adminmanagement.service;

import com.hms.services.adminmanagement.entity.*;
import com.hms.services.adminmanagement.repository.HMS_TM_Item_StoreRepository;
import com.hms.services.adminmanagement.repository.HMS_TW_Item_StoreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ItemStoreService {

    @Autowired
    private HMS_TW_Item_StoreRepository twItemStoreRepository;

    @Autowired
    private HMS_TM_Item_StoreRepository tmItemStoreRepository;

    public List<HMS_TW_Item_Store> createTwItemStores(List<HMS_TW_Item_Store> itemStores) {
        return twItemStoreRepository.saveAll(itemStores);
    }

    public HMS_TW_Item_Store getTwItemStoreById(String id) {
        return twItemStoreRepository.findByIdAndDeletedFalse(id)
                .orElse(null);
    }

    public List<HMS_TW_Item_Store> getAllTwItemStores() {
        return twItemStoreRepository.findByDeletedFalse();
    }

    public HMS_TW_Item_Store updateTwItemStore(String id, HMS_TW_Item_Store updatedStore) {
        HMS_TW_Item_Store existingStore = getTwItemStoreById(id);
        existingStore.setItemStoreName(updatedStore.getItemStoreName());
        existingStore.setItemStockCode(updatedStore.getItemStockCode());
        existingStore.setDescription(updatedStore.getDescription());
        existingStore.setModNo(updatedStore.getModNo());
        return twItemStoreRepository.save(existingStore);
    }


    public HMS_TM_Item_Store approveTwItemStore(String id) {
        HMS_TW_Item_Store twItemStore = getTwItemStoreById(id);
        if ("UNAUTHORIZED".equals(twItemStore.getAuthStat())) {
            HMS_TM_Item_Store tmItemStore = new HMS_TM_Item_Store();
            tmItemStore.setId(twItemStore.getId());
            tmItemStore.setModNo(twItemStore.getModNo());
            tmItemStore.setItemStoreName(twItemStore.getItemStoreName());
            tmItemStore.setItemStockCode(twItemStore.getItemStockCode());
            tmItemStore.setDescription(twItemStore.getDescription());
            tmItemStore.setAuthStat("AUTHORIZED");
            tmItemStoreRepository.save(tmItemStore);
            twItemStore.setAuthStat("AUTHORIZED");
            twItemStore.setRecordStat("OPENED");
            twItemStoreRepository.save(twItemStore);
            return tmItemStore;
        } else {
            throw new RuntimeException("Item Store is already approved or rejected");
        }
    }

    public void deleteTwItemStores(String id,String authStat) {
        HMS_TM_Item_Store tmItemStore = tmItemStoreRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item Store not found in TM"));
        if ("UNAUTHORIZED".equals(authStat)) {
            tmItemStoreRepository.delete(tmItemStore);

            Optional<HMS_TW_Item_Store> twItemStore = twItemStoreRepository.findById(id);

            if (twItemStore.isPresent()) {
                HMS_TW_Item_Store twItemStore1 = twItemStore.get();
                twItemStore1.setAuthStat("UNAUTHORIZED");
                twItemStore1.setRecordStat("CLOSED");
                twItemStoreRepository.save(twItemStore1);
            }

            tmItemStoreRepository.delete(tmItemStore);
        } else {
            throw new RuntimeException("Item Store must have 'UNAUTHORIZED' status to be deleted");
        }
    }

    public HMS_TM_Item_Store getTmItemStoreById(String id) {
        return tmItemStoreRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item store not found with id: " + id));
    }

    public HMS_TM_Item_Store updateTmItemStore(String id, HMS_TM_Item_Store updatedStore) {
        HMS_TM_Item_Store existingStore = getTmItemStoreById(id);
        existingStore.setItemStoreName(updatedStore.getItemStoreName());
        existingStore.setItemStockCode(updatedStore.getItemStockCode());
        existingStore.setDescription(updatedStore.getDescription());
        return tmItemStoreRepository.save(existingStore);
    }

    public void deleteTwItemStore(String id) {
        HMS_TW_Item_Store store = getTwItemStoreById(id);
        store.setDeleted(true);
        twItemStoreRepository.save(store);
    }

    public List<HMS_TM_Item_Store> getAllTmItemStores() {
        return tmItemStoreRepository.findAll();
    }
}



