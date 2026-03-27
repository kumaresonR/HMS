package com.hms.services.bloodbankmanagement.model;

import lombok.Data;

@Data
public class BagStocksDTO {
    private String bagStockId;
    private String bagNo;
    private Double volume;
    private String unitType;
}


