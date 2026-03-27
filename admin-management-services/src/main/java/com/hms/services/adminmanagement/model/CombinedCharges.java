package com.hms.services.adminmanagement.model;

import lombok.Data;

import java.util.List;

@Data
public class CombinedCharges {

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



