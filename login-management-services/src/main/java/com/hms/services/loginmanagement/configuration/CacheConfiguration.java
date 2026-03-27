package com.hms.services.loginmanagement.configuration;

import jakarta.annotation.PreDestroy;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import redis.clients.jedis.JedisPool;
import redis.clients.jedis.JedisPoolConfig;

import java.time.Duration;

@Configuration
public class CacheConfiguration {

    @Value("${redis.issl:false}")
    private boolean isSsl;

    @Value("${redis.hostname:localhost}")
    private String host;

    @Value("${redis.port:6379}")
    private int port;

    @Value("${redis.timeout:2000}")
    private int timeout;

    @Value("${redis.auth:}") // Empty default
    private String auth;

    private JedisPool jedisPool;

    @Bean
    public JedisPool jedisPool() {
        JedisPoolConfig poolConfig = buildPoolConfig();

        // Check if authentication should be used
        boolean useAuth = auth != null && !auth.trim().isEmpty() && !"auth".equals(auth);

        if (isSsl) {
            // SSL configuration
            if (useAuth) {
                jedisPool = new JedisPool(poolConfig, host, port, timeout, auth, isSsl);
            } else {
                jedisPool = new JedisPool(poolConfig, host, port, timeout, null, isSsl);
            }
        } else {
            // Non-SSL configuration
            if (useAuth) {
                jedisPool = new JedisPool(poolConfig, host, port, timeout, auth);
            } else {
                // No authentication
                jedisPool = new JedisPool(poolConfig, host, port, timeout);
            }
        }

        // Test connection
        testConnection(jedisPool);

        return jedisPool;
    }

    private JedisPoolConfig buildPoolConfig() {
        JedisPoolConfig poolConfig = new JedisPoolConfig();
        poolConfig.setMaxIdle(8);
        poolConfig.setMinIdle(2);
        poolConfig.setMaxTotal(20);
        poolConfig.setMaxWait(Duration.ofMillis(10000));
        poolConfig.setTestOnBorrow(true);
        poolConfig.setTestOnReturn(true);
        poolConfig.setTestWhileIdle(true);
        return poolConfig;
    }

    private void testConnection(JedisPool jedisPool) {
        try (var jedis = jedisPool.getResource()) {
            String result = jedis.ping();
            if ("PONG".equals(result)) {
                System.out.println("✅ Redis connection successful to " + host + ":" + port);
            } else {
                throw new RuntimeException("Unexpected response from Redis: " + result);
            }
        } catch (Exception e) {
            System.err.println("❌ Redis connection failed: " + e.getMessage());
            throw new RuntimeException("Failed to connect to Redis", e);
        }
    }

    @PreDestroy
    public void destroy() {
        if (jedisPool != null && !jedisPool.isClosed()) {
            jedisPool.close();
            System.out.println("Redis connection pool closed");
        }
    }
}
