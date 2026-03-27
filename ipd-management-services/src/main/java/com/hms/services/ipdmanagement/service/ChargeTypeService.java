package com.hms.services.ipdmanagement.service;

import com.hms.services.ipdmanagement.entity.HMS_TM_IPDChargesCategory;
import com.hms.services.ipdmanagement.entity.HMS_TM_IPDChargesName;
import com.hms.services.ipdmanagement.entity.HMS_TM_IPDChargesType;
import com.hms.services.ipdmanagement.exception.CustomException;
import com.hms.services.ipdmanagement.model.IPDChargesCategoryDTO;
import com.hms.services.ipdmanagement.model.IPDChargesNameDTO;
import com.hms.services.ipdmanagement.model.IPDChargesTypeDTO;
import com.hms.services.ipdmanagement.repository.ChargeTypeRepository;
import com.hms.services.ipdmanagement.repository.IPDChargesCategoryRepository;
import com.hms.services.ipdmanagement.repository.IPDChargesNameRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ChargeTypeService {

    private final ChargeTypeRepository chargeTypeRepository;
    private final IPDChargesCategoryRepository categoryRepository;
    private final IPDChargesNameRepository chargesNameRepository;

    @Autowired
    public ChargeTypeService(ChargeTypeRepository chargeTypeRepository,
                             final IPDChargesCategoryRepository categoryRepository,final IPDChargesNameRepository chargesNameRepository) {
        this.chargeTypeRepository = chargeTypeRepository;
        this.categoryRepository=categoryRepository;
        this.chargesNameRepository=chargesNameRepository;
    }

    // Create a new ChargeType
    public HMS_TM_IPDChargesType createChargeType(HMS_TM_IPDChargesType chargeType) {
        try {
            chargeType.setActive(true);
            chargeType.setCreatedAt(LocalDateTime.now());
            return chargeTypeRepository.save(chargeType);
        }catch (Exception ex){
            throw new CustomException("Failed to create payment: " + ex.getMessage(), HttpStatus.BAD_REQUEST);
        }}

    // Get a ChargeType by ID
    public HMS_TM_IPDChargesType getChargeTypeById(String chargeTypeId) {
        return chargeTypeRepository.findByChargeTypeIdAndIsActiveTrue(chargeTypeId)
                .orElseThrow(() -> new CustomException("ChargeType with ID " + chargeTypeId + " not found", HttpStatus.NOT_FOUND));
    }

    // Get all ChargeTypes
    public List<HMS_TM_IPDChargesType> getAllChargeTypes() {
        return chargeTypeRepository.findByIsActiveTrue();
    }

    // Update a ChargeType
    public HMS_TM_IPDChargesType updateChargeType(String chargeTypeId, HMS_TM_IPDChargesType updatedChargeType) {
        HMS_TM_IPDChargesType existingChargeType = getChargeTypeById(chargeTypeId);
        existingChargeType.setChargeType(updatedChargeType.getChargeType());
        existingChargeType.setLastModifiedAt(LocalDateTime.now());
        existingChargeType.setLastModifiedBy(updatedChargeType.getLastModifiedBy());
        return chargeTypeRepository.save(existingChargeType);
    }

    // Soft delete a ChargeType
    @Transactional
    public void softDeleteChargeType(String chargeTypeId) {
        HMS_TM_IPDChargesType chargeType = getChargeTypeById(chargeTypeId);
        chargeType.setActive(false);
        chargeType.setLastModifiedAt(LocalDateTime.now());
        chargeTypeRepository.save(chargeType);
    }


    public void createIPDChargesTypeWithDetails(IPDChargesTypeDTO dto) {
        try {
            // Map DTO to Entity
            HMS_TM_IPDChargesType ipdChargesType = new HMS_TM_IPDChargesType();
            ipdChargesType.setChargeType(dto.getChargeType());
            ipdChargesType.setActive(true);
            ipdChargesType.setCreatedAt(LocalDateTime.now());
            ipdChargesType.setCreatedBy("vijay");
            ipdChargesType = chargeTypeRepository.save(ipdChargesType);

            // Save related categories and names
            for (IPDChargesCategoryDTO categoryDTO : dto.getChargesCategories()) {
                HMS_TM_IPDChargesCategory category = new HMS_TM_IPDChargesCategory();
                category.setChargeTypeId(ipdChargesType.getChargeTypeId());
                category.setChargeCategory(categoryDTO.getChargeCategory());
                category.setActive(true);
                category.setCreatedBy(categoryDTO.getCreatedBy());
                category = categoryRepository.save(category);

                for (IPDChargesNameDTO nameDTO : categoryDTO.getChargesNames()) {
                    HMS_TM_IPDChargesName name = new HMS_TM_IPDChargesName();
                    name.setChargeCategoryId(category.getChargeCategoryId());
                    name.setChargeName(nameDTO.getChargeName());
                    name.setStandardCharge(nameDTO.getStandardCharge());
                    name.setTpaCharge(nameDTO.getTpaCharge());
                    name.setTaxPercentage(nameDTO.getTaxPercentage());
                    name.setActive(true);
                    name.setCreatedBy(nameDTO.getCreatedBy());
                    chargesNameRepository.save(name);
                }
            }
        }catch(Exception ex){
            throw new CustomException("Failed to create chargeType " + ex.getMessage(), HttpStatus.BAD_REQUEST);
        }


    }
    @Transactional
    public Optional<HMS_TM_IPDChargesType> updateIPDChargesTypeWithDetails(String chargeTypeId, IPDChargesTypeDTO dto) {
        try {
            Optional<HMS_TM_IPDChargesType> existingTypeOpt = chargeTypeRepository.findByChargeTypeIdAndIsActiveTrue(chargeTypeId);

            if (existingTypeOpt.isPresent()) {
                HMS_TM_IPDChargesType ipdChargesType = existingTypeOpt.get();
                ipdChargesType.setChargeType(dto.getChargeType());
                ipdChargesType.setLastModifiedBy(dto.getLastModifiedBy());
                ipdChargesType.setLastModifiedAt(dto.getLastModifiedAt());

                // Update nested entities
                for (IPDChargesCategoryDTO categoryDTO : dto.getChargesCategories()) {
                    HMS_TM_IPDChargesCategory category = categoryRepository
                            .findByChargeCategoryIdAndIsActiveTrue(categoryDTO.getChargeCategoryId())
                            .orElse(new HMS_TM_IPDChargesCategory());

                    category.setChargeTypeId(ipdChargesType.getChargeTypeId());
                    category.setChargeCategory(categoryDTO.getChargeCategory());
                    category.setActive(categoryDTO.isActive());
                    category.setLastModifiedBy(categoryDTO.getLastModifiedBy());
                    category.setLastModifiedAt(categoryDTO.getLastModifiedAt());

                    category = categoryRepository.save(category);

                    for (IPDChargesNameDTO nameDTO : categoryDTO.getChargesNames()) {
                        HMS_TM_IPDChargesName name = chargesNameRepository
                                .findByChargeNameIdAndIsActiveTrue(nameDTO.getChargeNameId())
                                .orElse(new HMS_TM_IPDChargesName());

                        name.setChargeCategoryId(category.getChargeCategoryId());
                        name.setChargeName(nameDTO.getChargeName());
                        name.setStandardCharge(nameDTO.getStandardCharge());
                        name.setTpaCharge(nameDTO.getTpaCharge());
                        name.setTaxPercentage(nameDTO.getTaxPercentage());
                        name.setActive(nameDTO.isActive());
                        name.setLastModifiedBy(nameDTO.getLastModifiedBy());
                        name.setLastModifiedAt(nameDTO.getLastModifiedAt());

                        chargesNameRepository.save(name);
                    }
                }
                // Save the updated IPDChargesType entity
                chargeTypeRepository.save(ipdChargesType);
                return Optional.of(ipdChargesType);
            }
            return Optional.empty();
        } catch (Exception ex) {
            throw new CustomException("Failed to update chargeType " + ex.getMessage(), HttpStatus.BAD_REQUEST);
        }

    }


}
