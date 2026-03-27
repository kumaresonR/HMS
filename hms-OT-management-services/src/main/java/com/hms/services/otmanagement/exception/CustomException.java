
package com.hms.services.otmanagement.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

import java.io.Serial;

@Getter
public class CustomException extends RuntimeException {

	@Serial
	private static final long serialVersionUID = 1L;

	private final String message;
	private final HttpStatus httpStatus;

	public CustomException( final String message, final HttpStatus httpStatus) {
		super();
		this.message = message;
		this.httpStatus = httpStatus;
	}
	
	public CustomException( final String message, final HttpStatus httpStatus,Throwable ex) {
		super(ex);
		this.message = message;
		this.httpStatus = httpStatus;
	}

    public static long getSerialversionuid() {
		return serialVersionUID;
	}

}

