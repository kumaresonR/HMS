package com.hms.services.frontofficemanagement.service;


import com.hms.services.frontofficemanagement.model.Visitor;

import java.util.List;
import java.util.UUID;


public interface VisitorService {

    public Visitor createVisitor(Visitor visitorDto);

    List<Visitor> getAllVisitors();

    Visitor getVisitorById(UUID id);

    Visitor updateVisitor(UUID id, Visitor complaintDto);

    Boolean deleteVisitorById(UUID id);
}


