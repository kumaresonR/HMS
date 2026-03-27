package com.hms.services.notificationmanagement.configuration;



import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

@Configuration
public class KafkaConsumerConfig {

    @Bean
    public NewTopic labReportTopic() {
        return TopicBuilder.name("patient-appointment-completed").partitions(3).replicas(1).build();
    }
    @Bean
    public NewTopic pathologyReportTopic() {
        return TopicBuilder.name("pathology-labreport-completed").partitions(3).replicas(1).build();
    }
    @Bean
    public NewTopic radiologyReportTopic() {
        return TopicBuilder.name("radiology-labreport-completed").partitions(3).replicas(1).build();
    }

    @Bean
    public NewTopic leaveNotificationTopic() {
        return TopicBuilder.name("leave-requests-notifications").partitions(3).replicas(1).build();
    }

    @Bean
    public NewTopic leaveApproveNotificationTopic() {
        return TopicBuilder.name("leave-approve-notifications").partitions(3).replicas(1).build();
    }
}

