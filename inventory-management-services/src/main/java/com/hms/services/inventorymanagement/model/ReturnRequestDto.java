package com.hms.services.inventorymanagement.model;

import lombok.Data;

@Data
public class ReturnRequestDto {
    private String item;
    private String itemCategory;
    private Integer quantity;
}


