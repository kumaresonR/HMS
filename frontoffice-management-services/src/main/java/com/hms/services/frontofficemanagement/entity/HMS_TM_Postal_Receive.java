package com.hms.services.frontofficemanagement.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

import java.util.Arrays;
import java.util.Date;
import java.util.Objects;
import java.util.UUID;


@Entity
@Table (name = "HMS_TM_POSTAL_RECEIVE")
@SQLDelete(sql = "UPDATE HMS_TM_POSTAL_RECEIVE SET \"IS_DELETED\" = true WHERE \"ID\" = ?")
@Where(clause = "\"IS_DELETED\" = false")
public class HMS_TM_Postal_Receive {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "ID")
    private UUID id;

    @Column(name = "FROM_TITLE")
    private String fromTitle;

    @Column(name = "REF_NUMBER")
    private String referenceNumber;

    @Column(name = "ADDRESS")
    private String address;

    @Column(name = "NOTE")
    private String note;

    @Column(name = "TO_TITLE")
    private String toTitle;

    @Column(name = "DATE")
    private Date date;

    @Column(name = "FILE")
    private byte[] file;

    @Column(name = "IS_DELETED", nullable = false)
    private Boolean isDeleted =false;

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getFromTitle() {
        return fromTitle;
    }

    public void setFromTitle(String fromTitle) {
        this.fromTitle = fromTitle;
    }

    public String getReferenceNumber() {
        return referenceNumber;
    }

    public void setReferenceNumber(String referenceNumber) {
        this.referenceNumber = referenceNumber;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public String getToTitle() {
        return toTitle;
    }

    public void setToTitle(String toTitle) {
        this.toTitle = toTitle;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
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

    public HMS_TM_Postal_Receive() {
    }

    @Override
    public final boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof HMS_TM_Postal_Receive that)) return false;

        return id.equals(that.id) && Objects.equals(fromTitle, that.fromTitle) && Objects.equals(referenceNumber, that.referenceNumber) && Objects.equals(address, that.address) && Objects.equals(note, that.note) && Objects.equals(toTitle, that.toTitle) && Objects.equals(date, that.date) && Arrays.equals(file, that.file) && Objects.equals(isDeleted, that.isDeleted);
    }

    @Override
    public int hashCode() {
        int result = id.hashCode();
        result = 31 * result + Objects.hashCode(fromTitle);
        result = 31 * result + Objects.hashCode(referenceNumber);
        result = 31 * result + Objects.hashCode(address);
        result = 31 * result + Objects.hashCode(note);
        result = 31 * result + Objects.hashCode(toTitle);
        result = 31 * result + Objects.hashCode(date);
        result = 31 * result + Arrays.hashCode(file);
        result = 31 * result + Objects.hashCode(isDeleted);
        return result;
    }

    @Override
    public String toString() {
        return "HMS_TM_Postal_Receive{" +
                "id=" + id +
                ", fromTitle='" + fromTitle + '\'' +
                ", referenceNumber='" + referenceNumber + '\'' +
                ", address='" + address + '\'' +
                ", note='" + note + '\'' +
                ", toTitle='" + toTitle + '\'' +
                ", date=" + date +
                ", file=" + Arrays.toString(file) +
                ", isDeleted=" + isDeleted +
                '}';
    }

    public HMS_TM_Postal_Receive(UUID id, String fromTitle, String referenceNumber, String address,
                                 String note, String toTitle, Date date, byte[] file,
                                 Boolean isDeleted) {
        this.id = id;
        this.fromTitle = fromTitle;
        this.referenceNumber = referenceNumber;
        this.address = address;
        this.note = note;
        this.toTitle = toTitle;
        this.date = date;
        this.file = file;
        this.isDeleted = isDeleted;
    }
}


