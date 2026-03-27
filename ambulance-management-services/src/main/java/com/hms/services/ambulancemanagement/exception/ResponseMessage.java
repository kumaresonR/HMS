
package com.hms.services.ambulancemanagement.exception;

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


