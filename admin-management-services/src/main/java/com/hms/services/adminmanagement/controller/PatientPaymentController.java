package com.hms.services.adminmanagement.controller;


import com.hms.services.adminmanagement.entity.HMS_TM_PatientPayment;
import com.hms.services.adminmanagement.service.PatientPaymentService;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/patient-payment")
public class PatientPaymentController {

    private final PatientPaymentService patientPaymentService;

    @Autowired
    public PatientPaymentController(PatientPaymentService patientPaymentService) {
        this.patientPaymentService = patientPaymentService;
    }

    // Create Patient Payment
    @PostMapping("/add")
    public ResponseEntity<HMS_TM_PatientPayment> createPatientPayment(@RequestBody HMS_TM_PatientPayment patientPayment) {
        HMS_TM_PatientPayment createdPayment = patientPaymentService.createPatientPayment(patientPayment);
        return new ResponseEntity<>(createdPayment, HttpStatus.CREATED);
    }

    // Update Patient Payment
    @PutMapping("/{id}")
    public ResponseEntity<HMS_TM_PatientPayment> updatePatientPayment(@PathVariable String id, @RequestBody HMS_TM_PatientPayment patientPayment) {
        HMS_TM_PatientPayment updatedPayment = patientPaymentService.updatePatientPayment(id, patientPayment);
        return new ResponseEntity<>(updatedPayment, HttpStatus.OK);
    }

    // Delete Patient Payment (Soft Delete)
    @DeleteMapping("/{id}")
    public ResponseEntity<JSONObject> deletePatientPayment(@PathVariable String id) {
        patientPaymentService.deletePatientPayment(id);
        JSONObject response = new JSONObject();
        response.put("status", "Patient Payment Deleted Successfully");
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // Get All Active Patient Payments
    @GetMapping("/all")
    public ResponseEntity<List<HMS_TM_PatientPayment>> getAllActivePatientPayments() {
        return new ResponseEntity<>(patientPaymentService.getAllActivePatientPayments(), HttpStatus.OK);
    }

    // Get Patient Payment by ID
    @GetMapping("/{id}")
    public ResponseEntity<HMS_TM_PatientPayment> getPatientPaymentById(@PathVariable String id) {
        return new ResponseEntity<>(patientPaymentService.getPatientPaymentById(id), HttpStatus.OK);
    }


}



