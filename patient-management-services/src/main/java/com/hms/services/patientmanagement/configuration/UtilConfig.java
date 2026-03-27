package com.hms.services.patientmanagement.configuration;

// Kafka imports disabled for local setup
//import org.apache.kafka.clients.producer.ProducerConfig;
//import org.apache.kafka.common.serialization.StringSerializer;
import org.modelmapper.ModelMapper;
//import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
//import org.springframework.kafka.core.DefaultKafkaProducerFactory;
//import org.springframework.kafka.core.KafkaTemplate;
//import org.springframework.kafka.core.ProducerFactory;
//import org.springframework.web.cors.CorsConfiguration;
//import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
//import org.springframework.web.filter.CorsFilter;

//import java.util.Arrays;
//import java.util.Collections;
//import java.util.HashMap;
//import java.util.Map;

//import org.apache.kafka.clients.admin.NewTopic;
//import org.springframework.kafka.config.TopicBuilder;

@Configuration
public class UtilConfig{


//    @Value("${cors.url}")
//    private String corsUrl;
//
//    @Bean
//    public CorsFilter corsFilter() {
//        final UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
//        final CorsConfiguration config = new CorsConfiguration();
//        config.setAllowCredentials(true);
//        config.setAllowedOrigins(Collections.singletonList(corsUrl));
//        config.setAllowedHeaders(Arrays.asList("Origin", "Content-Type", "Accept","Authorization","ApiKey"));
//        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "OPTIONS", "DELETE", "PATCH"));
//        source.registerCorsConfiguration("/**", config);
//        return new CorsFilter(source);
//    }


    @Bean
    public ModelMapper modelMapper() {
        return new ModelMapper();
    }

    // Kafka topic disabled for local setup
    //@Bean
    //public NewTopic labReportTopic() {
    //    return TopicBuilder.name("patient-appointment-completed").partitions(3).replicas(1).build();
    //}

}

