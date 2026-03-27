package com.hms.services.adminmanagement.service;

import com.hms.services.adminmanagement.entity.HMS_TM_SymptomsHead;
import com.hms.services.adminmanagement.entity.HMS_TM_SymptomsType;
import com.hms.services.adminmanagement.entity.HMS_TW_SymptomsHead;
import com.hms.services.adminmanagement.entity.HMS_TW_SymptomsType;
import com.hms.services.adminmanagement.exceptionhandler.CustomException;
import com.hms.services.adminmanagement.model.SymptomsHeadDTO;
import com.hms.services.adminmanagement.model.SymptomsTypeDTO;
import com.hms.services.adminmanagement.repository.HMS_TM_SymptomsHeadRepository;
import com.hms.services.adminmanagement.repository.HMS_TM_SymptomsTypeRepository;
import com.hms.services.adminmanagement.repository.HMS_TW_SymptomsHeadRepository;
import com.hms.services.adminmanagement.repository.HMS_TW_SymptomsTypeRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class SymptomsHeadService {

    private final HMS_TM_SymptomsHeadRepository tmRepository;
    private final HMS_TW_SymptomsHeadRepository twRepository;
    private final ModelMapper modelMapper;
    private final HMS_TM_SymptomsTypeRepository tmTypeRepository;
    private final HMS_TW_SymptomsTypeRepository twTypeRepository;


    @Autowired
    public SymptomsHeadService(HMS_TM_SymptomsHeadRepository tmRepository, HMS_TW_SymptomsHeadRepository twRepository,
                               final ModelMapper modelMapper,final HMS_TM_SymptomsTypeRepository tmTypeRepository,
                               final HMS_TW_SymptomsTypeRepository twTypeRepository) {
        this.tmRepository = tmRepository;
        this.twRepository = twRepository;
        this.modelMapper = modelMapper;
        this.tmTypeRepository = tmTypeRepository;
        this.twTypeRepository = twTypeRepository;
    }

    public List<HMS_TW_SymptomsHead> createInWorkTable(List<HMS_TW_SymptomsHead> twSymptomsHeads) {
        for (HMS_TW_SymptomsHead symptomsHead : twSymptomsHeads) {
            symptomsHead.setCreatedAt(LocalDateTime.now());
            symptomsHead.setModNo("V1");
            symptomsHead.setCreatedBy("Admin");
            symptomsHead.setAuthStat("UnAuthorized");
            symptomsHead.setRecordStat("Open");
            symptomsHead.setActive(true);
        }
        return twRepository.saveAll(twSymptomsHeads);
    }

    public HMS_TW_SymptomsHead approveWorkTableEntry(String workId, HMS_TW_SymptomsHead twSymptomsHead) {
        HMS_TW_SymptomsHead existingTwSymptomsHead = twRepository.findBySymptomsHeadIdAndIsActiveTrue(workId)
                .orElseThrow(() -> new CustomException("Work table entry not found", HttpStatus.BAD_REQUEST));
        existingTwSymptomsHead.setSymptomsHead(twSymptomsHead.getSymptomsHead());
        existingTwSymptomsHead.setDescription(twSymptomsHead.getDescription());
        existingTwSymptomsHead.setSymptomsTypeId(twSymptomsHead.getSymptomsTypeId());
//        existingTwSymptomsHead.setModNo(twSymptomsHead.getModNo());
        existingTwSymptomsHead.setLastModifiedBy("Admin");
        existingTwSymptomsHead.setLastModifiedAt(LocalDateTime.now());
        return twRepository.save(existingTwSymptomsHead);
    }

    public List<SymptomsHeadDTO> getAllMasterEntries() {
        List<HMS_TM_SymptomsHead> entities = tmRepository.findAllByIsActiveTrue();
        return entities.stream()
                .map(head -> {
                    SymptomsHeadDTO dto = modelMapper.map(head, SymptomsHeadDTO.class);
                    HMS_TM_SymptomsType existingSymptomsType =
                            tmTypeRepository.findBySymptomsTypeIdAndIsActiveTrue(head.getSymptomsTypeId());
                    if (existingSymptomsType != null) {
                        SymptomsTypeDTO typeDTO = modelMapper.map(existingSymptomsType, SymptomsTypeDTO.class);
                        dto.setSymptomsType(List.of(typeDTO));
                    }
                    return dto;
                })
                .collect(Collectors.toList());
    }

    public List<SymptomsHeadDTO> getAllWorkEntries() {
        List<HMS_TW_SymptomsHead> entities = twRepository.findAllByIsActiveTrue();
        return entities.stream()
                .map(head -> {
                    SymptomsHeadDTO dto = modelMapper.map(head, SymptomsHeadDTO.class);
                    Optional<HMS_TW_SymptomsType> existingSymptomsType =
                            twTypeRepository.findBySymptomsTypeIdAndIsActiveTrue(head.getSymptomsTypeId());
                    if (existingSymptomsType != null) {
                        SymptomsTypeDTO typeDTO = modelMapper.map(existingSymptomsType, SymptomsTypeDTO.class);
                        dto.setSymptomsType(List.of(typeDTO));
                    }
                    return dto;
                })
                .collect(Collectors.toList());
    }

    public HMS_TW_SymptomsHead updateAuthStatById(String id, String authStat) {
        HMS_TW_SymptomsHead existingSymptomsHead = twRepository.findBySymptomsHeadIdAndIsActiveTrue(id)
                .orElseThrow(() -> new CustomException("Symptoms head entry not found", HttpStatus.BAD_REQUEST));
        existingSymptomsHead.setAuthStat(authStat);
        existingSymptomsHead.setLastModifiedAt(LocalDateTime.now());
        existingSymptomsHead.setLastModifiedBy("SuperAdmin");
        HMS_TW_SymptomsHead savedSymptomsHead = twRepository.save(existingSymptomsHead);
        if (authStat.equalsIgnoreCase("Authorized")) {
            HMS_TM_SymptomsHead tmSymptomsHead = new HMS_TM_SymptomsHead();
            tmSymptomsHead.setSymptomsHeadId(existingSymptomsHead.getSymptomsHeadId());
            tmSymptomsHead.setSymptomsHead(savedSymptomsHead.getSymptomsHead());
            tmSymptomsHead.setSymptomsTypeId(savedSymptomsHead.getSymptomsTypeId());
            tmSymptomsHead.setWtId(savedSymptomsHead.getSymptomsHeadId());
            tmSymptomsHead.setModNo(savedSymptomsHead.getModNo());
            tmSymptomsHead.setAuthStat(authStat);
            tmSymptomsHead.setRecordStat(savedSymptomsHead.getRecordStat());
            tmSymptomsHead.setActive(true);
            tmSymptomsHead.setDescription(savedSymptomsHead.getDescription());
            tmSymptomsHead.setCreatedAt(LocalDateTime.now());
            tmSymptomsHead.setCreatedBy("SuperAdmin");
            tmSymptomsHead.setLastModifiedAt(LocalDateTime.now());
            tmSymptomsHead.setLastModifiedBy("SuperAdmin");
            tmRepository.save(tmSymptomsHead);
        } else {
            Optional<HMS_TM_SymptomsHead> tmSymptomsHead = tmRepository.findByWtIdAndIsActiveTrue(id);
            tmSymptomsHead.ifPresent(tmRepository::delete);
        }

        return savedSymptomsHead;
    }


}


