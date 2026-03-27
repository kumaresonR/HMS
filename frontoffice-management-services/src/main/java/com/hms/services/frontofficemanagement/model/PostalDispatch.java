package com.hms.services.frontofficemanagement.model;

public class PostalDispatch {
    private String id;
    private String from_title;
    private String ref_no;
    private String address;
    private String note;
    private String to_title;
    private String date;
    private String file;
    private Boolean isDeleted;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }
    public String getFrom_title() {
        return from_title;
    }

    public void setFrom_title(String from_title) {
        this.from_title = from_title;
    }

    public String getRef_no() {
        return ref_no;
    }

    public void setRef_no(String ref_no) {
        this.ref_no = ref_no;
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

    public String getTo_title() {
        return to_title;
    }

    public void setTo_title(String to_title) {
        this.to_title = to_title;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
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


