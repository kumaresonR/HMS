package com.hms.services.ipdmanagement.service;

import com.hms.services.ipdmanagement.entity.HMS_TM_IPDChargesName;
import com.hms.services.ipdmanagement.exception.CustomException;
import com.hms.services.ipdmanagement.repository.IPDChargesNameRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class IPDChargesNameService {

    private final IPDChargesNameRepository chargesNameRepository;

    @Autowired
    public IPDChargesNameService(IPDChargesNameRepository chargesNameRepository) {
        this.chargesNameRepository = chargesNameRepository;
    }

    // Create a new charge name
    public HMS_TM_IPDChargesName createChargeName(HMS_TM_IPDChargesName chargeName) {
        try {
            chargeName.setCreatedAt(LocalDateTime.now());
            chargeName.setActive(true);
            return chargesNameRepository.save(chargeName);
        }catch (Exception ex){
            throw new CustomException("Failed to create category: " + ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Get charges by chargeCategoryId
    public List<HMS_TM_IPDChargesName> getChargesByCategoryId(String chargeCategoryId) {
        List<HMS_TM_IPDChargesName> charges = chargesNameRepository.findByChargeCategoryIdAndIsActiveTrue(chargeCategoryId);
        if (charges.isEmpty()) {
            throw new CustomException("No charges found for category ID " + chargeCategoryId, HttpStatus.NOT_FOUND);
        }
        return charges;
    }

    // Get charges by chargeCategoryId
    public HMS_TM_IPDChargesName getChargesByChargeNameId(String chargeCategoryId) {
        Optional<HMS_TM_IPDChargesName> charges = chargesNameRepository.findByChargeNameIdAndIsActiveTrue(chargeCategoryId);
        return charges.get();
    }

    // Get all active charges
    public List<HMS_TM_IPDChargesName> getAllCharges() {
        return chargesNameRepository.findByIsActiveTrue();
    }

    // Update charge name
    public HMS_TM_IPDChargesName updateChargeName(String chargeNameId, HMS_TM_IPDChargesName updatedChargeName) {
        HMS_TM_IPDChargesName existingChargeName = getChargeNameById(chargeNameId);
        existingChargeName.setChargeName(updatedChargeName.getChargeName());
        existingChargeName.setStandardCharge(updatedChargeName.getStandardCharge());
        existingChargeName.setTpaCharge(updatedChargeName.getTpaCharge());
        existingChargeName.setTaxPercentage(updatedChargeName.getTaxPercentage());
        existingChargeName.setLastModifiedAt(LocalDateTime.now());
        existingChargeName.setLastModifiedBy(updatedChargeName.getLastModifiedBy());
        return chargesNameRepository.save(existingChargeName);
    }

    // Soft delete charge name
    public void softDeleteChargeName(String chargeNameId) {
        HMS_TM_IPDChargesName chargeName = getChargeNameById(chargeNameId);
        chargeName.setActive(false);
        chargeName.setLastModifiedAt(LocalDateTime.now());
        chargesNameRepository.save(chargeName);
    }

    // Helper method to find charge name by ID with custom exception
    private HMS_TM_IPDChargesName getChargeNameById(String chargeNameId) {
        return chargesNameRepository.findById(chargeNameId)
                .orElseThrow(() -> new CustomException("Charge Name with ID " + chargeNameId + " not found", HttpStatus.NOT_FOUND));
    }



}

