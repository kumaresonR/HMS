package com.hms.services.adminmanagement.service;

import com.hms.services.adminmanagement.entity.HMS_TM_ChargeCategory;
import com.hms.services.adminmanagement.entity.HMS_TM_ChargeType;
import com.hms.services.adminmanagement.entity.HMS_TW_ChargeCategory;
import com.hms.services.adminmanagement.entity.HMS_TW_ChargeType;
import com.hms.services.adminmanagement.exceptionhandler.CustomException;
import com.hms.services.adminmanagement.model.ChargeCategoryDTO;
import com.hms.services.adminmanagement.model.ChargeTypeDTO;
import com.hms.services.adminmanagement.repository.HMS_TM_ChargeCategoryRepository;
import com.hms.services.adminmanagement.repository.HMS_TM_ChargeTypeRepository;
import com.hms.services.adminmanagement.repository.HMS_TW_ChargeCategoryRepository;
import com.hms.services.adminmanagement.repository.HMS_TW_ChargeTypeRepository;
import org.json.simple.JSONObject;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ChargeCategoryService {

    private final HMS_TM_ChargeCategoryRepository tmRepository;
    private final HMS_TW_ChargeCategoryRepository twRepository;
    private final HMS_TM_ChargeTypeRepository tmTypeRepository;
    private final HMS_TW_ChargeTypeRepository twTypeRepository;


    private final ModelMapper modelMapper;

    @Autowired
    public ChargeCategoryService(HMS_TM_ChargeCategoryRepository tmRepository,
                                 HMS_TW_ChargeCategoryRepository twRepository,final ModelMapper modelMapper,
                                 final HMS_TM_ChargeTypeRepository tmTypeRepository,final HMS_TW_ChargeTypeRepository twTypeRepository) {
        this.tmRepository = tmRepository;
        this.twRepository = twRepository;
        this.modelMapper = modelMapper;
        this.tmTypeRepository = tmTypeRepository;
        this.twTypeRepository = twTypeRepository;
    }

    // Create an entry in the Work Table
    public HMS_TW_ChargeCategory createInWorkTable(HMS_TW_ChargeCategory twChargeCategory) {
        try {
            twChargeCategory.setAuthStat("UnAuthorized");
            twChargeCategory.setRecordStat("Open");
            twChargeCategory.setCreatedBy("Admin");
            twChargeCategory.setModNo("V1");
            twChargeCategory.setCreatedAt(LocalDateTime.now());
            twChargeCategory.setActive(true);
            return twRepository.save(twChargeCategory);
        } catch (Exception ex) {
            throw new CustomException(ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    public HMS_TW_ChargeCategory approveWorkTableEntry(String workId, HMS_TW_ChargeCategory twChargeCategory) {
        try {
            HMS_TW_ChargeCategory existingTwChargeCategory = twRepository.findByCategoryIdAndIsActiveTrue(workId)
                    .orElseThrow(() -> new CustomException("Work table entry not found", HttpStatus.BAD_REQUEST));
            existingTwChargeCategory.setName(twChargeCategory.getName());
            existingTwChargeCategory.setChargeTypeId(twChargeCategory.getChargeTypeId());
            existingTwChargeCategory.setDescription(twChargeCategory.getDescription());
//            existingTwChargeCategory.setRecordStat(twChargeCategory.getRecordStat());
            existingTwChargeCategory.setLastModifiedAt(LocalDateTime.now());
            return twRepository.save(existingTwChargeCategory);
        } catch (Exception ex) {
            throw new CustomException(ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Get all Master Table entries
    public List<HMS_TM_ChargeCategory> getAllMasterEntries() {
        return tmRepository.findAllByIsActiveTrue();
    }

    // Get all Work Table entries
    public List<ChargeCategoryDTO> getAllWorkEntries() {
        List<HMS_TW_ChargeCategory> chargeCategories = twRepository.findAllByIsActiveTrue();
        return chargeCategories.stream()
                .map(chargeCategory -> {
                    ChargeCategoryDTO chargeCategoryDTO = modelMapper.map(chargeCategory, ChargeCategoryDTO.class);
                    if (chargeCategory.getChargeTypeId() != null) {
                        Optional<HMS_TM_ChargeType> chargeTypeOptional =
                                tmTypeRepository.findByChargeTypeIdAndIsActiveTrue(chargeCategory.getChargeTypeId());
                        chargeTypeOptional.ifPresent(chargeType -> {
                            ChargeTypeDTO chargeTypeDTO = new ChargeTypeDTO();
                            chargeTypeDTO.setChargeTypeId(chargeType.getChargeTypeId());
                            chargeTypeDTO.setChargeType(chargeType.getChargeType());
                            chargeTypeDTO.setModNo(chargeType.getModNo());
                            chargeTypeDTO.setAuthStat(chargeType.getAuthStat());
                            chargeTypeDTO.setRecordStat(chargeType.getRecordStat());
                            chargeTypeDTO.setAppointment(chargeType.isAppointment());
                            chargeTypeDTO.setOpd(chargeType.isOpd());
                            chargeTypeDTO.setIpd(chargeType.isIpd());
                            chargeTypeDTO.setPathology(chargeType.isPathology());
                            chargeTypeDTO.setRadiology(chargeType.isRadiology());
                            chargeTypeDTO.setBloodBank(chargeType.isBloodBank());
                            chargeTypeDTO.setAmbulance(chargeType.isAmbulance());
                            chargeTypeDTO.setActive(chargeType.isActive());
                            chargeTypeDTO.setCreatedAt(chargeType.getCreatedAt());
                            chargeTypeDTO.setCreatedBy(chargeType.getCreatedBy());
                            chargeTypeDTO.setLastModifiedBy(chargeType.getLastModifiedBy());
                            chargeTypeDTO.setLastModifiedAt(chargeType.getLastModifiedAt());

                            chargeCategoryDTO.setChargeType(chargeTypeDTO);
                        });
                    }
                    return chargeCategoryDTO;
                })
                .collect(Collectors.toList());
    }


    public JSONObject softDeleteWorkChargeCategory(String id) {
        HMS_TW_ChargeCategory chargeCategory = twRepository.findByCategoryIdAndIsActiveTrue(id)
                .orElseThrow(() -> new RuntimeException("Work Charge Category not found for the given ID: " + id));
        chargeCategory.setActive(false);
        chargeCategory.setRecordStat("Close");
        chargeCategory.setLastModifiedBy("SuperAdmin");
        chargeCategory.setLastModifiedAt(LocalDateTime.now());
        twRepository.save(chargeCategory);
        JSONObject response = new JSONObject();
        response.put("status", "Deleted Successfully");
        response.put("categoryId", id);
        return response;
    }

    public JSONObject softDeleteMasterChargeCategory(String id) {
        HMS_TM_ChargeCategory chargeCategory = tmRepository.findByCategoryIdAndIsActiveTrue(id)
                .orElseThrow(() -> new RuntimeException("Master Charge Category not found for the given ID: " + id));
        chargeCategory.setActive(false);
        chargeCategory.setRecordStat("Close");
        chargeCategory.setLastModifiedBy("SuperAdmin");
        chargeCategory.setLastModifiedAt(LocalDateTime.now());
        tmRepository.save(chargeCategory);
        JSONObject response = new JSONObject();
        response.put("status", "Deleted Successfully");
        response.put("categoryId", id);
        return response;
    }

    public HMS_TW_ChargeCategory updateAuthStatById(String id, String authStat) {
        HMS_TW_ChargeCategory existingChargeCategory = twRepository.findByCategoryIdAndIsActiveTrue(id)
                .orElseThrow(() -> new CustomException("Charge Category not found", HttpStatus.BAD_REQUEST));
        existingChargeCategory.setAuthStat(authStat);
        existingChargeCategory.setLastModifiedAt(LocalDateTime.now());
        existingChargeCategory.setLastModifiedBy("SuperAdmin");
        HMS_TW_ChargeCategory savedChargeCategory = twRepository.save(existingChargeCategory);
        if (authStat.equalsIgnoreCase("Authorized")) {
            HMS_TM_ChargeCategory tmChargeCategory = new HMS_TM_ChargeCategory();
            tmChargeCategory.setCategoryId(existingChargeCategory.getCategoryId());
            tmChargeCategory.setChargeTypeId(existingChargeCategory.getChargeTypeId());
            tmChargeCategory.setDescription(existingChargeCategory.getDescription());
            tmChargeCategory.setName(existingChargeCategory.getName());
            tmChargeCategory.setWtId(id);
            tmChargeCategory.setModNo(existingChargeCategory.getModNo());
            tmChargeCategory.setAuthStat(authStat);
            tmChargeCategory.setRecordStat(existingChargeCategory.getRecordStat());
            tmChargeCategory.setActive(true);
            tmChargeCategory.setCreatedAt(LocalDateTime.now());
            tmChargeCategory.setCreatedBy("SuperAdmin");
            tmChargeCategory.setLastModifiedAt(LocalDateTime.now());
            tmChargeCategory.setLastModifiedBy("SuperAdmin");
            tmRepository.save(tmChargeCategory);
        } else {
            Optional<HMS_TM_ChargeCategory> tmChargeCategory = tmRepository.findByWtIdAndIsActiveTrue(id);
            tmChargeCategory.ifPresent(tmRepository::delete);
        }
        return savedChargeCategory;
    }


    public List<HMS_TM_ChargeCategory> getByChargeType(String typeId) {
        return tmRepository.findAllByChargeTypeIdAndIsActiveTrue(typeId);
    }
}



