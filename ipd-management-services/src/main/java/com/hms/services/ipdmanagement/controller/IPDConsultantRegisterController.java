package com.hms.services.ipdmanagement.controller;


import com.hms.services.ipdmanagement.model.ConsultantRegisterDTO;
import com.hms.services.ipdmanagement.response.ApiResponse;
import com.hms.services.ipdmanagement.service.ConsultantRegisterService;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/consultant-register")
public class IPDConsultantRegisterController {

    private final ConsultantRegisterService consultantRegisterService;

    @Autowired
    public IPDConsultantRegisterController(final ConsultantRegisterService consultantRegisterService) {
        this.consultantRegisterService = consultantRegisterService;
    }

    // Create
    @PostMapping("/add")
    public ResponseEntity<JSONObject> createConsultantRegister(@RequestBody ConsultantRegisterDTO consultantRegisterDTO) {
        JSONObject createdConsultant = consultantRegisterService.createConsultantRegister(consultantRegisterDTO);
        return new ResponseEntity<>(createdConsultant, HttpStatus.CREATED);
    }

    // Read all
    @GetMapping("/all")
    public ResponseEntity<List<ConsultantRegisterDTO>> getAllConsultantRegisters(
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer size
    ) {
        List<ConsultantRegisterDTO> consultants = consultantRegisterService.getAllConsultantRegisters(page, size);
        return ResponseEntity.ok(consultants);
    }

    // Read by ID
    @GetMapping("/{id}")
    public ResponseEntity<ConsultantRegisterDTO> getConsultantRegisterById(@PathVariable String id) {
        ConsultantRegisterDTO consultantDTO = consultantRegisterService.getConsultantRegisterById(id);
        return ResponseEntity.ok(consultantDTO);
    }

    // Update
    @PutMapping("/update/{id}")
    public ResponseEntity<JSONObject> updateConsultantRegisterById(
            @PathVariable String id,@RequestBody ConsultantRegisterDTO consultantRegisterDTO) {
        JSONObject response = consultantRegisterService.updateConsultantRegisterById(id, consultantRegisterDTO);
        return ResponseEntity.ok(response);
    }

    // Delete
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<JSONObject> deleteConsultantRegister(@PathVariable("id") String consultantRegisterId) {
        JSONObject response = consultantRegisterService.deleteConsultantRegister(consultantRegisterId);
        return ResponseEntity.ok(response);
    }

    // Read by ID
    @GetMapping("/ipd/{ipdId}")
    public ResponseEntity<List<ConsultantRegisterDTO>> getConsultantRegisterByIpdId(@PathVariable("ipdId") String id) {
        List<ConsultantRegisterDTO> consultantDTO = consultantRegisterService.getConsultantRegisterByIpdId(id);
        return ResponseEntity.ok(consultantDTO);
    }

}

