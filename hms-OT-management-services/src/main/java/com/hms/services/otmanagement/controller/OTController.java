package com.hms.services.otmanagement.controller;



import com.hms.services.otmanagement.model.IPDOperationDTO;
import com.hms.services.otmanagement.model.OPDOperationDTO;
import com.hms.services.otmanagement.service.OperationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/operation")
public class OTController {

    private final OperationService operationService;

    @Autowired
    public OTController(OperationService operationService) {
        this.operationService = operationService;
    }

    @GetMapping("/ipd-list")
    public List<IPDOperationDTO> getAllIpdOperation(@RequestParam String date,@RequestParam String status) {
        return operationService.getAllIpdOperation(date,status);
    }

    @GetMapping("/opd-list")
    public List<OPDOperationDTO> getAllOpdOperation(@RequestParam String date,@RequestParam String status) {
        return operationService.getAllOpdOperation(date,status);
    }

    @PatchMapping("/update-ipd-operation/{id}")
    public String updateIpdSchedule(@PathVariable String id, @RequestBody IPDOperationDTO updatedOperation) {
        return operationService.updateSchedule(id, updatedOperation);
    }

    @PatchMapping("/update-ipd-status/{id}")
    public String updateIpdScheduleStatus(@PathVariable String id, @RequestParam String status) {
        return operationService.updateOperationStatusSchedule(id, status);
    }

    @PatchMapping("/update-opd-operation/{id}")
    public String updateOpdSchedule(@PathVariable String id, @RequestBody IPDOperationDTO updatedOperation) {
        return operationService.updateOpdSchedule(id, updatedOperation);
    }

    @PatchMapping("/update-opd-status/{id}")
    public String updateOpdScheduleStatus(@PathVariable String id, @RequestParam String status) {
        return operationService.updateOpdScheduleStatus(id, status);
    }






}

