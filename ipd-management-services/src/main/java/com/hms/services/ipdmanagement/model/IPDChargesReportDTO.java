package com.hms.services.ipdmanagement.model;


import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class IPDChargesReportDTO {

    private String ipdChargeId;
    private String ipdId;
    private String chargeTypeId;
    private String chargeCategoryId;
    private String chargeNameId;
    private Double standardCharge;
    private Double tpaCharge;
    private boolean isTpa = false;
    private boolean isGstAdded;
    private Float qty;
    private Float total;
    private Double discountAmount;
    private Double discountPercentage;
    private Double taxAmount;
    private Double taxPercentage;
    private Double netAmount;
    private String chargeNote;
    private LocalDateTime date;
    private String doctorName;
    private CombinedCharges combinedCharges;
    private IPDCombinedDTO.PatientDTO patients;

    @Data
    public static class CombinedCharges {

        private String chargeId;
        private String chargeTypeId;
        private String categoryId;
        private String unitTypeId;
        private String taxCategoryId;
        private String chargeName;
        private Double taxPercentage;
        private Double standardCharge;
        private String description;
        private String modNo;
        private String authStat;
        private String recordStat;
        private ChargeTypeDTO chargeType;
        private ChargeCategoryDTO chargeCategory;
        private UnitTypeDTO unitType;
        private TaxCategoryDTO taxCategory;
        private List<ScheduleChargeDTO> scheduleCharges;
    }

}

