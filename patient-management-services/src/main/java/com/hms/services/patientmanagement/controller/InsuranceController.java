package com.hms.services.patientmanagement.controller;//package com.hms.services.patientmanagement.controller;

import com.hms.services.patientmanagement.model.InsuranceProvidersDTO;
import com.hms.services.patientmanagement.response.ApiResponse;
import com.hms.services.patientmanagement.service.InsuranceService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/insurance-providers")
public class InsuranceController{

    private final InsuranceService insuranceService;

    @Autowired
    public InsuranceController(final InsuranceService insuranceService) {
        this.insuranceService = insuranceService;
    }

    @PostMapping("/add")
    public ResponseEntity<ApiResponse> createInsuranceProvider(@RequestBody @Valid InsuranceProvidersDTO insurance) {
        ApiResponse insuranceCreation = insuranceService.createInsurance(insurance);
        return ResponseEntity.ok(insuranceCreation);
    }


    @DeleteMapping("/delete/{insuranceId}")
    public ResponseEntity<ApiResponse> deleteInsuranceProviderById(@PathVariable("insuranceId") String id) {
        ApiResponse insuranceCreation = insuranceService.deleteInsuranceById(id);
        return ResponseEntity.ok(insuranceCreation);
    }


    @GetMapping("/all")
    public ResponseEntity<List<InsuranceProvidersDTO>> getAllInsuranceProviders(
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer size
    ) {
        List<InsuranceProvidersDTO> getAppointment = insuranceService.getAllInsurance(page,size);
        return ResponseEntity.ok(getAppointment);
    }


    @GetMapping("/{providerName}")
    public ResponseEntity<InsuranceProvidersDTO> getInsuranceProviderById(@PathVariable("providerName") String providerName) {
        InsuranceProvidersDTO getAppointment = insuranceService.getInsuranceByProviderName(providerName);
        return ResponseEntity.ok(getAppointment);
    }


    @PutMapping("/update/{insuranceId}")
    public ResponseEntity<InsuranceProvidersDTO> updateInsuranceProviderById(@PathVariable("insuranceId") String id, @RequestBody @Valid InsuranceProvidersDTO insurance) {
        InsuranceProvidersDTO updateInsurance = insuranceService.updateInsuranceProviderById(id,insurance);
        return ResponseEntity.ok(updateInsurance);
    }


}

