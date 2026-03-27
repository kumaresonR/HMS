package com.hms.services.opdmanagement.model;

import com.hms.services.opdmanagement.entity.HMS_TM_OPDCharges;
import lombok.Data;

@Data
public class OPDChargeWithPatientDTO {

    private HMS_TM_OPDCharges opdCharge;
    private String patientId;
    private String doctorId;

    public OPDChargeWithPatientDTO(HMS_TM_OPDCharges opdCharge, String patientId,String doctorId) {
        this.opdCharge = opdCharge;
        this.patientId = patientId;
        this.doctorId = doctorId;
    }
}

