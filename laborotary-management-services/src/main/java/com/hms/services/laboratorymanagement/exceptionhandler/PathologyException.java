package com.hms.services.laboratorymanagement.exceptionhandler;

public class PathologyException extends RuntimeException {
    private final String code;

    public PathologyException(String message, String code, Throwable cause) {
        super(message, cause);
        this.code = code;
    }

    public String getCode() {
        return code;
    }
}

