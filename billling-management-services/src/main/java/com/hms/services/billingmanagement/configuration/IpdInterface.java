package com.hms.services.billingmanagement.configuration;


import com.hms.services.billingmanagement.model.PrescriptionDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@FeignClient(name="ipd-management-services")
public interface IpdInterface {
    @PostMapping("/ipd-prescription/prescriptionNo")
    public void addPrescriptionByPayment(
            @RequestParam("number") String number,
            @RequestParam(value="pharmacyPaid",required = false) Boolean pharmacyPaid,
            @RequestParam(value="pathologyPaid",required = false) Boolean pathologyPaid,
                    @RequestParam(value="radiologyPaid",required = false) Boolean radiologyPaid);

    @GetMapping("/ipd-prescription/prescriptionNo/{prescriptionNo}")
    public ResponseEntity<List<PrescriptionDTO>> getPrescriptionByPrescriptionNo(@PathVariable("prescriptionNo") String number);
}


