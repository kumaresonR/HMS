package com.hms.services.billingmanagement.configuration;


import com.hms.services.billingmanagement.model.OPDPrescriptionsDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@FeignClient(name="opd-management-services")
public interface OpdInterface {
    @PostMapping("/opd-prescription/prescriptionNo")
    public void addPrescriptionByPayment(
            @RequestParam("number") String number,
            @RequestParam(value="pharmacyPaid",required = false) Boolean pharmacyPaid,
            @RequestParam(value="pathologyPaid",required = false) Boolean pathologyPaid,
            @RequestParam(value="radiologyPaid",required = false) Boolean radiologyPaid);
    @GetMapping("/opd-prescription/prescriptionNo/{prescriptionNo}")
    public ResponseEntity<List<OPDPrescriptionsDTO>> getPrescriptionByPrescriptionNo(@PathVariable("prescriptionNo") String number);
}


