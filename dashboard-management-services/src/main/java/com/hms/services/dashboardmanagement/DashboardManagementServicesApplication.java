package com.hms.services.dashboardmanagement;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableDiscoveryClient
@EnableFeignClients
public class DashboardManagementServicesApplication {

	public static void main(String[] args) {
		SpringApplication.run(DashboardManagementServicesApplication.class, args);
	}

}


