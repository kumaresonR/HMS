package com.hms.services.frontofficemanagement.entity;

import com.hms.services.frontofficemanagement.enums.CallType;
import jakarta.persistence.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

import java.io.Serializable;
import java.util.Date;
import java.util.Objects;
import java.util.UUID;


@Entity
@SQLDelete(sql = "UPDATE HMS_TM_PHONECALLLOG SET \"IS_DELETED\" = true WHERE \"ID\" = ?")
@Where(clause = "\"IS_DELETED\" = false")
@Table (name = "HMS_TM_PHONECALLLOG")
public class HMS_TM_PhoneCallLog implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "ID")
    private UUID id;

    @Column(name = "NAME")
    private String name;

    @Column(name = "MOBILE_NUMBER")
    private String mobileNumber;

    @Column(name = "DATE")
    private Date date;

    @Column(name = "DESCRIPTION")
    private String description;

    @Column(name = "FOLLOWUP_DATE")
    private Date followUpDate;

    @Column(name = "CALL_DURATION")
    private Integer callDuration;

    @Column(name = "NOTE")
    private String note;

    @Enumerated(EnumType.STRING)
    @Column(name = "CALL_TYPE")
    private CallType callType;

    @Column(name = "IS_DELETED", nullable = false)
    private Boolean isDeleted =false;

    public HMS_TM_PhoneCallLog() {

    }

    public HMS_TM_PhoneCallLog(UUID id, String name, String mobileNumber, Date date, String description,
                               Date followUpDate, Integer callDuration, String note, CallType callType,
                                Boolean isDeleted) {
        this.id = id;
        this.name = name;
        this.mobileNumber = mobileNumber;
        this.date = date;
        this.description = description;
        this.followUpDate = followUpDate;
        this.callDuration = callDuration;
        this.note = note;
        this.callType = callType;
        this.isDeleted = isDeleted;
    }

    public Boolean getDeleted() {
        return isDeleted;
    }

    public void setDeleted(Boolean deleted) {
        isDeleted = deleted;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
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

    public Date getFollowUpDate() {
        return followUpDate;
    }

    public void setFollowUpDate(Date followUpDate) {
        this.followUpDate = followUpDate;
    }

    public Integer getCallDuration() {
        return callDuration;
    }

    public void setCallDuration(Integer callDuration) {
        this.callDuration = callDuration;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public CallType getCallType() {
        return callType;
    }

    public void setCallType(CallType callType) {
        this.callType = callType;
    }

    @Override
    public final boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof HMS_TM_PhoneCallLog that)) return false;

        return id.equals(that.id) && Objects.equals(name, that.name) && Objects.equals(mobileNumber, that.mobileNumber) && Objects.equals(date, that.date) && Objects.equals(description, that.description) && Objects.equals(followUpDate, that.followUpDate) && Objects.equals(callDuration, that.callDuration) && Objects.equals(note, that.note) && callType == that.callType;
    }

    @Override
    public int hashCode() {
        int result = id.hashCode();
        result = 31 * result + Objects.hashCode(name);
        result = 31 * result + Objects.hashCode(mobileNumber);
        result = 31 * result + Objects.hashCode(date);
        result = 31 * result + Objects.hashCode(description);
        result = 31 * result + Objects.hashCode(followUpDate);
        result = 31 * result + Objects.hashCode(callDuration);
        result = 31 * result + Objects.hashCode(note);
        result = 31 * result + Objects.hashCode(callType);
        return result;
    }

    @Override
    public String toString() {
        return "HMS_TM_PhoneCallLog{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", mobileNumber=" + mobileNumber +
                ", date=" + date +
                ", description='" + description + '\'' +
                ", followUpDate=" + followUpDate +
                ", CallDuration=" + callDuration +
                ", note='" + note + '\'' +
                ", callType=" + callType +
                ", isDeleted=" + isDeleted +
                '}';
    }
}



