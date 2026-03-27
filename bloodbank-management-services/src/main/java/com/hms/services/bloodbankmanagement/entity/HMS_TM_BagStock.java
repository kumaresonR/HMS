package com.hms.services.bloodbankmanagement.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Data
@Entity
@Table(name = "HMS_TM_BAG_STOCK")
public class HMS_TM_BagStock {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "BAG_STOCK_ID", length = 36)
    private String bagStockId;

    @Column(name = "DONOR_ID")
    private String donorId;

    @Column(name = "DONATE_DATE")
    private Date donateDate;

    @Column(name = "BAG_NO", length = 255)
    private String bagNo;

    @Column(name = "VOLUME")
    private Double volume;

    @Column(name = "UNIT_TYPE", length = 50)
    private String unitType;

    @Column(name = "LOT", length = 100)
    private String lot;

    @Column(name = "CHARGE_CATEGORY", length = 255)
    private String chargeCategory;

    @Column(name = "CHARGE_NAME", length = 255)
    private String chargeName;

    @Column(name = "STANDARD_CHARGE")
    private Double standardCharge;

    @Column(name = "INSTITUTION", length = 255)
    private String institution;

    @Column(name = "NOTE", length = 1000)
    private String note;

    @Column(name = "TOTAL")
    private Double total;

    @Column(name = "DISCOUNT")
    private Double discount;

    @Column(name = "TAX")
    private Double tax;

    @Column(name = "NET_AMOUNT")
    private Double netAmount;

    @Column(name = "PAYMENT_MODE", length = 50)
    private String paymentMode;

    @Column(name = "PAYMENT_AMOUNT")
    private Double paymentAmount;

    @Column(name = "BALANCE_AMOUNT")
    private Double balanceAmount;

    @Column(name = "CHEQUE_NO", length = 255)
    private String chequeNo;

    @Column(name = "CHEQUE_DATE")
    private Date chequeDate;

    @Lob
    @Column(name = "ATTACH_DOCUMENT", columnDefinition = "text")
    private String attachDocument;

    @Column(name = "DELETED")
    private Boolean deleted = false;
}


