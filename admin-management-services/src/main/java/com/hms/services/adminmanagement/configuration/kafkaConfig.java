package com.hms.services.adminmanagement.configuration;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

//@Configuration
//public class kafkaConfig {
//
//    @Bean
//    public NewTopic leaveNotificationTopic() {
//        return TopicBuilder.name("leave-requests-notifications")
//                .partitions(3)
//                .replicas(1)
//                .build();
//    }
//
//    @Bean
//    public NewTopic leaveApproveNotificationTopic() {
//        return TopicBuilder.name("leave-approve-notifications")
//                .partitions(3)
//                .replicas(1)
//                .build();
//    }
//
//}



