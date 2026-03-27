
package com.hms.services.otmanagement.exception;

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

