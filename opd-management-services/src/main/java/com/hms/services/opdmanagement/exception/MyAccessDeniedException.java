
package com.hms.services.opdmanagement.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

import java.io.Serial;

@Getter
public class MyAccessDeniedException extends RuntimeException {

	@Serial
	private static final long serialVersionUID = 1L;

	private final String message;
	private final HttpStatus httpStatus;

	public MyAccessDeniedException(final String message, final HttpStatus httpStatus) {
		super();
		this.message = message;
		this.httpStatus = httpStatus;
	}

	public MyAccessDeniedException(final String message, final HttpStatus httpStatus, Throwable ex) {
		super(ex);
		this.message = message;
		this.httpStatus = httpStatus;
	}

	public MyAccessDeniedException(String s, String message, HttpStatus httpStatus) {
		this.message = message;
		this.httpStatus = httpStatus;
	}

    public static long getSerialversionuid() {
		return serialVersionUID;
	}

}

