package com.hms.services.loginmanagement.configuration;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hms.services.loginmanagement.model.SecurityKeys;
import com.hms.services.loginmanagement.model.SignInResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;
import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;

@Primary
@Component
public class CacheRepository extends ObjectMapper {


	private final JedisPool jedisPool;


	@Autowired
	public CacheRepository(final JedisPool jedisPool) {
		this.jedisPool = jedisPool;
	}



	public SignInResponse getTokenInfo(String idmAccessToken) throws JsonProcessingException {
		Jedis jedis = jedisPool.getResource();
		String tokenInfoResponseStr = jedis.get(idmAccessToken);
		jedis.close();
		if(tokenInfoResponseStr == null){
			return null;
		}
		return readValue(tokenInfoResponseStr, SignInResponse.class);
	}


	public void setTokenInfo(String idmAccessToken, SignInResponse tokenInfoInCache, Long expiresIn) throws JsonProcessingException {
		String userData = writeValueAsString(tokenInfoInCache);
		Jedis jedis = jedisPool.getResource();
		jedis.set(idmAccessToken,userData);
		jedis.expire(idmAccessToken, expiresIn);
		jedis.set("r_"+tokenInfoInCache.getRefreshToken(),userData);
		jedis.expire("r_"+tokenInfoInCache.getRefreshToken(), expiresIn);
		jedis.close();
	}



	public void setPublicAndPrivateKey(String uniqueId, SecurityKeys securityKeys, long expiresIn) throws JsonProcessingException {
		String userData = writeValueAsString(securityKeys);
		Jedis jedis = jedisPool.getResource();
		jedis.set(uniqueId,userData);
		jedis.expire(uniqueId, expiresIn);
		jedis.close();

	}

	public SecurityKeys getPublicAndPrivateKey(String uniqueId) throws JsonProcessingException {
		Jedis jedis = jedisPool.getResource();
		String tokenInfoResponseStr = jedis.get(uniqueId);
		jedis.close();
		if(tokenInfoResponseStr == null){
			return null;
		}
		return readValue(tokenInfoResponseStr, SecurityKeys.class);
	}



	public void signOutTokenInfo(String accessToken) throws JsonMappingException, JsonProcessingException {
		Jedis jedis = jedisPool.getResource();
        String tokenInfoInCacheStr = jedis.get(accessToken);
		SignInResponse tokenInfoInCache = readValue(tokenInfoInCacheStr, SignInResponse.class);
        jedis.del(accessToken, tokenInfoInCache.getRefreshToken());
        jedis.close();
	}


//	public TokenInfoInCache getUserDataByRefereshToken(String refreshToken) throws JsonMappingException, JsonProcessingException {
//		 Jedis jedis = jedisPool.getResource();
//	        TokenInfoInCache tokenInfoInCache = readValue(jedis.get("r_" + refreshToken), TokenInfoInCache.class);
//	        jedis.close();
//			return tokenInfoInCache;
//
//	}
//
//	 public boolean isConnected() {
//	        boolean connected = false;
//	        final Jedis jedis = jedisPool.getResource();
//	        final String set = jedis.set("connectionTest", "connectTest");
//	        jedis.close();
//	        if("OK".equalsIgnoreCase(set)){
//	            connected = true;
//	        }
//	        return connected;
//	    }
//
//
//	 public TokenInfoInCache tokenInfo(String token) throws JsonProcessingException {
//	        Jedis jedis = jedisPool.getResource();
//	        String userInfo = jedis.get(token);
//	        jedis.close();
//	        return readValue(userInfo, TokenInfoInCache.class);
//	    }
//
//
//	public void setOTP(String key, int otp, long expireMins) throws JsonProcessingException {
//		String userData = writeValueAsString(otp);
//		Jedis jedis = jedisPool.getResource();
//		jedis.set(key,userData);
//		jedis.expire(key, expireMins);
//		jedis.close();
//
//	}
//
//
//	public void setUserInfo(String userName, Users user, long userTimeOut) throws JsonProcessingException {
//		String userData = writeValueAsString(user);
//		Jedis jedis = jedisPool.getResource();
//		jedis.set(userName,userData);
//		jedis.expire(userName, userTimeOut);
//		jedis.close();
//	}
//
//	public Users getUserInfo(String userName) throws JsonProcessingException {
//		Jedis jedis = jedisPool.getResource();
//		String userResponseStr = jedis.get(userName);
//		jedis.close();
//		if(userResponseStr == null){
//			return null;
//		}
//		return readValue(userResponseStr, Users.class);
//	}
//





}

































































/*public void setUserCreateTokenInfo(String idmAccessToken, String idmRefreshToken, Integer expiresIn) {
	String userData = jsonUtil.writeValueAsString(idmRefreshToken);
	Jedis jedis = jedisPool.getResource();
	jedis.set(idmAccessToken,userData);
	jedis.expire(idmAccessToken, expiresIn.longValue());
	jedis.close();


}*/


	/*public void deleteAllChannels() {
		Jedis jedis = jedisPool.getResource();
		Set<String> keys = jedis.keys("channel_name_*");
		for (String key : keys) {
			jedis.del(key);
		}
		Set<String> keysId = jedis.keys("channel_id_*");
		for (String key : keysId) {
			jedis.del(key);
		}

		jedis.close();
	}*/

	/*public Channel getChannelByName(String channelName) {
		Jedis jedis = jedisPool.getResource();
		String channelStr = jedis.get("channel_name_"+channelName);
		jedis.close();
		return jsonUtil.readValue(channelStr, Channel.class);
	}*/

	/*public Channel getChannelNameById(Integer channelId) {
		Jedis jedis = jedisPool.getResource();
		String channelStr = jedis.get("channel_id_"+channelId);
		jedis.close();
		return jsonUtil.readValue(channelStr, Channel.class);

	}*/

	/*public void deletePublickeyAndPrivateKey(String uniqueId) {
		Jedis jedis = jedisPool.getResource();
		Set<String> keysId = jedis.keys(uniqueId);
		for (String key : keysId) {
			jedis.del(key);
		}
		jedis.close();
	}*/
