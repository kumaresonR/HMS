package com.hms.services.billingmanagement.model;


import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class PurchaseBillDTO {
    private String purchaseBillId;
    private String supplierId;
    private String billNo;
    private LocalDateTime purchaseDate;
    private String note;
    private Double totalAmount;
    private Double discount;
    private Double tax;
    private Double netAmount;
    private String paymentMode;
    private Double paymentAmount;
    private String paymentNote;
    private String attachment;
    private String chequeNo;
    private LocalDate chequeDate;
    private String chequeAttachDocument;
    private String status;
    private List<PurchaseMedicineDTO> medicines;
}


