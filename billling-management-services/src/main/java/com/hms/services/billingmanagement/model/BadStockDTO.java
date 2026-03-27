package com.hms.services.billingmanagement.model;

import lombok.Data;

import java.util.Date;

@Data
public class BadStockDTO {
    private String id;
    private String addMedicineId;
    private String name;
    private String category;
    private String batchNo;
    private String expiryDate;
    private Date outwardDate;
    private Integer qty;
    private String note;
    private Boolean deleted;

    public BadStockDTO(String id, String addMedicineId, String name, String category, String batchNo,
                       String expiryDate, Date outwardDate, Integer qty, String note, Boolean deleted) {
        this.id = id;
        this.addMedicineId = addMedicineId;
        this.name = name;
        this.category = category;
        this.batchNo = batchNo;
        this.expiryDate = expiryDate;
        this.outwardDate = outwardDate;
        this.qty = qty;
        this.note = note;
        this.deleted = deleted;
    }

}


