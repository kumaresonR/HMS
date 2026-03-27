package com.hms.services.opdmanagement.service;



import com.hms.services.opdmanagement.entity.HMS_TM_OPDCharges;
import com.hms.services.opdmanagement.exception.CustomException;
import com.hms.services.opdmanagement.repository.OPDChargesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class OPDChargesService {


    private final OPDChargesRepository opdChargesRepository;

    @Autowired
    public OPDChargesService(final OPDChargesRepository opdChargesRepository) {
        this.opdChargesRepository = opdChargesRepository;
    }

    // Create a new IPD Charge
    public List<HMS_TM_OPDCharges> createOPDCharges(List<HMS_TM_OPDCharges> opdCharges) {
        for (HMS_TM_OPDCharges charge : opdCharges) {
            charge.setActive(true);
            charge.setCreatedAt(LocalDateTime.now());
            charge.setCreatedBy("createdBy");
        }
        return opdChargesRepository.saveAll(opdCharges);
    }


    // Update an existing IPD Charge
    public HMS_TM_OPDCharges updateOPDCharge(String opdChargeId, HMS_TM_OPDCharges opdChargeDetails) {
        HMS_TM_OPDCharges existingCharge = opdChargesRepository.findByOpdChargeIdAndIsActiveTrue(opdChargeId)
                .orElseThrow(() -> new CustomException("OPD Charge not found with ID: " + opdChargeId, HttpStatus.BAD_REQUEST));

        existingCharge.setChargeTypeId(opdChargeDetails.getChargeTypeId());
        existingCharge.setChargeCategoryId(opdChargeDetails.getChargeCategoryId());
        existingCharge.setChargeNameId(opdChargeDetails.getChargeNameId());
        existingCharge.setStandardCharge(opdChargeDetails.getStandardCharge());
        existingCharge.setTpaCharge(opdChargeDetails.getTpaCharge());
        existingCharge.setQty(opdChargeDetails.getQty());
        existingCharge.setTotal(opdChargeDetails.getTotal());
        existingCharge.setDiscountAmount(opdChargeDetails.getDiscountAmount());
        existingCharge.setDiscountPercentage(opdChargeDetails.getDiscountPercentage());
        existingCharge.setTaxAmount(opdChargeDetails.getTaxAmount());
        existingCharge.setTaxPercentage(opdChargeDetails.getTaxPercentage());
        existingCharge.setNetAmount(opdChargeDetails.getNetAmount());
        existingCharge.setChargeNote(opdChargeDetails.getChargeNote());
        existingCharge.setDate(opdChargeDetails.getDate());
        existingCharge.setGstAdded(opdChargeDetails.isGstAdded());
        existingCharge.setLastModifiedBy("modifiedBy");
        existingCharge.setLastModifiedAt(LocalDateTime.now());
        return opdChargesRepository.save(existingCharge);
    }

    // Soft delete an IPD Charge
    public void deleteOPDCharge(String opdChargeId) {
        HMS_TM_OPDCharges opdCharge = opdChargesRepository.findByOpdChargeIdAndIsActiveTrue(opdChargeId)
                .orElseThrow(() -> new CustomException("OPD Charge not found with ID: " + opdChargeId, HttpStatus.BAD_REQUEST));
        opdCharge.setActive(false);
        opdCharge.setLastModifiedBy("Admin");
        opdCharge.setLastModifiedAt(LocalDateTime.now());
        opdChargesRepository.save(opdCharge);
    }

    // Get all active IPD Charges
    public List<HMS_TM_OPDCharges> getAllActiveOPDCharges() {
        return opdChargesRepository.findAllByIsActiveTrue();
    }

    // Get IPD Charges by IPD ID
    public List<HMS_TM_OPDCharges> getOPDChargesByOpdId(String opdId) {
        return opdChargesRepository.findByOpdIdAndIsActiveTrue(opdId);
    }

    // Get IPD Charge by IPD Charge ID
    public HMS_TM_OPDCharges getOPDChargeByOpdChargeId(String opdChargeId) {
        return opdChargesRepository.findByOpdChargeIdAndIsActiveTrue(opdChargeId)
                .orElseThrow(() -> new CustomException("IPD Charge not found with ID: " + opdChargeId, HttpStatus.BAD_REQUEST));
    }






}

