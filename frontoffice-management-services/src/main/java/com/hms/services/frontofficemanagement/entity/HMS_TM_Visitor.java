package com.hms.services.frontofficemanagement.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

import java.time.OffsetDateTime;
import java.util.Arrays;
import java.util.Date;
import java.util.Objects;
import java.util.UUID;

@Entity
@Table(name = "HMS_TM_VISITOR")
@SQLDelete(sql = "UPDATE HMS_TM_VISITOR SET \"IS_DELETED\" = true WHERE \"ID\" = ?")
@Where(clause = "\"IS_DELETED\" = false")
public class HMS_TM_Visitor {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "ID")
    private UUID id;

    @Column(name = "PURPOSE")
    private String purpose;

    @Column(name = "NAME")
    private String name;

    @Column(name = "MOBILE_NUMBER")
    private String mobileNumber;

    @Column(name = "ID_CARD")
    private String idCard;

    @Column(name = "VISIT_TO")
    private String visitTo;

    @Column(name = "STAFF_NAME")
    private String staffName;

    @Column(name = "NO_OF_PEOPLE")
    private Integer noOfPeople;

    @Column(name = "DATE")
    private Date date;

    @Column(name = "IN_TIME")
    private OffsetDateTime inTime;

    @Column(name = "OUT_TIME")
    private OffsetDateTime outTime;

    @Column(name = "NOTE")
    private String note;

    @Column(name = "IS_DELETED")
    private Boolean isDeleted;

    @Column(name = "FILE")
    private byte[] file;


    @Override
    public final boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof HMS_TM_Visitor that)) return false;

        return id.equals(that.id) && Objects.equals(purpose, that.purpose) && Objects.equals(name, that.name) && Objects.equals(mobileNumber, that.mobileNumber) && Objects.equals(idCard, that.idCard) && Objects.equals(visitTo, that.visitTo) && Objects.equals(staffName, that.staffName) && Objects.equals(noOfPeople, that.noOfPeople) && Objects.equals(date, that.date) && Objects.equals(inTime, that.inTime) && Objects.equals(outTime, that.outTime) && Objects.equals(note, that.note) && Objects.equals(isDeleted, that.isDeleted) && Arrays.equals(file, that.file);
    }

    @Override
    public int hashCode() {
        int result = id.hashCode();
        result = 31 * result + Objects.hashCode(purpose);
        result = 31 * result + Objects.hashCode(name);
        result = 31 * result + Objects.hashCode(mobileNumber);
        result = 31 * result + Objects.hashCode(idCard);
        result = 31 * result + Objects.hashCode(visitTo);
        result = 31 * result + Objects.hashCode(staffName);
        result = 31 * result + Objects.hashCode(noOfPeople);
        result = 31 * result + Objects.hashCode(date);
        result = 31 * result + Objects.hashCode(inTime);
        result = 31 * result + Objects.hashCode(outTime);
        result = 31 * result + Objects.hashCode(note);
        result = 31 * result + Objects.hashCode(isDeleted);
        result = 31 * result + Arrays.hashCode(file);
        return result;
    }

    @Override
    public String toString() {
        return "HMS_TM_Visitor{" +
                "id=" + id +
                ", visitorType='" + purpose + '\'' +
                ", name='" + name + '\'' +
                ", mobileNumber=" + mobileNumber +
                ", idCard='" + idCard + '\'' +
                ", visitTo='" + visitTo + '\'' +
                ", nOfPeople=" + noOfPeople +
                ", date=" + date +
                ", inTime='" + inTime + '\'' +
                ", outTime='" + outTime + '\'' +
                ", notes='" + note + '\'' +
                ", file=" + Arrays.toString(file) +
                ", isDeleted='" + isDeleted + '\'' +
                '}';
    }

    public HMS_TM_Visitor(UUID id, String purpose, String name, String mobileNumber, String idCard,
                          String visitTo, Integer noOfPeople, Date date, OffsetDateTime inTime, OffsetDateTime outTime,
                          String note, byte[] file, Boolean isDeleted, String staffName) {
        this.id = id;
        this.purpose = purpose;
        this.name = name;
        this.mobileNumber = mobileNumber;
        this.idCard = idCard;
        this.visitTo = visitTo;
        this.noOfPeople = noOfPeople;
        this.date = date;
        this.inTime = inTime;
        this.outTime = outTime;
        this.note = note;
        this.file = file;
        this.isDeleted = isDeleted;
        this.staffName = staffName;
    }

    public HMS_TM_Visitor() {
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getPurpose() {
        return purpose;
    }

    public void setPurpose(String visitorType) {
        this.purpose = visitorType;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getMobileNumber() {
        return mobileNumber;
    }

    public void setMobileNumber(String mobileNumber) {
        this.mobileNumber = mobileNumber;
    }

    public String getIdCard() {
        return idCard;
    }

    public void setIdCard(String idCard) {
        this.idCard = idCard;
    }

    public String getVisitTo() {
        return visitTo;
    }

    public void setVisitTo(String visitTo) {
        this.visitTo = visitTo;
    }

    public Integer getNoOfPeople() {
        return noOfPeople;
    }

    public void setNoOfPeople(Integer noOfPeople) {
        this.noOfPeople = noOfPeople;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public OffsetDateTime getInTime() {
        return inTime;
    }

    public void setInTime(OffsetDateTime inTime) {
        this.inTime = inTime;
    }

    public OffsetDateTime getOutTime() {
        return outTime;
    }

    public void setOutTime(OffsetDateTime outTime) {
        this.outTime = outTime;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String notes) {
        this.note = notes;
    }

    public byte[] getFile() {
        return file;
    }

    public void setFile(byte[] file) {
        this.file = file;
    }

    public Boolean getDeleted() {
        return isDeleted;
    }

    public void setDeleted(Boolean deleted) {
        isDeleted = deleted;
    }

    public String getStaffName() {
        return staffName;
    }

    public void setStaffName(String staffName) {
        this.staffName = staffName;
    }
}


