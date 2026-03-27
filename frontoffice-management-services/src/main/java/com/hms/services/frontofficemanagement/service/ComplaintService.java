package com.hms.services.frontofficemanagement.service;

import com.hms.services.frontofficemanagement.entity.HMS_TM_Complaint;
import com.hms.services.frontofficemanagement.model.Complaint;

import java.util.List;
import java.util.UUID;


public interface ComplaintService {

    public Complaint createComplaint(Complaint complaintDto);

    List<Complaint> getAllComplaints();

    Complaint getComplaintById(UUID id);

    Complaint updateComplaint(UUID id, Complaint complaintDto);

    Boolean deleteComplaintById(UUID id);
}


