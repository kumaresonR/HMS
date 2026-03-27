package com.hms.services.loginmanagement.security;


import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.hms.services.loginmanagement.model.TokenType;
import com.hms.services.loginmanagement.service.TokenBlacklistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class TokenProvider {

	@Value("${security.jwt.token.secret-key:6t3v269pisik0mgkev5uvi5jd1}")
	private String secretKey;

	@Value("${security.jwt.token.expire.time:3600000}")
	private long expireTime;
	@Autowired
	TokenBlacklistService tokenBlacklistService;

	// Generate JWT token
	public String createToken(String username, TokenType tokenType) {
		long expirationTime = tokenType == TokenType.ACCESS ? expireTime : expireTime;
		return JWT.create()
				.withSubject(username)
				.withClaim("type", tokenType.name())
				.withIssuedAt(new Date())
				.withExpiresAt(new Date(System.currentTimeMillis() + expirationTime))
				.sign(Algorithm.HMAC512(secretKey));
	}

	// Get username from token
	public String getUsernameFromToken(String token) {
		DecodedJWT decodedJWT = JWT.require(Algorithm.HMAC512(secretKey))
				.build()
				.verify(token);
		return decodedJWT.getSubject();
	}

	// Validate the token
	public boolean validateToken(String token,TokenType tokenType) {
		try {
			DecodedJWT decodedJWT = JWT.require(Algorithm.HMAC512(secretKey))
					.build()
					.verify(token);
			String tokenTypeClaim = decodedJWT.getClaim("type").asString();
			if (tokenTypeClaim == null || !tokenTypeClaim.equals(tokenType.name())) {
				return false;
			}
			if (tokenBlacklistService.isTokenBlacklisted(token)) {
				return false;
			}
			return true;
		} catch (Exception e) {
			return false;
		}
	}
}
