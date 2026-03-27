package com.hms.services.adminmanagement.service;

import com.hms.services.adminmanagement.entity.HMS_TM_BedGroup;
import com.hms.services.adminmanagement.entity.HMS_TM_Floor;
import com.hms.services.adminmanagement.entity.HMS_TW_BedGroup;
import com.hms.services.adminmanagement.entity.HMS_TW_Floor;
import com.hms.services.adminmanagement.exceptionhandler.CustomException;
import com.hms.services.adminmanagement.model.BedGroupDTO;
import com.hms.services.adminmanagement.model.BedGroupFloorDTO;
import com.hms.services.adminmanagement.model.FloorDTO;
import com.hms.services.adminmanagement.repository.HMS_TM_BedGroupRepository;
import com.hms.services.adminmanagement.repository.HMS_TM_FloorRepository;
import com.hms.services.adminmanagement.repository.HMS_TW_BedGroupRepository;
import com.hms.services.adminmanagement.repository.HMS_TW_FloorRepository;
import jakarta.persistence.EntityNotFoundException;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BedGroupService {

    private final HMS_TW_BedGroupRepository twRepository;
    private final HMS_TM_BedGroupRepository tmRepository;
    private final HMS_TW_FloorRepository twFloorRepository;
    private final HMS_TM_FloorRepository tmFloorRepository;

    @Autowired
    public BedGroupService(final HMS_TW_BedGroupRepository twRepository, final HMS_TM_BedGroupRepository tmRepository,
                           final HMS_TW_FloorRepository twFloorRepository, final HMS_TM_FloorRepository tmFloorRepository) {
        this.twRepository = twRepository;
        this.tmRepository = tmRepository;
        this.twFloorRepository = twFloorRepository;
        this.tmFloorRepository = tmFloorRepository;
    }
    public HMS_TW_BedGroup createInWorkTable(HMS_TW_BedGroup twBedGroup) {
        twBedGroup.setAuthStat("UnAuthorized");
        twBedGroup.setModNo("V1");
        twBedGroup.setRecordStat("Open");
        twBedGroup.setCreatedAt(LocalDateTime.now());
        twBedGroup.setCreatedBy("Admin");
        twBedGroup.setActive(true);
        return twRepository.save(twBedGroup);
    }

    public HMS_TW_BedGroup approveWorkTableEntry(String workId, HMS_TW_BedGroup twBedGroup) {
        HMS_TW_BedGroup existingTwBedGroup = twRepository.findByBedGroupIdAndIsActiveTrue(workId)
                .orElseThrow(() -> new CustomException("Work table entry not found", HttpStatus.BAD_REQUEST));
        existingTwBedGroup.setName(twBedGroup.getName());
        existingTwBedGroup.setDescription(twBedGroup.getDescription());
        existingTwBedGroup.setFloorId(twBedGroup.getFloorId());
        existingTwBedGroup.setActive(true);
        existingTwBedGroup.setLastModifiedAt(LocalDateTime.now());
        existingTwBedGroup.setLastModifiedBy("SuperAdmin");
        return twRepository.save(existingTwBedGroup);
    }

    public List<BedGroupFloorDTO> getAllMasterEntries(int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Order.desc("createdAt")));
        List<HMS_TM_BedGroup> bedGroupList = tmRepository.findAllByIsActiveTrue(pageRequest).getContent();
        return bedGroupList.stream().map(bedGroup -> {
            BedGroupFloorDTO bedGroupFloorDTO = new BedGroupFloorDTO();
            bedGroupFloorDTO.setBedGroupId(bedGroup.getBedGroupId());
            bedGroupFloorDTO.setBedGroupName(bedGroup.getName());
            bedGroupFloorDTO.setBedGroupDescription(bedGroup.getDescription());
            bedGroupFloorDTO.setModNo(bedGroup.getModNo());
            bedGroupFloorDTO.setAuthStat(bedGroup.getAuthStat());
            bedGroupFloorDTO.setRecordStat(bedGroup.getRecordStat());
            bedGroupFloorDTO.setActive(bedGroup.isActive());
            Optional<HMS_TM_Floor> floorOptional = tmFloorRepository.findByFloorIdAndIsActiveTrue(bedGroup.getFloorId());
            floorOptional.ifPresent(floor -> {
                FloorDTO floorDTO = new FloorDTO();
                floorDTO.setFloorId(floor.getFloorId());
                floorDTO.setFloorName(floor.getFloorName());
                floorDTO.setFloorDescription(floor.getDescription());
                floorDTO.setModNo(floor.getModNo());
                floorDTO.setAuthStat(floor.getAuthStat());
                floorDTO.setRecordStat(floor.getRecordStat());
                floorDTO.setActive(floor.isActive());
                bedGroupFloorDTO.setFloor(floorDTO);
            });
            return bedGroupFloorDTO;
        }).collect(Collectors.toList());
    }

    public List<BedGroupFloorDTO> getAllWorkEntries(int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Order.desc("createdAt")));
        List<HMS_TW_BedGroup> bedGroupList = twRepository.findAllByIsActiveTrue(pageRequest).getContent();
        return bedGroupList.stream().map(bedGroup -> {
            BedGroupFloorDTO bedGroupFloorDTO = new BedGroupFloorDTO();
            bedGroupFloorDTO.setBedGroupId(bedGroup.getBedGroupId());
            bedGroupFloorDTO.setBedGroupName(bedGroup.getName());
            bedGroupFloorDTO.setBedGroupDescription(bedGroup.getDescription());
            bedGroupFloorDTO.setModNo(bedGroup.getModNo());
            bedGroupFloorDTO.setAuthStat(bedGroup.getAuthStat());
            bedGroupFloorDTO.setRecordStat(bedGroup.getRecordStat());
            bedGroupFloorDTO.setActive(bedGroup.isActive());
            Optional<HMS_TM_Floor> floorOptional = tmFloorRepository.findByFloorIdAndIsActiveTrue(bedGroup.getFloorId());
            floorOptional.ifPresent(floor -> {
                FloorDTO floorDTO = new FloorDTO();
                floorDTO.setFloorId(floor.getFloorId());
                floorDTO.setFloorName(floor.getFloorName());
                floorDTO.setFloorDescription(floor.getDescription());
                floorDTO.setModNo(floor.getModNo());
                floorDTO.setAuthStat(floor.getAuthStat());
                floorDTO.setRecordStat(floor.getRecordStat());
                floorDTO.setActive(floor.isActive());
                bedGroupFloorDTO.setFloor(floorDTO);
            });
            return bedGroupFloorDTO;
        }).collect(Collectors.toList());
    }

    public JSONObject softDeleteWorkBedGroup(String bedGroupId) {
        HMS_TW_BedGroup bedGroup = twRepository.findByBedGroupIdAndIsActiveTrue(bedGroupId)
                .orElseThrow(() -> new RuntimeException("Work BedGroup not found for ID: " + bedGroupId));
        bedGroup.setActive(false);
        bedGroup.setRecordStat("Close");
        bedGroup.setLastModifiedBy("SuperAdmin");
        bedGroup.setLastModifiedAt(LocalDateTime.now());
        twRepository.save(bedGroup);
        JSONObject response = new JSONObject();
        response.put("status", "Deleted Successfully");
        response.put("bedGroupId", bedGroupId);
        return response;
    }

    public JSONObject softDeleteMasterBedGroup(String bedGroupId) {
        HMS_TM_BedGroup bedGroup = tmRepository.findByBedGroupIdAndIsActiveTrue(bedGroupId)
                .orElseThrow(() -> new RuntimeException("Master BedGroup not found for ID: " + bedGroupId));
        bedGroup.setActive(false);
        bedGroup.setRecordStat("Close");
        bedGroup.setLastModifiedBy("SuperAdmin");
        bedGroup.setLastModifiedAt(LocalDateTime.now());
        tmRepository.save(bedGroup);
        JSONObject response = new JSONObject();
        response.put("status", "Deleted Successfully");
        response.put("bedGroupId", bedGroupId);
        return response;
    }

    @Transactional
    public HMS_TW_BedGroup updateAuthStatById(String id, String authStat) {
        HMS_TW_BedGroup twBedGroup = twRepository.findByBedGroupIdAndIsActiveTrue(id)
                .orElseThrow(() -> new EntityNotFoundException("BedGroup with ID " + id + " not found."));
        twBedGroup.setAuthStat(authStat);
        twBedGroup.setLastModifiedAt(LocalDateTime.now());
        twBedGroup.setLastModifiedBy("SuperAdmin");
        twRepository.save(twBedGroup);
        if (authStat.equalsIgnoreCase("Authorized")) {
            HMS_TM_BedGroup tmBedGroup = new HMS_TM_BedGroup();
            tmBedGroup.setBedGroupId(twBedGroup.getBedGroupId());
            tmBedGroup.setName(twBedGroup.getName());
            tmBedGroup.setFloorId(twBedGroup.getFloorId());
            tmBedGroup.setDescription(twBedGroup.getDescription());
            tmBedGroup.setWtId(twBedGroup.getBedGroupId());
            tmBedGroup.setModNo(twBedGroup.getModNo());
            tmBedGroup.setRecordStat(twBedGroup.getRecordStat());
            tmBedGroup.setAuthStat(authStat);
            tmBedGroup.setCreatedAt(LocalDateTime.now());
            tmBedGroup.setActive(true);
            tmRepository.save(tmBedGroup);
        } else {
            Optional<HMS_TM_BedGroup> tmBedGroup = tmRepository.findByWtIdAndIsActiveTrue(id);
            tmBedGroup.ifPresent(tmRepository::delete);
        }
        return twBedGroup;
    }

    public List<BedGroupDTO> getAllMasterEntriesName() {
        List<BedGroupDTO> bedGroups = tmRepository.findAllByIsActiveBedGroups();
        return bedGroups.stream().map(bedGroup -> {
            Optional<HMS_TW_Floor> floorOptional = twFloorRepository.findByFloorIdAndIsActiveTrue(bedGroup.getFloorId());
            floorOptional.ifPresent(floor -> {
                FloorDTO floorDTO = new FloorDTO();
                floorDTO.setFloorId(floor.getFloorId());
                floorDTO.setFloorName(floor.getFloorName());
                bedGroup.setFloor(floorDTO);
            });
            return bedGroup;
        }).collect(Collectors.toList());
    }
}



