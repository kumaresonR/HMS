package com.hms.services.adminmanagement.configuration;

import java.util.Random;
import org.apache.commons.lang3.RandomStringUtils;

public class UserUtils {
    public static String generateUsername(String firstName) {
        Random random = new Random();
        int randomNumber = 100 + random.nextInt(900); // Generate a 3-digit random number
        return firstName.toLowerCase() + randomNumber;
    }

    public static String generateRandomPassword() {
        return RandomStringUtils.random(8, true, true); // 8-character alphanumeric password
    }
}



