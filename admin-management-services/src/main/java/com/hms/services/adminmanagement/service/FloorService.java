package com.hms.services.adminmanagement.service;

import com.hms.services.adminmanagement.entity.HMS_TM_Floor;
import com.hms.services.adminmanagement.entity.HMS_TW_Floor;
import com.hms.services.adminmanagement.exceptionhandler.CustomException;
import com.hms.services.adminmanagement.repository.HMS_TM_FloorRepository;
import com.hms.services.adminmanagement.repository.HMS_TW_FloorRepository;
import jakarta.persistence.EntityNotFoundException;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class FloorService {

    private final HMS_TM_FloorRepository tmRepository;
    private final HMS_TW_FloorRepository twRepository;

    @Autowired
    public FloorService(final HMS_TM_FloorRepository tmRepository, final HMS_TW_FloorRepository twRepository) {
        this.tmRepository = tmRepository;
        this.twRepository = twRepository;
    }

    // Create an entry in the Work Table
    public HMS_TW_Floor createInWorkTable(HMS_TW_Floor twFloor) {
        twFloor.setAuthStat("UnAuthorized");
        twFloor.setModNo("V1");
        twFloor.setRecordStat("Open");
        twFloor.setCreatedAt(LocalDateTime.now());
        twFloor.setActive(true);
        return twRepository.save(twFloor);
    }

    public HMS_TW_Floor approveWorkTableEntry(String workId, HMS_TW_Floor twFloor) {
        HMS_TW_Floor existingTwFloor = twRepository.findByFloorIdAndIsActiveTrue(workId)
                .orElseThrow(() -> new CustomException("Work table entry not found", HttpStatus.BAD_REQUEST));
        existingTwFloor.setFloorName(twFloor.getFloorName());
        existingTwFloor.setDescription(twFloor.getDescription());
        existingTwFloor.setRoomCount(twFloor.getRoomCount());
//        existingTwFloor.setRecordStat(twFloor.getRecordStat());
        existingTwFloor.setActive(true);
        existingTwFloor.setLastModifiedAt(LocalDateTime.now());
        existingTwFloor.setLastModifiedBy("SuperAdmin");
        return twRepository.save(existingTwFloor);
    }

    // Get all Master Table entries
    public List<HMS_TM_Floor> getAllMasterEntries() {
        return tmRepository.findAllByIsActiveTrue();
    }

    // Get all Work Table entries
    public List<HMS_TW_Floor> getAllWorkEntries() {
        return twRepository.findAllByIsActiveTrue();
    }

    // Soft delete for HMS_TW_Floor
    public JSONObject softDeleteWorkFloor(String floorId) {
        HMS_TW_Floor floor = twRepository.findByFloorIdAndIsActiveTrue(floorId)
                .orElseThrow(() -> new RuntimeException("Work Floor not found for ID: " + floorId));
        floor.setActive(false);
        floor.setRecordStat("Close");
        floor.setLastModifiedBy("SuperAdmin");
        floor.setLastModifiedAt(LocalDateTime.now());
        twRepository.save(floor);
        JSONObject response = new JSONObject();
        response.put("status", "Deleted Successfully");
        response.put("floorId", floorId);
        return response;
    }

    // Soft delete for HMS_TM_Floor
    public JSONObject softDeleteMasterFloor(String floorId) {
        HMS_TM_Floor floor = tmRepository.findByFloorIdAndIsActiveTrue(floorId)
                .orElseThrow(() -> new RuntimeException("Master Floor not found for ID: " + floorId));
        floor.setActive(false);
        floor.setRecordStat("Close");
        floor.setLastModifiedBy("SuperAdmin");
        floor.setLastModifiedAt(LocalDateTime.now());
        tmRepository.save(floor);
        JSONObject response = new JSONObject();
        response.put("status", "Deleted Successfully");
        response.put("floorId", floorId);
        return response;
    }

    @Transactional
    public HMS_TW_Floor updateAuthStatById(String id, String authStat) {
        HMS_TW_Floor twFloor = twRepository.findByFloorIdAndIsActiveTrue(id)
                .orElseThrow(() -> new EntityNotFoundException("Floor with ID " + id + " not found."));
        twFloor.setAuthStat(authStat);
        twFloor.setLastModifiedAt(LocalDateTime.now());
        twFloor.setLastModifiedBy("SuperAdmin");
        HMS_TW_Floor twData=twRepository.save(twFloor);
        if(authStat.equalsIgnoreCase("Authorized")) {
            HMS_TM_Floor tmFloor = new HMS_TM_Floor();
            tmFloor.setFloorId(twFloor.getFloorId());
            tmFloor.setFloorName(twFloor.getFloorName());
            tmFloor.setWtId(twFloor.getFloorId());
            tmFloor.setDescription(twFloor.getDescription());
            tmFloor.setRoomCount(twFloor.getRoomCount());
            tmFloor.setModNo(twFloor.getModNo());
            tmFloor.setAuthStat(authStat);
            tmFloor.setRecordStat(twFloor.getRecordStat());
            tmFloor.setActive(true);
            tmFloor.setCreatedAt(LocalDateTime.now());
            tmFloor.setCreatedBy("SuperAdmin");
            tmFloor.setLastModifiedAt(LocalDateTime.now());
            tmFloor.setLastModifiedBy("SuperAdmin");
            tmRepository.save(tmFloor);
        }else{
            Optional<HMS_TM_Floor> tmFloor = tmRepository.findByWtIdAndIsActiveTrue(id);
            tmFloor.ifPresent(tmRepository::delete);
        }
        return twData;
    }




}



