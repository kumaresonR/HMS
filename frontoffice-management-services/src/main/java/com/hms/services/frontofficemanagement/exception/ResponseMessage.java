
package com.hms.services.frontofficemanagement.exception;

import lombok.Data;
import lombok.Setter;


@Setter
@Data
public class ResponseMessage {
	private String message;

	public ResponseMessage(String message) {

		this.message = message;
	}

}


