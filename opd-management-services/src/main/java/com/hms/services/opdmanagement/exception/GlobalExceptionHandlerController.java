
package com.hms.services.opdmanagement.exception;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.boot.web.error.ErrorAttributeOptions;
import org.springframework.boot.web.servlet.error.DefaultErrorAttributes;
import org.springframework.boot.web.servlet.error.ErrorAttributes;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingRequestHeaderException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import javax.crypto.IllegalBlockSizeException;
import java.io.IOException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;
import java.util.HashMap;
import java.util.Map;



@RestControllerAdvice
public class GlobalExceptionHandlerController{
	
	private static final org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger(GlobalExceptionHandlerController.class);
	
	@Bean
	public ErrorAttributes errorAttributes() {
		return new DefaultErrorAttributes() {
			@Override
			public Map<String, Object> getErrorAttributes(final WebRequest webRequest, final ErrorAttributeOptions includeStackTrace) {
				final Map<String, Object> errorAttributes = super.getErrorAttributes(webRequest, includeStackTrace);
				errorAttributes.remove("exception");
				return errorAttributes;
			}
		};
	}
	@ExceptionHandler(CustomException.class)
	public ResponseEntity<ResponseMessage> handleCustomException(HttpServletResponse res, CustomException ex)throws IOException{
		logger.error("CustomException occurred: {}", ex.getMessage(), ex);
		return ResponseEntity.status(ex.getHttpStatus()).body(new ResponseMessage(ex.getMessage()));

	}
//	@ExceptionHandler(AccessDeniedException.class)
//	public ResponseEntity<ResponseMessage> handleAccessDeniedException(final HttpServletResponse res,final AccessDeniedException e) throws IOException{
//		e.printStackTrace();
//		return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new ResponseMessage("Access denied"));
//	}
	@ExceptionHandler(MyAccessDeniedException.class)
	public ResponseEntity<ResponseMessage> handleMyAccessDeniedException(HttpServletResponse res, MyAccessDeniedException ex) throws IOException{
		return ResponseEntity.status(ex.getHttpStatus()).body(new ResponseMessage(ex.getMessage()));
	}
	@ExceptionHandler(MissingRequestHeaderException.class)
	public ResponseEntity<ResponseMessage> handleAuthorizationException(final HttpServletResponse res,final MissingRequestHeaderException e) throws IOException{
		logger.warn("Missing request header: {}", e.getMessage());
		return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new ResponseMessage("RequestHeader Missing"));
	}
	
//	@ExceptionHandler(JedisDataException.class)
//	public ResponseEntity<ResponseMessage> handleJedisDataException(final HttpServletResponse res,final JedisDataException e) throws IOException{
//		e.printStackTrace();
//		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ResponseMessage("MISCONF Redis is configured to save RDB snapshots"));
//	}

	@ResponseStatus(HttpStatus.BAD_REQUEST)
	@ExceptionHandler(MethodArgumentNotValidException.class)
	protected Map<String, String> handleMethodArgumentNotValid(MethodArgumentNotValidException ex) {
		Map<String, String> errors = new HashMap<>();
		ex.getBindingResult().getFieldErrors().forEach((error) ->{
			errors.put(error.getField(), error.getDefaultMessage());
		});
		return errors;
	}
	
	
	@ExceptionHandler(IllegalArgumentException.class)
	public ResponseEntity<ResponseMessage> handleIllegalArgumentException(final HttpServletResponse res,final IllegalArgumentException e) throws IOException{
		logger.warn("Illegal argument exception: {}", e.getMessage());
		return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new ResponseMessage("Argument is not correct one"));
	}
	
	@ExceptionHandler(NoSuchAlgorithmException.class)
	public ResponseEntity<ResponseMessage> handleNoSuchAlgorithmException(final HttpServletResponse res,final NoSuchAlgorithmException e) throws IOException{
		logger.error("No such algorithm exception", e);
		return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new ResponseMessage("No such algorithm to convert it"));
	}
	
	@ExceptionHandler(InvalidKeyException.class)
	public ResponseEntity<ResponseMessage> handleInvalidKeyException(final HttpServletResponse res,final InvalidKeyException e) throws IOException{
		logger.error("Invalid key exception", e);
		return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new ResponseMessage("Invalid key supplied"));
	}
	
	
	@ExceptionHandler(IllegalBlockSizeException.class)
	public ResponseEntity<ResponseMessage> handleIllegalBlockSizeException(final HttpServletResponse res,final IllegalBlockSizeException e) throws IOException{
		logger.warn("Illegal block size exception: {}", e.getMessage());
		return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new ResponseMessage("size is too large"));
	}
	
	
	@ExceptionHandler(InvalidKeySpecException.class)
	public ResponseEntity<ResponseMessage> handleInvalidKeySpecException(final HttpServletResponse res,final InvalidKeySpecException e) throws IOException{
		logger.error("Invalid key specification exception", e);
		return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new ResponseMessage("Invalid key specification"));
	}

}

