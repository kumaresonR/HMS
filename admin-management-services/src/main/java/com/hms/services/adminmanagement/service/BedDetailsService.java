package com.hms.services.adminmanagement.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.hms.services.adminmanagement.entity.*;
import com.hms.services.adminmanagement.exceptionhandler.CustomException;
import com.hms.services.adminmanagement.model.BedDetailsDTO;
import com.hms.services.adminmanagement.model.BedGroupDTO;
import com.hms.services.adminmanagement.model.BedTypeDTO;
import com.hms.services.adminmanagement.model.FloorDTO;
import com.hms.services.adminmanagement.repository.*;
import jakarta.persistence.EntityNotFoundException;
import org.json.simple.JSONObject;
import org.modelmapper.ModelMapper;
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
public class BedDetailsService {

    private static final Logger logger = LoggerFactory.getLogger(BedDetailsService.class);

    private final HMS_TM_BedDetailsRepository tmRepository;
    private final HMS_TW_BedDetailsRepository twRepository;
    private final HMS_TM_BedGroupRepository bedGroupRepository;
    private final HMS_TM_BedTypeRepository bedTypeRepository;
    private final HMS_TW_BedGroupRepository twBedGroupRepository;
    private final HMS_TW_BedTypeRepository twBedTypeRepository;
    private final HMS_TW_FloorRepository twFloorRepository;
    private final HMS_TM_FloorRepository tmFloorRepository;
    private final ModelMapper mapper;
    private final HMS_TM_BedGroupRepository tmBedGroupRepository;
    private final HMS_TM_BedTypeRepository tmBedTypeRepository;


    @Autowired
    public BedDetailsService(HMS_TM_BedDetailsRepository tmRepository,final HMS_TM_BedTypeRepository bedTypeRepository,
                             HMS_TW_BedDetailsRepository twRepository,final HMS_TM_BedGroupRepository bedGroupRepository,
                             final ModelMapper mapper,final HMS_TW_BedGroupRepository twBedGroupRepository,
                             final HMS_TW_BedTypeRepository twBedTypeRepository,final HMS_TW_FloorRepository twFloorRepository,
                             HMS_TM_FloorRepository tmFloorRepository,final HMS_TM_BedGroupRepository tmBedGroupRepository,final HMS_TM_BedTypeRepository tmBedTypeRepository) {
        this.tmRepository = tmRepository;
        this.twRepository = twRepository;
        this.bedGroupRepository = bedGroupRepository;
        this.bedTypeRepository = bedTypeRepository;
        this.twBedGroupRepository = twBedGroupRepository;
        this.twBedTypeRepository = twBedTypeRepository;
        this.mapper = mapper;
        this.tmFloorRepository = tmFloorRepository;
        this.twFloorRepository = twFloorRepository;
        this.tmBedGroupRepository = tmBedGroupRepository;
        this.tmBedTypeRepository = tmBedTypeRepository;
    }

    public HMS_TW_BedDetails createInWorkTable(HMS_TW_BedDetails bedDetails) {
        bedDetails.setCreatedAt(LocalDateTime.now());
        bedDetails.setActive(true);
        bedDetails.setModNo("V1");
        Optional<HMS_TM_BedGroup> bedGroup = tmBedGroupRepository.findByBedGroupIdAndIsActiveTrue(bedDetails.getBedGroupId());
        if(bedGroup.isPresent()) {
            Optional<HMS_TM_Floor> bedCount = tmFloorRepository.findByFloorIdAndIsActiveTrue(bedGroup.get().getFloorId());
            int bedName=tmRepository.countByBedGroupId(bedDetails.getBedGroupId());
            if (bedCount.get().getRoomCount() < bedName) {
                throw new CustomException("Bed limit reached for the allotted floor. The limit is only " + bedCount.get().getRoomCount(), HttpStatus.BAD_REQUEST);
            }
        }
        bedDetails.setAuthStat("UnAuthorized");
        bedDetails.setRecordStat("Open");
        bedDetails.setCreatedBy("Admin");
        return twRepository.save(bedDetails);
    }

    public HMS_TW_BedDetails approveWorkTableEntry(String workId, HMS_TW_BedDetails bedDetails) {
        HMS_TW_BedDetails existingEntry = twRepository.findByBedDetailsIdAndIsActiveTrue(workId)
                .orElseThrow(() -> new RuntimeException("Work table entry not found"));
        existingEntry.setBedGroupId(bedDetails.getBedGroupId());
        existingEntry.setBedTypeId(bedDetails.getBedTypeId());
        existingEntry.setName(bedDetails.getName());
        existingEntry.setNotAvailable(bedDetails.isNotAvailable());
        existingEntry.setActive(true);
        existingEntry.setLastModifiedAt(LocalDateTime.now());
        existingEntry.setLastModifiedBy("SuperAdmin");
        existingEntry.setActive(true);
        return twRepository.save(existingEntry);
    }

    public List<BedDetailsDTO> getAllMasterEntries(int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Order.desc("createdAt")));
        List<HMS_TM_BedDetails> bedDetailsList = tmRepository.findAllByIsActiveTrueAndNotAvailableFalse(pageRequest).getContent();
        return bedDetailsList.stream().map(beds -> {
            BedDetailsDTO responseDto = new BedDetailsDTO();
            responseDto.setBedDetailsId(beds.getBedDetailsId());
            responseDto.setName(beds.getName());
            responseDto.setModNo(beds.getModNo());
            responseDto.setAuthStat(beds.getAuthStat());
            responseDto.setRecordStat(beds.getRecordStat());
            responseDto.setRoomStatus(beds.isRoomStatus());
            Optional<HMS_TM_BedGroup> optionalGroup = tmBedGroupRepository.findByBedGroupIdAndIsActiveTrue(beds.getBedGroupId());
            BedGroupDTO bedGroupDto = optionalGroup.map(group -> mapper.map(group, BedGroupDTO.class)).orElse(null);
            if (bedGroupDto != null) {
                Optional<HMS_TM_Floor> optionalFloor = tmFloorRepository.findByFloorIdAndIsActiveTrue(bedGroupDto.getFloorId());
                optionalFloor.ifPresent(floor -> {
                    FloorDTO floorDto = mapper.map(floor, FloorDTO.class);
                    bedGroupDto.setFloor(floorDto);
                });
            }
            Optional<HMS_TM_BedType> optionalBedType = Optional.ofNullable(tmBedTypeRepository.findByBedTypeIdAndIsActiveTrue(beds.getBedTypeId()));
            BedTypeDTO bedTypeDto = optionalBedType.map(bedType -> mapper.map(bedType, BedTypeDTO.class)).orElse(null);
            responseDto.setBedGroup(bedGroupDto);
            responseDto.setBedType(bedTypeDto);
            return responseDto;
        }).collect(Collectors.toList());

    }


    public List<BedDetailsDTO> getAllWorkEntries(int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Order.desc("createdAt")));
        List<HMS_TW_BedDetails> bedDetailsList = twRepository.findAllByIsActiveTrue(pageRequest).getContent();
        return bedDetailsList.stream().map(beds -> {
            BedDetailsDTO responseDto = new BedDetailsDTO();
            responseDto.setBedDetailsId(beds.getBedDetailsId());
            responseDto.setName(beds.getName());
            responseDto.setModNo(beds.getModNo());
            responseDto.setAuthStat(beds.getAuthStat());
            responseDto.setRecordStat(beds.getRecordStat());
            responseDto.setRoomStatus(beds.isRoomStatus());
            responseDto.setNotAvailable(beds.isNotAvailable());
            Optional<HMS_TM_BedGroup> optionalGroup = tmBedGroupRepository.findByBedGroupIdAndIsActiveTrue(beds.getBedGroupId());
            BedGroupDTO bedGroupDto = optionalGroup.map(group -> mapper.map(group, BedGroupDTO.class)).orElse(null);
            if (bedGroupDto != null) {
                Optional<HMS_TM_Floor> optionalFloor = tmFloorRepository.findByFloorIdAndIsActiveTrue(bedGroupDto.getFloorId());
                optionalFloor.ifPresent(floor -> {
                    FloorDTO floorDto = mapper.map(floor, FloorDTO.class);
                    bedGroupDto.setFloor(floorDto);
                });
            }
            HMS_TM_BedType bedType = tmBedTypeRepository.findByBedTypeIdAndIsActiveTrue(beds.getBedTypeId());
            BedTypeDTO bedTypeDto = (bedType != null) ? mapper.map(bedType, BedTypeDTO.class) : null;
            responseDto.setBedGroup(bedGroupDto);
            responseDto.setBedType(bedTypeDto);
            return responseDto;
        }).collect(Collectors.toList());

    }

    public BedDetailsDTO getAllRoomEntries(String id) {
        HMS_TM_BedDetails beds = tmRepository.findByBedDetailsIdAndIsActiveTrue(id).get();
        if (beds == null) {
            return new BedDetailsDTO();
        }
        BedDetailsDTO responseDto = mapper.map(beds, BedDetailsDTO.class);
        Optional<HMS_TM_BedGroup> optionalGroup = tmBedGroupRepository.findByBedGroupIdAndIsActiveTrue(beds.getBedGroupId());
        BedGroupDTO bedGroupDto = optionalGroup.map(group -> mapper.map(group, BedGroupDTO.class)).orElse(null);
        if (bedGroupDto != null) {
            Optional<HMS_TM_Floor> optionalFloor = tmFloorRepository.findByFloorIdAndIsActiveTrue(bedGroupDto.getFloorId());
            optionalFloor.ifPresent(floor -> {
                FloorDTO floorDto = mapper.map(floor, FloorDTO.class);
                bedGroupDto.setFloor(floorDto);
            });
        }
        HMS_TM_BedType bedType = tmBedTypeRepository.findByBedTypeIdAndIsActiveTrue(beds.getBedTypeId());
        BedTypeDTO bedTypeDto = (bedType != null) ? mapper.map(bedType, BedTypeDTO.class) : null;
        responseDto.setBedGroup(bedGroupDto);
        responseDto.setBedType(bedTypeDto);
        return responseDto;
    }


    public JSONObject softDeleteWorkTableEntry(String workId) {
        HMS_TW_BedDetails twBedDetails = twRepository.findByBedDetailsIdAndIsActiveTrue(workId)
                .orElseThrow(() -> new RuntimeException("Work table entry not found"));
        twBedDetails.setActive(false);
        twBedDetails.setRecordStat("Closed");
        twBedDetails.setLastModifiedBy("SuperAdmin");
        twBedDetails.setLastModifiedAt(LocalDateTime.now());
        twRepository.save(twBedDetails);
        JSONObject response = new JSONObject();
        response.put("status", "Deleted Successfully");
        return response;
    }

    // Soft delete Master Table entry
    public JSONObject softDeleteMasterTableEntry(String masterId) {
        HMS_TM_BedDetails tmBedDetails = tmRepository.findByBedDetailsIdAndIsActiveTrue(masterId)
                .orElseThrow(() -> new RuntimeException("Master table entry not found"));
        tmBedDetails.setActive(false);
        tmBedDetails.setRecordStat("Closed");
        tmBedDetails.setLastModifiedBy("SuperAdmin");
        tmBedDetails.setLastModifiedAt(LocalDateTime.now());
        tmRepository.save(tmBedDetails);
        JSONObject response = new JSONObject();
        response.put("status", "Deleted Successfully");
        return response;
    }


    @Transactional
    public HMS_TW_BedDetails updateAuthStatById(String id, String authStat) {
        HMS_TW_BedDetails twBedDetails = twRepository.findByBedDetailsIdAndIsActiveTrue(id)
                .orElseThrow(() -> new EntityNotFoundException("BedDetails with ID " + id + " not found."));
        twBedDetails.setAuthStat(authStat);
        twBedDetails.setLastModifiedAt(LocalDateTime.now());
        twBedDetails.setLastModifiedBy("SuperAdmin");
        twRepository.save(twBedDetails);
        if (authStat.equalsIgnoreCase("Authorized")) {
            HMS_TM_BedDetails tmBedDetails = tmRepository.findByWtIdAndIsActiveTrue(id)
             .orElseGet(HMS_TM_BedDetails::new);
            tmBedDetails.setBedDetailsId(twBedDetails.getBedDetailsId());
            tmBedDetails.setName(twBedDetails.getName());
            tmBedDetails.setBedTypeId(twBedDetails.getBedTypeId());
            tmBedDetails.setBedGroupId(twBedDetails.getBedGroupId());
            tmBedDetails.setModNo(twBedDetails.getModNo());
            tmBedDetails.setWtId(id);
            tmBedDetails.setRecordStat(twBedDetails.getRecordStat());
            tmBedDetails.setAuthStat(authStat);
            tmBedDetails.setCreatedAt(LocalDateTime.now());
            tmBedDetails.setActive(true);
            tmBedDetails.setRoomStatus(twBedDetails.isRoomStatus());
            tmBedDetails.setNotAvailable(twBedDetails.isNotAvailable());
            tmBedDetails.setLastModifiedAt(LocalDateTime.now());
            tmBedDetails.setLastModifiedBy("SuperAdmin");
            tmRepository.save(tmBedDetails);
        } else {
            Optional<HMS_TM_BedDetails> tmBedDetails = tmRepository.findByWtIdAndIsActiveTrue(id);
            tmBedDetails.ifPresent(tmRepository::delete);
        }
        return twBedDetails;
    }

    public List<HMS_TM_BedDetails> getAllRoomNumber(String id) {
        List<HMS_TM_BedDetails> twBedDetails = tmRepository.findAllByBedGroupIdAndIsActiveTrueAndNotAvailableFalse(id);
        return twBedDetails.isEmpty() ? null : twBedDetails;
    }


    public void getUpdateRoom(String id, boolean status) {
        System.out.println("RoomDetailsId:"+id);
        HMS_TM_BedDetails beds = tmRepository.findByBedDetailsIdAndIsActiveTrue(id).get();
        if (beds != null) {
            beds.setRoomStatus(status);
            tmRepository.save(beds);
        }
    }


}


//            Optional<HMS_TM_BedGroup> optionalGroup = bedGroupRepository.findByBedGroupIdAndIsActiveTrue(beds.getBedGroupId());
//            BedGroupDTO bedGroupDto = optionalGroup.map(group -> mapper.map(group, BedGroupDTO.class)).orElse(null);
//            if (bedGroupDto != null) {
//                Optional<HMS_TM_Floor> optionalFloor = tmFloorRepository.findByFloorIdAndIsActiveTrue(bedGroupDto.getFloorId());
//                optionalFloor.ifPresent(floor -> {
//                    FloorDTO floorDto = mapper.map(floor, FloorDTO.class);
//                    bedGroupDto.setFloor(floorDto);
//                });
//            }
//            HMS_TM_BedType bedType = bedTypeRepository.findByBedTypeIdAndIsActiveTrue(beds.getBedTypeId());
//            BedTypeDTO bedTypeDto = (bedType != null) ? mapper.map(bedType, BedTypeDTO.class) : null;
//            responseDto.setBedGroup(bedGroupDto);
//            responseDto.setBedType(bedTypeDto);
//            return responseDto;
//        }).collect(Collectors.toList());


