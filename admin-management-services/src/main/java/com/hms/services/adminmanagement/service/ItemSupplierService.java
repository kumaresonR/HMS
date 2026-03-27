package com.hms.services.adminmanagement.service;

import com.hms.services.adminmanagement.entity.HMS_TM_Item_Store;
import com.hms.services.adminmanagement.entity.HMS_TM_Item_Supplier;
import com.hms.services.adminmanagement.entity.HMS_TW_Item_Store;
import com.hms.services.adminmanagement.entity.HMS_TW_Item_Supplier;
import com.hms.services.adminmanagement.repository.HMS_TM_Item_SupplierRepository;
import com.hms.services.adminmanagement.repository.HMS_TW_Item_SupplierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ItemSupplierService {

    @Autowired
    private HMS_TW_Item_SupplierRepository twItemSupplierRepository;

    @Autowired
    private HMS_TM_Item_SupplierRepository tmItemSupplierRepository;

    public List<HMS_TW_Item_Supplier> createTwItemSuppliers(List<HMS_TW_Item_Supplier> itemSuppliers) {
        return twItemSupplierRepository.saveAll(itemSuppliers);
    }

    public HMS_TW_Item_Supplier getTwItemSupplierById(String id) {
        return twItemSupplierRepository.findByIdAndDeletedFalse(id)
                .orElse(null);
    }

    public List<HMS_TW_Item_Supplier> getAllTwItemSuppliers() {
        return twItemSupplierRepository.findByDeletedFalse();
    }

    public HMS_TW_Item_Supplier updateTwItemSupplier(String id, HMS_TW_Item_Supplier updatedSupplier) {
        HMS_TW_Item_Supplier existingSupplier = getTwItemSupplierById(id);
        existingSupplier.setName(updatedSupplier.getName());
        existingSupplier.setPhone(updatedSupplier.getPhone());
        existingSupplier.setEmail(updatedSupplier.getEmail());
        existingSupplier.setContactPersonName(updatedSupplier.getContactPersonName());
        existingSupplier.setAddress(updatedSupplier.getAddress());
        existingSupplier.setContactPersonPhone(updatedSupplier.getContactPersonPhone());
        existingSupplier.setContactPersonEmail(updatedSupplier.getContactPersonEmail());
        existingSupplier.setDescription(updatedSupplier.getDescription());
        existingSupplier.setModNo(updatedSupplier.getModNo());
        return twItemSupplierRepository.save(existingSupplier);
    }

    public HMS_TM_Item_Supplier approveTwItemSupplier(String id) {
        HMS_TW_Item_Supplier twSupplier = getTwItemSupplierById(id);
        if ("UNAUTHORIZED".equals(twSupplier.getAuthStat())) {

        HMS_TM_Item_Supplier tmSupplier = new HMS_TM_Item_Supplier();
        tmSupplier.setId(twSupplier.getId());
        tmSupplier.setName(twSupplier.getName());
        tmSupplier.setPhone(twSupplier.getPhone());
        tmSupplier.setEmail(twSupplier.getEmail());
        tmSupplier.setContactPersonName(twSupplier.getContactPersonName());
        tmSupplier.setAddress(twSupplier.getAddress());
        tmSupplier.setContactPersonPhone(twSupplier.getContactPersonPhone());
        tmSupplier.setContactPersonEmail(twSupplier.getContactPersonEmail());
        tmSupplier.setDescription(twSupplier.getDescription());
        tmSupplier.setModNo(twSupplier.getModNo());
        tmSupplier.setAuthStat("AUTHORIZED");
        tmItemSupplierRepository.save(tmSupplier);
        twSupplier.setAuthStat("APPROVED");
        twSupplier.setRecordStat("OPENED");
        twItemSupplierRepository.save(twSupplier);
        return tmSupplier;
        } else {
            throw new RuntimeException("Item Supplier is already approved or rejected");
        }
    }

    public void deleteTwItemSuppliers(String id,String authStat) {
        HMS_TM_Item_Supplier tmSupplier = tmItemSupplierRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item Supplier not found in TM"));
        if ("UNAUTHORIZED".equals(authStat)) {
            tmItemSupplierRepository.delete(tmSupplier);

            Optional<HMS_TW_Item_Supplier> twItemSupplier = twItemSupplierRepository.findById(id);

            if (twItemSupplier.isPresent()) {
                HMS_TW_Item_Supplier twItemSupplier1 = twItemSupplier.get();
                twItemSupplier1.setAuthStat("UNAUTHORIZED");
                twItemSupplier1.setRecordStat("CLOSED");
                twItemSupplierRepository.save(twItemSupplier1);
            }

            tmItemSupplierRepository.delete(tmSupplier);
        } else {
            throw new RuntimeException("Item Supplier must have 'UNAUTHORIZED' status to be deleted");
        }
    }

    public HMS_TM_Item_Supplier getTmItemSupplierById(String id) {
        return tmItemSupplierRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item supplier not found with id: " + id));
    }

    public HMS_TM_Item_Supplier updateTmItemSupplier(String id, HMS_TM_Item_Supplier updatedSupplier) {
        HMS_TM_Item_Supplier existingSupplier = getTmItemSupplierById(id);
        existingSupplier.setName(updatedSupplier.getName());
        existingSupplier.setPhone(updatedSupplier.getPhone());
        existingSupplier.setEmail(updatedSupplier.getEmail());
        existingSupplier.setContactPersonName(updatedSupplier.getContactPersonName());
        existingSupplier.setAddress(updatedSupplier.getAddress());
        existingSupplier.setContactPersonPhone(updatedSupplier.getContactPersonPhone());
        existingSupplier.setContactPersonEmail(updatedSupplier.getContactPersonEmail());
        existingSupplier.setDescription(updatedSupplier.getDescription());
        return tmItemSupplierRepository.save(existingSupplier);
    }

    public void deleteTwItemSupplier(String id) {
        HMS_TW_Item_Supplier supplier = getTwItemSupplierById(id);
        supplier.setDeleted(true);
        twItemSupplierRepository.save(supplier);
    }

    public List<HMS_TM_Item_Supplier> getAllTmItemSuppliers() {
        return tmItemSupplierRepository.findAll();
    }
}




