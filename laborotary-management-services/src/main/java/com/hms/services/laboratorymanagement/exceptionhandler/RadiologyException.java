package com.hms.services.laboratorymanagement.exceptionhandler;


public class RadiologyException extends RuntimeException {
    private final String code;

    public RadiologyException(String message, String code, Throwable cause) {
        super(message, cause);
        this.code = code;
    }

    public RadiologyException(String message, String code) {
        super(message);
        this.code = code;
    }

    public String getCode() {
        return code;
    }
}


