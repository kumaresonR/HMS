package com.hms.services.opdmanagement.model;

import com.hms.services.opdmanagement.entity.HMS_TM_OPDCharges;
import com.hms.services.opdmanagement.entity.HMS_TM_OPDPayments;
import lombok.Data;

@Data
public class OPDPaymentsWithPatientDTO {
    private HMS_TM_OPDPayments payments;
    private String patientId;

    public OPDPaymentsWithPatientDTO(HMS_TM_OPDPayments payments, String patientId) {
        this.payments = payments;
        this.patientId = patientId;
    }
}

