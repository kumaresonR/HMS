package com.hms.services.frontofficemanagement.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

import java.util.Arrays;
import java.util.Date;
import java.util.Objects;
import java.util.UUID;

@Entity
@Table (name = "HMS_TM_COMPLAINT")
@SQLDelete(sql = "UPDATE HMS_TM_COMPLAINT SET \"IS_DELETED\" = true WHERE \"ID\" = ?")
@Where(clause = "\"IS_DELETED\" = false")
public class HMS_TM_Complaint {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "ID")
    private UUID id;

    @Column(name = "COMPLAINT_TYPE")
    private String complaintType;

    @Column(name = "SOURCE")
    private String source;

    @Column(name = "NAME")
    private String name;

    @Column(name = "MOBILE_NUMBER")
    private String mobileNumber;

    @Column(name = "DATE")
    private Date date;

    @Column(name = "DESCRIPTION")
    private String description;

    @Column(name = "ACTION_TAKEN")
    private String actionTaken;

    @Column(name = "ASSIGNED")
    private String assigned;

    @Column(name = "NOTE")
    private String note;

    @Column(name = "FILE")
    private byte[] file;

    @Column(name = "IS_DELETED", nullable = false)
    private Boolean isDeleted =false;

    @Override
    public final boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof HMS_TM_Complaint that)) return false;

        return id.equals(that.id) && Objects.equals(complaintType, that.complaintType) && Objects.equals(source, that.source) && Objects.equals(name, that.name) && Objects.equals(mobileNumber, that.mobileNumber) && Objects.equals(date, that.date) && Objects.equals(description, that.description) && Objects.equals(actionTaken, that.actionTaken) && Objects.equals(assigned, that.assigned) && Objects.equals(note, that.note) && Arrays.equals(file, that.file);
    }

    @Override
    public int hashCode() {
        int result = id.hashCode();
        result = 31 * result + Objects.hashCode(complaintType);
        result = 31 * result + Objects.hashCode(source);
        result = 31 * result + Objects.hashCode(name);
        result = 31 * result + Objects.hashCode(mobileNumber);
        result = 31 * result + Objects.hashCode(date);
        result = 31 * result + Objects.hashCode(description);
        result = 31 * result + Objects.hashCode(actionTaken);
        result = 31 * result + Objects.hashCode(assigned);
        result = 31 * result + Objects.hashCode(note);
        result = 31 * result + Arrays.hashCode(file);
        return result;
    }

    @Override
    public String toString() {
        return "HMS_TM_Complaint{" +
                "id=" + id +
                ", complaintType='" + complaintType + '\'' +
                ", source='" + source + '\'' +
                ", complainBy='" + name + '\'' +
                ", contact='" + mobileNumber + '\'' +
                ", date=" + date +
                ", description='" + description + '\'' +
                ", actionTaken='" + actionTaken + '\'' +
                ", assigned='" + assigned + '\'' +
                ", note='" + note + '\'' +
                ", file=" + Arrays.toString(file) +
                ", isDeleted=" + isDeleted +
                '}';
    }

    public HMS_TM_Complaint(UUID id, String complaintType, String source, String name,
                            String mobileNumber, Date date, String description, String actionTaken,
                            String assigned, String note, byte[] file, Boolean isDeleted) {
        this.id = id;
        this.complaintType = complaintType;
        this.source = source;
        this.name = name;
        this.mobileNumber = mobileNumber;
        this.date = date;
        this.description = description;
        this.actionTaken = actionTaken;
        this.assigned = assigned;
        this.note = note;
        this.file = file;
        this.isDeleted = isDeleted;
    }

    public HMS_TM_Complaint() {
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getComplaintType() {
        return complaintType;
    }

    public void setComplaintType(String complaintType) {
        this.complaintType = complaintType;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
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

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getActionTaken() {
        return actionTaken;
    }

    public void setActionTaken(String actionTaken) {
        this.actionTaken = actionTaken;
    }

    public String getAssigned() {
        return assigned;
    }

    public void setAssigned(String assigned) {
        this.assigned = assigned;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
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
}


