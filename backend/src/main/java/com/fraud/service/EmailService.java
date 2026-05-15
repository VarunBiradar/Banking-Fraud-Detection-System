package com.fraud.service;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendFraudAlert(String to, String transactionDetails, String reason) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("URGENT: Suspicious Activity Detected");
        message.setText("Suspicious activity detected on your account.\n\n" +
                "Reason: " + reason + "\n" +
                "Transaction Details: " + transactionDetails + "\n\n" +
                "If this wasn't you, please contact support immediately.");
        
        try {
            mailSender.send(message);
        } catch (Exception e) {
            // Log error, but don't break the flow for now
            System.err.println("Failed to send email: " + e.getMessage());
        }
    }
}
