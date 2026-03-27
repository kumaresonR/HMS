package com.hms.services.opdmanagement.model;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class OPDChargesReportDTO {

        private String opdChargeId;
        private String opdId;
        private Double standardCharge;
        private Double tpaCharge;
        private boolean applyTpa;
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
        private OPDCombinedDTO.PatientDTO patients;

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

