package com.hms.services.bloodbankmanagement.model;

import com.hms.services.bloodbankmanagement.entity.HMS_TM_BloodDonorDetails;
import com.hms.services.bloodbankmanagement.entity.HMS_TM_DonorDetails;
import lombok.Data;

import java.util.Date;

@Data
public class BloodDonorDetailsDTO {

    private String bloodDonorId;
    private String donorId;
    private Date donateDate;
    private String bag;
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

    public BloodDonorDetailsDTO(HMS_TM_BloodDonorDetails bloodDonorDetails, HMS_TM_DonorDetails donorDetails) {
        this.bloodDonorId = bloodDonorDetails.getBloodDonorId();
        this.donorId = bloodDonorDetails.getDonorId();
        this.donateDate = bloodDonorDetails.getDonateDate();
        this.bag = bloodDonorDetails.getBag();
        this.volume = bloodDonorDetails.getVolume();
        this.unitType = bloodDonorDetails.getUnitType();
        this.lot = bloodDonorDetails.getLot();
        this.chargeCategory = bloodDonorDetails.getChargeCategory();
        this.chargeName = bloodDonorDetails.getChargeName();
        this.standardCharge = bloodDonorDetails.getStandardCharge();
        this.institution = bloodDonorDetails.getInstitution();
        this.note = bloodDonorDetails.getNote();
        this.total = bloodDonorDetails.getTotal();
        this.discount = bloodDonorDetails.getDiscount();
        this.tax = bloodDonorDetails.getTax();
        this.netAmount = bloodDonorDetails.getNetAmount();
        this.paymentMode = bloodDonorDetails.getPaymentMode();
        this.paymentAmount = bloodDonorDetails.getPaymentAmount();
        this.balanceAmount = bloodDonorDetails.getBalanceAmount();
        this.chequeNo = bloodDonorDetails.getChequeNo();
        this.chequeDate = bloodDonorDetails.getChequeDate();
        this.attachDocument = bloodDonorDetails.getAttachDocument();
        this.deleted = bloodDonorDetails.getDeleted();
        this.donorDetails = donorDetails;
    }
}


