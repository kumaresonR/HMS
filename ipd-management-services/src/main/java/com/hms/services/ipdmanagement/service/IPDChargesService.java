package com.hms.services.ipdmanagement.service;


import com.hms.services.ipdmanagement.entity.HMS_TM_IPDCharges;
import com.hms.services.ipdmanagement.exception.CustomException;
import com.hms.services.ipdmanagement.repository.IPDChargesRepository;
import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class IPDChargesService{


    private final IPDChargesRepository ipdChargesRepository;

    @Autowired
    public IPDChargesService(final IPDChargesRepository ipdChargesRepository) {
        this.ipdChargesRepository = ipdChargesRepository;
    }

    // Create a new IPD Charge
    public List<HMS_TM_IPDCharges> createIPDCharge(List<HMS_TM_IPDCharges>  ipdCharge) {
        for (HMS_TM_IPDCharges charge : ipdCharge) {
            charge.setActive(true);
            charge.setCreatedAt(LocalDateTime.now());
            charge.setCreatedBy("createdBy");
    }
        return ipdChargesRepository.saveAll(ipdCharge);
    }

    // Update an existing IPD Charge
    public HMS_TM_IPDCharges updateIPDCharge(String ipdChargeId, HMS_TM_IPDCharges ipdChargeDetails) {
        HMS_TM_IPDCharges existingCharge = ipdChargesRepository.findByIpdChargeIdAndIsActiveTrue(ipdChargeId)
                .orElseThrow(() -> new CustomException("IPD Charge not found with ID: " + ipdChargeId, HttpStatus.BAD_REQUEST));

        existingCharge.setChargeTypeId(ipdChargeDetails.getChargeTypeId());
        existingCharge.setChargeCategoryId(ipdChargeDetails.getChargeCategoryId());
        existingCharge.setChargeNameId(ipdChargeDetails.getChargeNameId());
        existingCharge.setStandardCharge(ipdChargeDetails.getStandardCharge());
        existingCharge.setTpaCharge(ipdChargeDetails.getTpaCharge());
        existingCharge.setTpa(ipdChargeDetails.isTpa());
        existingCharge.setQty(ipdChargeDetails.getQty());
        existingCharge.setTotal(ipdChargeDetails.getTotal());
        existingCharge.setDiscountAmount(ipdChargeDetails.getDiscountAmount());
        existingCharge.setDiscountPercentage(ipdChargeDetails.getDiscountPercentage());
        existingCharge.setTaxAmount(ipdChargeDetails.getTaxAmount());
        existingCharge.setTaxPercentage(ipdChargeDetails.getTaxPercentage());
        existingCharge.setNetAmount(ipdChargeDetails.getNetAmount());
        existingCharge.setChargeNote(ipdChargeDetails.getChargeNote());
        existingCharge.setDate(ipdChargeDetails.getDate());
        existingCharge.setGstAdded(ipdChargeDetails.isGstAdded());
        existingCharge.setLastModifiedBy("modifiedBy");
        existingCharge.setLastModifiedAt(LocalDateTime.now());
        return ipdChargesRepository.save(existingCharge);
    }

    // Soft delete an IPD Charge
    public void deleteIPDCharge(String ipdChargeId) {
        HMS_TM_IPDCharges ipdCharge = ipdChargesRepository.findByIpdChargeIdAndIsActiveTrue(ipdChargeId)
                .orElseThrow(() -> new CustomException("IPD Charge not found with ID: " + ipdChargeId, HttpStatus.BAD_REQUEST));

        ipdCharge.setActive(false);
        ipdCharge.setLastModifiedBy("ModifiedBy");
        ipdCharge.setLastModifiedAt(LocalDateTime.now());
        ipdChargesRepository.save(ipdCharge);
    }

    // Get all active IPD Charges
    public List<HMS_TM_IPDCharges> getAllActiveIPDCharges() {
        return ipdChargesRepository.findAllByIsActiveTrue();
    }

    // Get IPD Charges by IPD ID
    public List<HMS_TM_IPDCharges> getIPDChargesByIpdId(String ipdId) {
        return ipdChargesRepository.findByIpdIdAndIsActiveTrue(ipdId);
    }

    // Get IPD Charge by IPD Charge ID
    public HMS_TM_IPDCharges getIPDChargeByIpdChargeId(String ipdChargeId) {
        return ipdChargesRepository.findByIpdChargeIdAndIsActiveTrue(ipdChargeId)
                .orElseThrow(() -> new CustomException("IPD Charge not found with ID: " + ipdChargeId, HttpStatus.BAD_REQUEST));
    }






}

