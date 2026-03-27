package com.hms.services.adminmanagement.service;

import com.hms.services.adminmanagement.entity.HMS_TM_Supplier;
import com.hms.services.adminmanagement.entity.HMS_TW_Supplier;
import com.hms.services.adminmanagement.repository.HMS_TM_SupplierRepository;
import com.hms.services.adminmanagement.repository.HMS_TW_SupplierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SupplierService {

    @Autowired
    private HMS_TW_SupplierRepository twSupplierRepository;

    @Autowired
    private HMS_TM_SupplierRepository tmSupplierRepository;

    public HMS_TW_Supplier createSupplier(HMS_TW_Supplier supplier) {
        return twSupplierRepository.save(supplier);
    }

    public HMS_TW_Supplier getSupplierByIds(String supplierId) {
        return twSupplierRepository.findBySupplierIdAndDeletedFalse(supplierId)
                .orElse(null);
    }

    public List<HMS_TW_Supplier> getAllSuppliersTW() {
        return twSupplierRepository.findByDeletedFalse();
    }

    public HMS_TW_Supplier updateSupplier(String id, HMS_TW_Supplier updatedSupplier) {
        HMS_TW_Supplier existingSupplier = getSupplierByIds(id);
        existingSupplier.setSupplierName(updatedSupplier.getSupplierName());
        existingSupplier.setSupplierContact(updatedSupplier.getSupplierContact());
        existingSupplier.setContactPersonName(updatedSupplier.getContactPersonName());
        existingSupplier.setContactPersonPhone(updatedSupplier.getContactPersonPhone());
        existingSupplier.setDrugLicenceNumber(updatedSupplier.getDrugLicenceNumber());
        existingSupplier.setAddress(updatedSupplier.getAddress());
        existingSupplier.setModNo(updatedSupplier.getModNo());
        return twSupplierRepository.save(existingSupplier);
    }

    public HMS_TW_Supplier approveSupplier(String id) {

        HMS_TW_Supplier supplier = getSupplierByIds(id);

        if ("UNAUTHORIZED".equals(supplier.getAuthStat())) {

            HMS_TM_Supplier tmSupplier = new HMS_TM_Supplier();
            tmSupplier.setSupplierId(supplier.getSupplierId());
            tmSupplier.setSupplierName(supplier.getSupplierName());
            tmSupplier.setSupplierContact(supplier.getSupplierContact());
            tmSupplier.setContactPersonName(supplier.getContactPersonName());
            tmSupplier.setContactPersonPhone(supplier.getContactPersonPhone());
            tmSupplier.setDrugLicenceNumber(supplier.getDrugLicenceNumber());
            tmSupplier.setModNo(supplier.getModNo());
            tmSupplier.setAddress(supplier.getAddress());

            tmSupplier.setAuthStat("AUTHORIZED");
            tmSupplierRepository.save(tmSupplier);

            supplier.setAuthStat("AUTHORIZED");
            supplier.setRecordStat("OPENED");
            twSupplierRepository.save(supplier);
            return supplier;
        } else {

            throw new RuntimeException("Supplier is already approved or rejected");
        }
    }

    public void deleteSupplier(String id, String authStat) {
        HMS_TM_Supplier tmSupplier = tmSupplierRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Supplier not found in TM with id: " + id));

        if ("UNAUTHORIZED".equals(authStat)) {
            tmSupplier.setAuthStat("UNAUTHORIZED");
            tmSupplierRepository.save(tmSupplier);

            Optional<HMS_TW_Supplier> twSupplierOptional = twSupplierRepository.findById(id);

            if (twSupplierOptional.isPresent()) {
                HMS_TW_Supplier twSupplier = twSupplierOptional.get();
                twSupplier.setAuthStat("UNAUTHORIZED");
                twSupplier.setRecordStat("CLOSED");
                twSupplierRepository.save(twSupplier);
            }

            tmSupplierRepository.delete(tmSupplier);
        } else {
            throw new RuntimeException("Invalid authorization status, only UNAUTHORIZED is allowed");
        }
    }

    public HMS_TM_Supplier getSupplierById(String id) {
        return tmSupplierRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Supplier not found with id: " + id));
    }

    public List<HMS_TM_Supplier> getAllSuppliersTM() {
        return tmSupplierRepository.findAll();
    }

    public HMS_TM_Supplier updateSupplier(String id, HMS_TM_Supplier updatedSupplier) {
        HMS_TM_Supplier existingSupplier = getSupplierById(id);
        existingSupplier.setSupplierName(updatedSupplier.getSupplierName());
        existingSupplier.setSupplierContact(updatedSupplier.getSupplierContact());
        existingSupplier.setContactPersonName(updatedSupplier.getContactPersonName());
        existingSupplier.setContactPersonPhone(updatedSupplier.getContactPersonPhone());
        existingSupplier.setDrugLicenceNumber(updatedSupplier.getDrugLicenceNumber());
        existingSupplier.setAddress(updatedSupplier.getAddress());
        return tmSupplierRepository.save(existingSupplier);
    }

    public void deleteTwSupplier(String supplierId) {
        Optional<HMS_TW_Supplier> supplierOptional = twSupplierRepository.findById(supplierId);
        if (supplierOptional.isPresent()) {
            HMS_TW_Supplier supplier = supplierOptional.get();
            supplier.setDeleted(true);
            twSupplierRepository.save(supplier);
        } else {
            throw new RuntimeException("Supplier not found with ID: " + supplierId);
        }
    }

}



