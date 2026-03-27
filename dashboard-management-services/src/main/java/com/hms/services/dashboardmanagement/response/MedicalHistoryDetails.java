package com.hms.services.dashboardmanagement.response;

import lombok.Data;

@Data
public class MedicalHistoryDetails {
    private Integer OpdHistory;
    private Integer ambulanceHistory;
    private Integer pathologyHistory;
    private Integer radiologyHistory;
    private Integer pharmacyHistory;
    private Integer bloodBankHistory;
}


