package com.hms.services.ipdmanagement.model;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class IPDChargesTypeDTO {

    private String chargeTypeId;
    private String chargeType;
    private String createdBy;
    private String lastModifiedBy;
    private LocalDateTime lastModifiedAt;
    private List<IPDChargesCategoryDTO> chargesCategories;


}

