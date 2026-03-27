package com.hms.services.opdmanagement.configuration;



import com.hms.services.opdmanagement.model.OPDCombinedDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.time.LocalDateTime;
import java.util.List;

@FeignClient(name="ipd-management-services")
//@FeignClient(name="ipd-management-services",url = "${ipd-management-services.url}")
public interface IpdManagementInterface {

    @GetMapping("/chargeType/{chargeTypeId}")
    ResponseEntity<OPDCombinedDTO.OPDChargesTypeDTO> getChargeTypeById(@PathVariable String chargeTypeId);

    @GetMapping("/ipd-charges-category/{chargeCategoryId}")
    ResponseEntity<OPDCombinedDTO.OPDChargesCategoryDTO> getByChargeCategoryId(@PathVariable String chargeCategoryId);

    @GetMapping("/ipd-charges-name/{chargeNameId}")
    ResponseEntity<OPDCombinedDTO.OPDChargesNameDTO> getByChargeNameId(@PathVariable String chargeNameId) ;

    @GetMapping("/ipd-admissions/check-patient-admission")
    boolean checkPatientAdmission(@RequestParam("patientId") String patientId,
                                                                  @RequestParam("currentDate") LocalDateTime currentDate);

}

