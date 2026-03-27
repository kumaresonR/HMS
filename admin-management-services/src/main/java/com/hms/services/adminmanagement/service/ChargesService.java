package com.hms.services.adminmanagement.service;


import com.hms.services.adminmanagement.entity.*;
import com.hms.services.adminmanagement.exceptionhandler.CustomException;
import com.hms.services.adminmanagement.model.*;
import com.hms.services.adminmanagement.repository.*;
import org.json.simple.JSONObject;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ChargesService {

    private static final Logger logger = LoggerFactory.getLogger(ChargesService.class);

    private final HMS_TM_ChargesRepository tmRepository;
    private final HMS_TW_ChargesRepository twRepository;
    private final ModelMapper modelMapper;
    private final HMS_TW_ScheduleChargeRepository twScheduleChargeRepository;
    private final HMS_TM_ScheduleChargeRepository tmScheduleChargeRepository;
    private final HMS_TW_TaxCategoryRepository taxCategoryRepository;
    private final HMS_TW_UnitTypeRepository unitTypeRepository;
    private final HMS_TW_ChargeTypeRepository chargeTypeRepository;
    private final HMS_TW_ChargeCategoryRepository chargeCategoryRepository;
    private final HMS_TM_UnitTypeRepository tmUnitTypeRepository;
    private final HMS_TM_ChargeTypeRepository tmChargeTypeRepository;
    private final HMS_TM_ChargeCategoryRepository tmChargeCategoryRepository;
    private final HMS_TM_TaxCategoryRepository tmTaxCategoryRepository;


    @Autowired
    public ChargesService(HMS_TM_ChargesRepository tmRepository, HMS_TW_ChargesRepository twRepository,
                          final ModelMapper modelMapper,final HMS_TW_ScheduleChargeRepository twScheduleChargeRepository,
    final HMS_TM_ScheduleChargeRepository tmScheduleChargeRepository,final HMS_TW_TaxCategoryRepository taxCategoryRepository,
                          final HMS_TW_UnitTypeRepository unitTypeRepository,final HMS_TW_ChargeTypeRepository chargeTypeRepository,
                         final HMS_TW_ChargeCategoryRepository chargeCategoryRepository,
                          final HMS_TM_UnitTypeRepository tmUnitTypeRepository,final HMS_TM_ChargeTypeRepository tmChargeTypeRepository,
                          final HMS_TM_ChargeCategoryRepository tmChargeCategoryRepository,final HMS_TM_TaxCategoryRepository tmTaxCategoryRepository) {
        this.tmRepository = tmRepository;
        this.twRepository = twRepository;
        this.modelMapper = modelMapper;
        this.twScheduleChargeRepository = twScheduleChargeRepository;
        this.tmScheduleChargeRepository=tmScheduleChargeRepository;
        this.taxCategoryRepository = taxCategoryRepository;
        this.unitTypeRepository = unitTypeRepository;
        this.chargeTypeRepository = chargeTypeRepository;
        this.chargeCategoryRepository = chargeCategoryRepository;
        this.tmUnitTypeRepository = tmUnitTypeRepository;
        this.tmChargeTypeRepository = tmChargeTypeRepository;
        this.tmChargeCategoryRepository = tmChargeCategoryRepository;
        this.tmTaxCategoryRepository = tmTaxCategoryRepository;
    }

    // Create an entry in the Work Table
    @Transactional
    public ChargeDTO createInWorkTable(ChargeDTO chargeDTO) {
        try {
            HMS_TW_Charges workCharge = modelMapper.map(chargeDTO, HMS_TW_Charges.class);
            workCharge.setCreatedAt(LocalDateTime.now());
            workCharge.setCreatedBy("Admin");
            workCharge.setActive(true);
            workCharge.setModNo("V1");
            workCharge.setAuthStat("UnAuthorized");
            workCharge.setRecordStat("Open");
            HMS_TW_Charges charges=twRepository.save(workCharge);
            List<HMS_TW_ScheduleCharge> schedulCharges=null;
            if (chargeDTO.getScheduleCharges() != null && !chargeDTO.getScheduleCharges().isEmpty()) {
                List<HMS_TW_ScheduleCharge> scheduleCharges = chargeDTO.getScheduleCharges().stream()
                        .map(dto -> {
                            HMS_TW_ScheduleCharge scheduleCharge = modelMapper.map(dto, HMS_TW_ScheduleCharge.class);
                            scheduleCharge.setChargeId(charges.getChargeId());
                            scheduleCharge.setId(dto.getId());
                            scheduleCharge.setCreatedAt(LocalDateTime.now());
                            scheduleCharge.setCreatedBy("Admin");
                            scheduleCharge.setActive(true);
                            return scheduleCharge;
                        }).toList();
                schedulCharges=twScheduleChargeRepository.saveAll(scheduleCharges);
            }
            ChargeDTO responseDTO = modelMapper.map(charges, ChargeDTO.class);
            if (schedulCharges != null && !schedulCharges.isEmpty()) {
                List<ScheduleChargeDTO> scheduleChargeDTOs = schedulCharges.stream()
                        .map(scheduleCharge -> modelMapper.map(scheduleCharge, ScheduleChargeDTO.class))
                        .toList();
                responseDTO.setScheduleCharges(scheduleChargeDTOs);
            }
            return responseDTO;
        }catch (Exception ex){
            throw new CustomException(ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Approve a Work Table entry and move it to the Master Table
    @Transactional
    public ChargeDTO approveWorkTableEntry(String workId, ChargeDTO chargeDTO) {
        try {
            HMS_TW_Charges existingWorkCharge = twRepository.findByChargeIdAndIsActiveTrue(workId)
                    .orElseThrow(() -> new RuntimeException("Work table entry not found"));
            existingWorkCharge.setLastModifiedAt(LocalDateTime.now());
            existingWorkCharge.setChargeName(chargeDTO.getChargeName());
            existingWorkCharge.setChargeTypeId(chargeDTO.getChargeTypeId());
            existingWorkCharge.setCategoryId(chargeDTO.getCategoryId());
            existingWorkCharge.setUnitTypeId(chargeDTO.getUnitTypeId());
            existingWorkCharge.setTaxCategoryId(chargeDTO.getTaxCategoryId());
            existingWorkCharge.setTaxPercentage(chargeDTO.getTaxPercentage());
            existingWorkCharge.setStandardCharge(chargeDTO.getStandardCharge());
            existingWorkCharge.setDescription(chargeDTO.getDescription());
            existingWorkCharge.setActive(true);
            existingWorkCharge.setLastModifiedAt(LocalDateTime.now());
            HMS_TW_Charges updatedWorkCharge = twRepository.save(existingWorkCharge);
            List<HMS_TW_ScheduleCharge> schedulCharges=null;
            if (chargeDTO.getScheduleCharges() != null && !chargeDTO.getScheduleCharges().isEmpty()) {
                twScheduleChargeRepository.deleteByChargeId(workId);
                List<HMS_TW_ScheduleCharge> newScheduleCharges = chargeDTO.getScheduleCharges().stream()
                        .map(dto -> {
                            HMS_TW_ScheduleCharge scheduleCharge = modelMapper.map(dto, HMS_TW_ScheduleCharge.class);
                            scheduleCharge.setChargeId(workId);
                            scheduleCharge.setId(dto.getId());
                            scheduleCharge.setCreatedAt(LocalDateTime.now());
                            scheduleCharge.setCreatedBy("Admin");
                            scheduleCharge.setActive(true);
                            return scheduleCharge;
                        }).toList();
                schedulCharges=twScheduleChargeRepository.saveAll(newScheduleCharges);
            }
            ChargeDTO responseDTO = modelMapper.map(updatedWorkCharge, ChargeDTO.class);
            if (schedulCharges != null && !schedulCharges.isEmpty()) {
                List<ScheduleChargeDTO> scheduleChargeDTOs = schedulCharges.stream()
                        .map(scheduleCharge -> modelMapper.map(scheduleCharge, ScheduleChargeDTO.class))
                        .toList();
                responseDTO.setScheduleCharges(scheduleChargeDTOs);
            }
            return responseDTO;
        } catch (Exception ex) {
            throw new CustomException(ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Get all entries from the Master Table
    public List<CombinedCharges> getAllMasterEntries() {
        List<HMS_TM_Charges> charges = tmRepository.findAllByIsActiveTrue();
        return charges.stream().map(charge -> {
            CombinedCharges combinedCharges = modelMapper.map(charge, CombinedCharges.class);
            ChargeTypeDTO chargeTypeDTO = tmChargeTypeRepository.findByChargeTypeIdAndIsActiveTrue(charge.getChargeTypeId())
                    .map(c -> modelMapper.map(c, ChargeTypeDTO.class)).orElse(null);
            combinedCharges.setChargeType(chargeTypeDTO);

            ChargeCategoryDTO chargeCategoryDTO = tmChargeCategoryRepository.findByCategoryIdAndIsActiveTrue(charge.getCategoryId())
                    .map(c -> modelMapper.map(c, ChargeCategoryDTO.class)).orElse(null);
            combinedCharges.setChargeCategory(chargeCategoryDTO);

            UnitTypeDTO unitTypeDTO = tmUnitTypeRepository.findByIdAndIsActiveTrue(charge.getUnitTypeId())
                    .map(c -> modelMapper.map(c, UnitTypeDTO.class)).orElse(null);
            combinedCharges.setUnitType(unitTypeDTO);

            TaxCategoryDTO taxCategoryDTO = tmTaxCategoryRepository.findByIdAndIsActiveTrue(charge.getTaxCategoryId())
                    .map(c -> modelMapper.map(c, TaxCategoryDTO.class)).orElse(null);
            combinedCharges.setTaxCategory(taxCategoryDTO);
            List<ScheduleChargeDTO> scheduleChargeDTOs = tmScheduleChargeRepository.findAllByChargeIdAndIsActiveTrue(charge.getChargeId())
                    .stream()
                    .map(scheduleCharge -> modelMapper.map(scheduleCharge, ScheduleChargeDTO.class))
                    .collect(Collectors.toList());
            combinedCharges.setScheduleCharges(scheduleChargeDTOs);
            return combinedCharges;
        }).collect(Collectors.toList());
    }

    // Get all entries from the Work Table
    public List<CombinedCharges> getAllWorkEntries() {
        List<HMS_TW_Charges> charges = twRepository.findAllByIsActiveTrue();
        return charges.stream().map(charge -> {
            CombinedCharges combinedCharges = modelMapper.map(charge, CombinedCharges.class);
            ChargeTypeDTO chargeTypeDTO = tmChargeTypeRepository.findByChargeTypeIdAndIsActiveTrue(charge.getChargeTypeId())
                    .map(c -> modelMapper.map(c, ChargeTypeDTO.class)).orElse(null);
            combinedCharges.setChargeType(chargeTypeDTO);

            ChargeCategoryDTO chargeCategoryDTO = tmChargeCategoryRepository.findByCategoryIdAndIsActiveTrue(charge.getCategoryId())
                    .map(c -> modelMapper.map(c, ChargeCategoryDTO.class)).orElse(null);
            combinedCharges.setChargeCategory(chargeCategoryDTO);

            UnitTypeDTO unitTypeDTO = tmUnitTypeRepository.findByIdAndIsActiveTrue(charge.getUnitTypeId())
                    .map(c -> modelMapper.map(c, UnitTypeDTO.class)).orElse(null);
            combinedCharges.setUnitType(unitTypeDTO);

            TaxCategoryDTO taxCategoryDTO = tmTaxCategoryRepository.findByIdAndIsActiveTrue(charge.getTaxCategoryId())
                    .map(c -> modelMapper.map(c, TaxCategoryDTO.class)).orElse(null);
            combinedCharges.setTaxCategory(taxCategoryDTO);
            List<ScheduleChargeDTO> scheduleChargeDTOs = twScheduleChargeRepository.findAllByChargeIdAndIsActiveTrue(charge.getChargeId())
                    .stream()
                    .map(scheduleCharge -> modelMapper.map(scheduleCharge, ScheduleChargeDTO.class))
                    .collect(Collectors.toList());
            combinedCharges.setScheduleCharges(scheduleChargeDTOs);
            return combinedCharges;
        }).collect(Collectors.toList());
    }

    public JSONObject softDeleteWorkCharge(String id) {
        HMS_TW_Charges charge = twRepository.findByChargeIdAndIsActiveTrue(id)
                .orElseThrow(() -> new RuntimeException("Work Charge not found for the given ID: " + id));
        List<HMS_TW_ScheduleCharge> scheduleCharges =twScheduleChargeRepository.findAllByChargeIdAndIsActiveTrue(charge.getChargeId());
        charge.setActive(false);
        charge.setLastModifiedAt(LocalDateTime.now());
        twRepository.save(charge);
        if(scheduleCharges!=null && !scheduleCharges.isEmpty()) {
        for (HMS_TW_ScheduleCharge scheduleCharge : scheduleCharges) {
            scheduleCharge.setActive(false);
            scheduleCharge.setLastModifiedAt(LocalDateTime.now());
            twScheduleChargeRepository.save(scheduleCharge);
        }}
        JSONObject response = new JSONObject();
        response.put("status", "Deleted Successfully");
        response.put("chargeId", id);
        response.put("scheduleCharges", scheduleCharges.stream().map(HMS_TW_ScheduleCharge::getId).collect(Collectors.toList()));
        return response;
    }

    public JSONObject softDeleteMasterCharge(String id) {
        HMS_TM_Charges charge = tmRepository.findBychargeIdAndIsActiveTrue(id)
                .orElseThrow(() -> new RuntimeException("Master Charge not found for the given ID: " + id));
        charge.setActive(false);
        charge.setLastModifiedAt(LocalDateTime.now());
        tmRepository.save(charge);
        JSONObject response = new JSONObject();
        response.put("status", "Deleted Successfully");
        response.put("chargeId", id);
        return response;
    }


    public ChargeDTO updateAuthStatById(String id, String authStat) {
        HMS_TW_Charges existingCharge = twRepository.findByChargeIdAndIsActiveTrue(id)
                .orElseThrow(() -> new CustomException("Charge not found", HttpStatus.BAD_REQUEST));
        List<HMS_TW_ScheduleCharge> scheduleCharges = twScheduleChargeRepository.findAllByChargeIdAndIsActiveTrue(id);
//        if(scheduleCharges!=null && !scheduleCharges.isEmpty()) {
//            throw new CustomException("scheduleCharges not found", HttpStatus.BAD_REQUEST);
//        }
        existingCharge.setAuthStat(authStat);
        existingCharge.setLastModifiedAt(LocalDateTime.now());
        existingCharge.setLastModifiedBy("SuperAdmin");
        HMS_TW_Charges savedCharge = twRepository.save(existingCharge);
        ChargeDTO chargeDTO = modelMapper.map(savedCharge, ChargeDTO.class);
        chargeDTO.setScheduleCharges(scheduleCharges.stream()
                .map(this::mapToScheduleChargeDTO)
                .collect(Collectors.toList()));
        if (authStat.equalsIgnoreCase("Authorized")) {
                HMS_TM_Charges tmCharge = new HMS_TM_Charges();
                tmCharge.setChargeId(existingCharge.getChargeId());
                tmCharge.setWtId(id);
                tmCharge.setChargeTypeId(existingCharge.getChargeTypeId());  // chargeTypeId instead of chargeType
                tmCharge.setCategoryId(existingCharge.getCategoryId()); // chargeCategoryId
                tmCharge.setUnitTypeId(existingCharge.getUnitTypeId()); // unitTypeId
                tmCharge.setTaxCategoryId(existingCharge.getTaxCategoryId()); // taxCategoryId
                tmCharge.setChargeName(existingCharge.getChargeName());
                tmCharge.setTaxPercentage(existingCharge.getTaxPercentage());
                tmCharge.setStandardCharge(existingCharge.getStandardCharge());
                tmCharge.setDescription(existingCharge.getDescription());  // Description might be empty or nullable
                tmCharge.setModNo(existingCharge.getModNo());
                tmCharge.setAuthStat(authStat);
                tmCharge.setRecordStat(existingCharge.getRecordStat()); // Assuming recordStat is coming from the savedCharge
                tmCharge.setActive(true);
                tmCharge.setCreatedAt(LocalDateTime.now());
                tmCharge.setCreatedBy("SuperAdmin");
                tmCharge.setLastModifiedAt(LocalDateTime.now());
                tmCharge.setLastModifiedBy("SuperAdmin");
            HMS_TM_Charges tmCharges=tmRepository.save(tmCharge);
            if (scheduleCharges != null && !scheduleCharges.isEmpty()) {
                List<HMS_TM_ScheduleCharge> tmScheduleCharges = scheduleCharges.stream()
                        .map(scheduleCharge -> {
                            HMS_TM_ScheduleCharge tmScheduleCharge = new HMS_TM_ScheduleCharge();
                            tmScheduleCharge.setChargeId(tmCharges.getChargeId());
                            tmScheduleCharge.setCharge(scheduleCharge.getCharge());
                            tmScheduleCharge.setScheduleChargeId(scheduleCharge.getScheduleChargeId());
                            tmScheduleCharge.setId(scheduleCharge.getId());
                            tmScheduleCharge.setActive(true);
                            tmScheduleCharge.setCreatedAt(LocalDateTime.now());
                            tmScheduleCharge.setCreatedBy("SuperAdmin");
                            tmScheduleCharge.setLastModifiedAt(LocalDateTime.now());
                            tmScheduleCharge.setLastModifiedBy("SuperAdmin");
                            return tmScheduleCharge;
                        })
                        .collect(Collectors.toList());
                tmScheduleChargeRepository.saveAll(tmScheduleCharges);
            }

        } else {
            Optional<HMS_TM_Charges> tmCharge = tmRepository.findByWtIdAndIsActiveTrue(id);
            tmCharge.ifPresent(tmRepository::delete);
            List<HMS_TM_ScheduleCharge> existingTmScheduleCharges = tmScheduleChargeRepository.findAllByChargeIdAndIsActiveTrue(id);
            if (!existingTmScheduleCharges.isEmpty()) {
                tmScheduleChargeRepository.deleteAll(existingTmScheduleCharges);
            }
        }
        return chargeDTO;
    }

    private ScheduleChargeDTO mapToScheduleChargeDTO(HMS_TW_ScheduleCharge scheduleCharge) {
        ScheduleChargeDTO dto = new ScheduleChargeDTO();
        dto.setScheduleChargeId(scheduleCharge.getScheduleChargeId());
        dto.setId(scheduleCharge.getId());
        dto.setCharge(scheduleCharge.getCharge());
        return dto;
    }


    public CombinedCharges getAllByCategoryId(String categoryId) {
        HMS_TM_Charges charge = tmRepository.findByCategoryIdAndIsActiveTrue(categoryId);
        if(charge != null) {
            CombinedCharges combinedCharges = modelMapper.map(charge, CombinedCharges.class);
            UnitTypeDTO unitTypeDTO = tmUnitTypeRepository.findByIdAndIsActiveTrue(charge.getUnitTypeId())
                    .map(unitType -> modelMapper.map(unitType, UnitTypeDTO.class))
                    .orElse(null);
            combinedCharges.setUnitType(unitTypeDTO);
            TaxCategoryDTO taxCategoryDTO = tmTaxCategoryRepository.findByIdAndIsActiveTrue(charge.getTaxCategoryId())
                    .map(taxCategory -> modelMapper.map(taxCategory, TaxCategoryDTO.class))
                    .orElse(null);
            combinedCharges.setTaxCategory(taxCategoryDTO);
            List<ScheduleChargeDTO> scheduleChargeDTOs = tmScheduleChargeRepository.findAllByChargeIdAndIsActiveTrue(charge.getChargeId())
                    .stream()
                    .map(scheduleCharge -> modelMapper.map(scheduleCharge, ScheduleChargeDTO.class))
                    .collect(Collectors.toList());
            combinedCharges.setScheduleCharges(scheduleChargeDTOs);
            return combinedCharges;
        }
        return null;
    }


    public CombinedCharges getAllByChargeId(String chargeId, String InsuranceId) {
        logger.debug("Getting charges for InsuranceID: {}", InsuranceId);
        Optional<HMS_TM_Charges> chargeOptional = tmRepository.findByChargeIdAndIsActiveTrue(chargeId);
        if (chargeOptional.isEmpty()) {
            return null;
        }
        HMS_TM_Charges charge = chargeOptional.get();
        CombinedCharges combinedCharges = modelMapper.map(charge, CombinedCharges.class);
        ChargeTypeDTO chargeTypeDTO = tmChargeTypeRepository.findByChargeTypeIdAndIsActiveTrue(charge.getChargeTypeId())
                .map(c -> modelMapper.map(c, ChargeTypeDTO.class))
                .orElse(null);
        combinedCharges.setChargeType(chargeTypeDTO);

        ChargeCategoryDTO chargeCategoryDTO = tmChargeCategoryRepository.findByCategoryIdAndIsActiveTrue(charge.getCategoryId())
                .map(c -> modelMapper.map(c, ChargeCategoryDTO.class))
                .orElse(null);
        combinedCharges.setChargeCategory(chargeCategoryDTO);

        UnitTypeDTO unitTypeDTO = tmUnitTypeRepository.findByIdAndIsActiveTrue(charge.getUnitTypeId())
                .map(c -> modelMapper.map(c, UnitTypeDTO.class))
                .orElse(null);
        combinedCharges.setUnitType(unitTypeDTO);

        TaxCategoryDTO taxCategoryDTO = tmTaxCategoryRepository.findByIdAndIsActiveTrue(charge.getTaxCategoryId())
                .map(c -> modelMapper.map(c, TaxCategoryDTO.class))
                .orElse(null);
        combinedCharges.setTaxCategory(taxCategoryDTO);
        if(InsuranceId!=null){
                    List<ScheduleChargeDTO> scheduleChargeDTOs = tmScheduleChargeRepository.findAllByIdAndIsActiveTrue(InsuranceId)
                .stream()
                .map(scheduleCharge -> modelMapper.map(scheduleCharge, ScheduleChargeDTO.class))
                .collect(Collectors.toList());
        combinedCharges.setScheduleCharges(scheduleChargeDTOs);
        }
//        List<ScheduleChargeDTO> scheduleChargeDTOs = twScheduleChargeRepository.findAllByChargeIdAndIsActiveTrue(charge.getChargeId())
//                .stream()
//                .map(scheduleCharge -> modelMapper.map(scheduleCharge, ScheduleChargeDTO.class))
//                .collect(Collectors.toList());
//        combinedCharges.setScheduleCharges(scheduleChargeDTOs);

        return combinedCharges;

    }



}



