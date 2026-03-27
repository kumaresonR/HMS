package com.hms.services.billingmanagement.model;


public interface ExpiryMedicineProjection {
    String getMedicineName();
    String getBatchNo();
    String getMedicineCategory();
    Integer getQuantity();
    String getExpiryDate();
}

