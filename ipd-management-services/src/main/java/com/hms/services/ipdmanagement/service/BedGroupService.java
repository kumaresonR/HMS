package com.hms.services.ipdmanagement.service;

import com.hms.services.ipdmanagement.entity.HMS_TM_BedGroup;
import com.hms.services.ipdmanagement.entity.HMS_TM_Rooms;
import com.hms.services.ipdmanagement.exception.CustomException;
import com.hms.services.ipdmanagement.model.BedGroupDTO;
import com.hms.services.ipdmanagement.model.RoomsDTO;
import com.hms.services.ipdmanagement.repository.BedGroupRepository;
import com.hms.services.ipdmanagement.repository.RoomsRepository;
import com.hms.services.ipdmanagement.response.ApiResponse;
import jakarta.persistence.EntityManager;
import org.json.simple.JSONObject;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.lang.reflect.Type;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BedGroupService {

    private final BedGroupRepository bedGroupRepository;
    private final ModelMapper modelMapper;
    private final EntityManager entityManager;
    private final RoomsRepository roomsRepository;

    @Autowired
    public BedGroupService(final ModelMapper modelMapper,final BedGroupRepository bedGroupRepository,
                           final EntityManager entityManager,final RoomsRepository roomsRepository) {
        this.modelMapper = modelMapper;
        this.bedGroupRepository = bedGroupRepository;
        this.entityManager = entityManager;
        this.roomsRepository = roomsRepository;
    }


    public ApiResponse createBedGroup(BedGroupDTO bedGroupDto) {
        try {
        HMS_TM_BedGroup bedGroup = modelMapper.map(bedGroupDto, HMS_TM_BedGroup.class);
        bedGroup.setActive(true);
        bedGroup.setCreatedAt(LocalDateTime.now());
        bedGroup.setCreatedBy("vijay");
        HMS_TM_BedGroup savedBedGroup = bedGroupRepository.save(bedGroup);
        if(bedGroupDto.getRooms()!=null && !bedGroupDto.getRooms().isEmpty()) {
            Type targetListType = new TypeToken<List<HMS_TM_Rooms>>() {
            }.getType();
            List<HMS_TM_Rooms> rooms = modelMapper.map(bedGroupDto.getRooms(), targetListType);
            rooms.forEach(room -> {
                room.setBedGroupId(savedBedGroup.getBedGroupId()); // Set the BedGroupId
                room.setActive(true);
            });
            roomsRepository.saveAll(rooms);
        }
        return new ApiResponse("success", "", "Create IPDBed Successfully", savedBedGroup.getBedGroupId(),null,null,null,null);
    }catch(Exception ex){
        throw new CustomException(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }}


    public ApiResponse deleteBedGroup(String bedGroupId) {
        HMS_TM_BedGroup admission = bedGroupRepository.findByBedGroupIdAndIsActiveTrue(bedGroupId)
                .orElseThrow(() -> new CustomException("BedGroup Not Found", HttpStatus.NOT_FOUND));
        admission.setActive(false);
        bedGroupRepository.save(admission);
        List<HMS_TM_Rooms> rooms = roomsRepository.findAllByBedGroupIdAndIsActiveTrue(bedGroupId);
        rooms.forEach(room -> room.setActive(false));
        roomsRepository.saveAll(rooms);
        return new ApiResponse("success", "", "Record Deleted Successfully", bedGroupId, null,null,null,null);
    }


    public List<BedGroupDTO> getAllIPDRooms(int page, int size) {
        try {
            List<HMS_TM_BedGroup> bedGroups = bedGroupRepository.findAllByIsActiveTrue(PageRequest.of(page, size)).getContent();
            List<BedGroupDTO> beds = bedGroups.stream().map(bedGroup -> {
                List<HMS_TM_Rooms> activeRooms = roomsRepository.findAllByBedGroupIdAndIsActiveTrue(bedGroup.getBedGroupId());
                BedGroupDTO bedGroupDTO = modelMapper.map(bedGroup, BedGroupDTO.class);
                List<RoomsDTO> roomsDTOs = modelMapper.map(activeRooms, new TypeToken<List<RoomsDTO>>() {}.getType());
                bedGroupDTO.setRooms(roomsDTOs);
                return bedGroupDTO;
            }).collect(Collectors.toList());
            return beds;
        } catch (Exception ex) {
            throw new CustomException(ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }



    public BedGroupDTO getBedGroupById(String id) {
        try {
        HMS_TM_BedGroup bedGroup = bedGroupRepository.findByBedGroupIdAndIsActiveTrue(id)
                .orElseThrow(() -> new CustomException("Bed Group Not Found", HttpStatus.NOT_FOUND));
        BedGroupDTO bedDto=modelMapper.map(bedGroup, BedGroupDTO.class);
        List<HMS_TM_Rooms> rooms = roomsRepository.findAllByBedGroupIdAndIsActiveTrue(id);
        List<RoomsDTO> roomsDTOs = modelMapper.map(rooms, new TypeToken<List<RoomsDTO>>() {}.getType());
        bedDto.setRooms(roomsDTOs);
        return bedDto;
        } catch (Exception ex) {
            throw new CustomException(ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    public JSONObject updateBedGroupById(String id, BedGroupDTO bedDto) {
        try{
        HMS_TM_BedGroup existingBedGroup = bedGroupRepository.findByBedGroupIdAndIsActiveTrue(id)
                .orElseThrow(() -> new CustomException("Bed Group Not Found", HttpStatus.NOT_FOUND));
        existingBedGroup.setBedGroupName(bedDto.getBedGroupName());
        existingBedGroup.setStatus(bedDto.getStatus());
        existingBedGroup.setLastModifiedAt(LocalDateTime.now());
        existingBedGroup.setLastModifiedBy("vijay");
        for (RoomsDTO roomUpdate : bedDto.getRooms()) {
            HMS_TM_Rooms room = roomsRepository.findByRoomIdAndIsActiveTrue(roomUpdate.getRoomId())
                    .orElseThrow(() -> new CustomException("Room Not Found", HttpStatus.NOT_FOUND));
            room.setRoomNumber(roomUpdate.getRoomNumber());
            room.setRoomType(roomUpdate.getRoomType());
            room.setStatus(roomUpdate.getStatus());
            room.setRatePerDay(roomUpdate.getRatePerDay());
            roomsRepository.save(room);
        }
             bedGroupRepository.save(existingBedGroup);
            JSONObject obj = new JSONObject();
            obj.put("Message", "Updated Successfully");
            return obj;
        } catch (Exception ex) {
            throw new CustomException(ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    public ApiResponse deleteIndividualRoom(String roomId) {
        HMS_TM_Rooms room = roomsRepository.findByRoomIdAndIsActiveTrue(roomId)
                .orElseThrow(() -> new CustomException("Room Not Found", HttpStatus.NOT_FOUND));
        room.setActive(false);
        roomsRepository.save(room);
        return new ApiResponse("success", "", "Record Deleted Successfully", null, roomId,null,null,null);
    }
}

