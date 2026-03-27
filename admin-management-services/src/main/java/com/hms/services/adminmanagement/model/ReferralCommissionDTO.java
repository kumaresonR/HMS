package com.hms.services.adminmanagement.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReferralCommissionDTO {

    private String commissionId;
    private String categoryId;
    private double opdCommission;
    private double ipdCommission;
    private double pharmacyCommission;
    private double pathologyCommission;
    private double radiologyCommission;
    private double bloodBankCommission;
    private double ambulanceCommission;
    private double standardCommission;
    private String modNo;
    private String authStat;
    private String recordStat;
    private boolean isActive;
    private LocalDateTime createdAt;
    private String createdBy;
    private String lastModifiedBy;
    private LocalDateTime lastModifiedAt;
    private ReferralCategoryDTO referralCategory;


}



