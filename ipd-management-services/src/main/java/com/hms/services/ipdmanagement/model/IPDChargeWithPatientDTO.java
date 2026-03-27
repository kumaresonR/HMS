package com.hms.services.ipdmanagement.model;

import com.hms.services.ipdmanagement.entity.HMS_TM_IPDCharges;
import lombok.Data;

@Data
public class IPDChargeWithPatientDTO {

    private HMS_TM_IPDCharges ipdCharge;
    private String patientId;
    private String doctorId;

    public IPDChargeWithPatientDTO(HMS_TM_IPDCharges ipdCharge, String patientId,String doctorId) {
        this.ipdCharge = ipdCharge;
        this.patientId = patientId;
        this.doctorId = doctorId;
    }
}

