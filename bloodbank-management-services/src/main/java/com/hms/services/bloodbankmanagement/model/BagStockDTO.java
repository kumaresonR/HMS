package com.hms.services.bloodbankmanagement.model;

import com.hms.services.bloodbankmanagement.entity.HMS_TM_BagStock;
import com.hms.services.bloodbankmanagement.entity.HMS_TM_DonorDetails;
import lombok.Data;

import java.util.Date;

@Data
public class BagStockDTO {

    private String bagStockId;
//    private String donorId;
    private Date donateDate;
    private String bagNo;
    private Double volume;
    private String unitType;
    private String lot;
    private String chargeCategory;
    private String chargeName;
    private Double standardCharge;
    private String institution;
    private String note;
    private Double total;
    private Double discount;
    private Double tax;
    private Double netAmount;
    private String paymentMode;
    private Double paymentAmount;
    private Double balanceAmount;
    private String chequeNo;
    private Date chequeDate;
    private String attachDocument;
    private Boolean deleted;

    private HMS_TM_DonorDetails donorDetails;

    public BagStockDTO(HMS_TM_BagStock bagStock, HMS_TM_DonorDetails donorDetails) {
        this.bagStockId = bagStock.getBagStockId();
//        this.donorId = bagStock.getDonorId();
        this.donateDate = bagStock.getDonateDate();
        this.bagNo = bagStock.getBagNo();
        this.volume = bagStock.getVolume();
        this.unitType = bagStock.getUnitType();
        this.lot = bagStock.getLot();
        this.chargeCategory = bagStock.getChargeCategory();
        this.chargeName = bagStock.getChargeName();
        this.standardCharge = bagStock.getStandardCharge();
        this.institution = bagStock.getInstitution();
        this.note = bagStock.getNote();
        this.total = bagStock.getTotal();
        this.discount = bagStock.getDiscount();
        this.tax = bagStock.getTax();
        this.netAmount = bagStock.getNetAmount();
        this.paymentMode = bagStock.getPaymentMode();
        this.paymentAmount = bagStock.getPaymentAmount();
        this.balanceAmount = bagStock.getBalanceAmount();
        this.chequeNo = bagStock.getChequeNo();
        this.chequeDate = bagStock.getChequeDate();
        this.attachDocument = bagStock.getAttachDocument();
        this.deleted = bagStock.getDeleted();
        this.donorDetails = donorDetails;
    }
}


