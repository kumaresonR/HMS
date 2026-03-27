package com.hms.services.ipdmanagement.configuration;


import com.hms.services.ipdmanagement.model.OPDCombinedDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.time.LocalDateTime;

@FeignClient(name="opd-management-services")
//@FeignClient(name="opd-management-services",url = "${opd-management-services.url}")
public interface OpdManagementInterface {

    @GetMapping("/opd-admissions/check-patient-admission")
    boolean checkPatientAdmission(@RequestParam("patientId") String patientId,
                                  @RequestParam("currentDate") LocalDateTime currentDate);

    @GetMapping("/opd-admissions/active-ipdOrOpd/{patientId}")
    public String getActiveOpdId(@PathVariable String patientId);

    @GetMapping("/opd-admissions/active-patient/{opdOrIpdId}")
    public OPDCombinedDTO getActivePatient(@PathVariable String opdOrIpdId);

    @GetMapping("/opd-admissions/antenatal-patient/{opdOrIpdId}")
    public OPDCombinedDTO getAntenatalPatient(@PathVariable String opdOrIpdId);

    @GetMapping("/opd-admissions/death-patient/{opdOrIpdId}")
    public OPDCombinedDTO getDeathPatient(@PathVariable String opdOrIpdId);
}

