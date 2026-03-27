package com.hms.services.frontofficemanagement.model;

public class Visitor {
    private String id;
    private String purpose;
    private String name;
    private String contact;
    private String date;
    private String id_card;
    private String visit_to;
    private String ipd_opd_staff;
    private Integer no_of_people;
    private String in_time;
    private String out_time;
    private String note;
    private String file;
    private Boolean isDeleted;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }
    public String getPurpose() {
        return purpose;
    }

    public void setPurpose(String purpose) {
        this.purpose = purpose;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getContact() {
        return contact;
    }

    public void setContact(String contact) {
        this.contact = contact;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getId_card() {
        return id_card;
    }

    public void setId_card(String id_card) {
        this.id_card = id_card;
    }

    public String getVisit_to() {
        return visit_to;
    }

    public void setVisit_to(String visit_to) {
        this.visit_to = visit_to;
    }

    public String getIpd_opd_staff() {
        return ipd_opd_staff;
    }

    public void setIpd_opd_staff(String ipd_opd_staff) {
        this.ipd_opd_staff = ipd_opd_staff;
    }

    public Integer getNo_of_people() {
        return no_of_people;
    }

    public void setNo_of_people(Integer no_of_people) {
        this.no_of_people = no_of_people;
    }

    public String getIn_time() {
        return in_time;
    }

    public void setIn_time(String in_time) {
        this.in_time = in_time;
    }

    public String getOut_time() {
        return out_time;
    }

    public void setOut_time(String out_time) {
        this.out_time = out_time;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public String getFile() {
        return file;
    }

    public void setFile(String file) {
        this.file = file;
    }

    public Boolean getDeleted() {
        return isDeleted;
    }

    public void setDeleted(Boolean deleted) {
        isDeleted = deleted;
    }
}


