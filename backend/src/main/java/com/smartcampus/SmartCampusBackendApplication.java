package com.smartcampus;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(exclude = { 
    org.springframework.boot.autoconfigure.security.oauth2.client.servlet.OAuth2ClientAutoConfiguration.class 
})
public class SmartCampusBackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(SmartCampusBackendApplication.class, args);
    }
}