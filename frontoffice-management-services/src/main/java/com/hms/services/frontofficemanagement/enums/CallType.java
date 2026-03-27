package com.hms.services.frontofficemanagement.enums;

public enum CallType {
    Incoming("Incoming"),
    Outgoing("Outgoing");

    private final String callType;

    CallType(String callType) {
        this.callType = callType;
    }
    
    public String getCallType() {
        return callType;
    }

}


