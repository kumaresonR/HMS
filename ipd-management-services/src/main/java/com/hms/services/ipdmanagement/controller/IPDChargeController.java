package com.hms.services.ipdmanagement.controller;


import com.hms.services.ipdmanagement.entity.HMS_TM_IPDCharges;
import com.hms.services.ipdmanagement.service.IPDChargesService;
import com.hms.services.ipdmanagement.service.IPDPaymentsService;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/ipd-charges")
public class IPDChargeController {


    private final IPDChargesService ipdChargesService;

    @Autowired
    public IPDChargeController(final IPDChargesService ipdChargesService) {
        this.ipdChargesService = ipdChargesService;
    }


    @PostMapping("/add")
    public ResponseEntity<List<HMS_TM_IPDCharges>> createIPDCharge(@RequestBody  List<HMS_TM_IPDCharges>  ipdCharge) {
        List<HMS_TM_IPDCharges> createdCharge = ipdChargesService.createIPDCharge(ipdCharge);
        return new ResponseEntity<>(createdCharge, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<HMS_TM_IPDCharges> updateIPDCharge(@PathVariable String id, @RequestBody HMS_TM_IPDCharges ipdCharge) {
        HMS_TM_IPDCharges updatedCharge = ipdChargesService.updateIPDCharge(id, ipdCharge);
        return new ResponseEntity<>(updatedCharge, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<JSONObject> deleteIPDCharge(@PathVariable String id) {
        ipdChargesService.deleteIPDCharge(id);
        JSONObject obj=new JSONObject();
        obj.put("status","IPDCharges Deleted Successfully");
        return new ResponseEntity<>(obj, HttpStatus.OK);
    }

    @GetMapping("/all")
    public ResponseEntity<List<HMS_TM_IPDCharges>> getAllActiveIPDCharges() {
        return new ResponseEntity<>(ipdChargesService.getAllActiveIPDCharges(), HttpStatus.OK);
    }

    @GetMapping("/by-ipd/{ipdId}")
    public ResponseEntity<List<HMS_TM_IPDCharges>> getIPDChargesByIpdId(@PathVariable String ipdId) {
        return new ResponseEntity<>(ipdChargesService.getIPDChargesByIpdId(ipdId), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<HMS_TM_IPDCharges> getIPDChargeByIpdChargeId(@PathVariable String id) {
        return new ResponseEntity<>(ipdChargesService.getIPDChargeByIpdChargeId(id), HttpStatus.OK);
    }


}

