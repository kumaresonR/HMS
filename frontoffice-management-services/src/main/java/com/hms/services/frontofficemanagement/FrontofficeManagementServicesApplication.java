package com.hms.services.frontofficemanagement;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableDiscoveryClient
@EnableFeignClients
public class FrontofficeManagementServicesApplication {

	public static void main(String[] args) {
		SpringApplication.run(FrontofficeManagementServicesApplication.class, args);
	}

}



