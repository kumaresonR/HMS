package com.hms.services.billingmanagement.model;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class StockResponse {
    private String name;
    private String category;
    private String batchNo;
    private String expiryDate;
    private Double salePrice;
    private Double amount;
    private Double tax;
    private Integer boxPacking;
    private String companyName;
    private String supplierName;
    private LocalDateTime purchaseDate;
}


