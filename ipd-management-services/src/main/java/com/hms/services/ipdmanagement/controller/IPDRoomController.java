package com.hms.services.ipdmanagement.controller;


import com.hms.services.ipdmanagement.model.BedGroupDTO;
import com.hms.services.ipdmanagement.response.ApiResponse;
import com.hms.services.ipdmanagement.service.BedGroupService;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/ipd-room")
public class IPDRoomController {

    private final BedGroupService bedGroupService;

    @Autowired
    public IPDRoomController(final BedGroupService bedGroupService) {
        this.bedGroupService = bedGroupService;
    }


    @PostMapping("/add")
    public ResponseEntity<ApiResponse> createIPDRoom(@Valid @RequestBody BedGroupDTO bedGroup) {
        ApiResponse createdBedGroup = bedGroupService.createBedGroup(bedGroup);
        return new ResponseEntity<>(createdBedGroup, HttpStatus.CREATED);
    }


    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ApiResponse> deleteIPDRoom(@PathVariable("id") String bedGroupId) {
        ApiResponse response = bedGroupService.deleteBedGroup(bedGroupId);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/bed/delete/{id}")
    public ResponseEntity<ApiResponse> deleteIndividualIPDRoom(@PathVariable("id") String roomId) {
        ApiResponse response = bedGroupService.deleteIndividualRoom(roomId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/all")
    public ResponseEntity<List<BedGroupDTO>> getAllIPDRoom(
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer size
    ) {
        List<BedGroupDTO> bedGroups = bedGroupService.getAllIPDRooms(page, size);
        return ResponseEntity.ok(bedGroups);
    }


    @GetMapping("/{id}")
    public ResponseEntity<BedGroupDTO> getIPDBedGroupById(@PathVariable String id) {
        BedGroupDTO bedGroupDTO = bedGroupService.getBedGroupById(id);
        return ResponseEntity.ok(bedGroupDTO);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<JSONObject> updateIPDBedGroupById(@PathVariable String id, @Valid @RequestBody BedGroupDTO bedDto) {
        JSONObject updatedBedGroupDTO = bedGroupService.updateBedGroupById(id, bedDto);
        return ResponseEntity.ok(updatedBedGroupDTO);
    }




}

