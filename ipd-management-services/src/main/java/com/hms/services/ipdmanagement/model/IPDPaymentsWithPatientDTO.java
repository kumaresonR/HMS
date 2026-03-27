package com.hms.services.ipdmanagement.model;

import com.hms.services.ipdmanagement.entity.HMS_TM_IPDPayments;
import lombok.Data;

@Data
public class IPDPaymentsWithPatientDTO {

    private HMS_TM_IPDPayments payments;
    private String patientId;

    public IPDPaymentsWithPatientDTO(HMS_TM_IPDPayments payments, String patientId) {
        this.payments = payments;
        this.patientId = patientId;
    }
}

