package com.fraud.service;

import com.fraud.model.FraudAlert;
import com.fraud.model.Transaction;
import com.fraud.model.TransactionStatus;
import com.fraud.repository.FraudAlertRepository;
import com.fraud.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FraudDetectionService {

    private final FraudAlertRepository fraudAlertRepository;
    private final TransactionRepository transactionRepository;
    private final EmailService emailService;

    public void detectFraud(Transaction transaction) {
        boolean isFraudulent = false;
        StringBuilder reasons = new StringBuilder();

        // Rule 1: High Amount
        if (transaction.getAmount() > 10000.0) {
            isFraudulent = true;
            reasons.append("HIGH_AMOUNT; ");
        }

        // Rule 2: Velocity Check (Simplified: > 3 transactions in last 5 mins)
        List<Transaction> lastTransactions = transactionRepository.findByUserOrderByTimestampDesc(transaction.getUser());
        long recentCount = lastTransactions.stream()
                .filter(t -> t.getTimestamp().isAfter(LocalDateTime.now().minusMinutes(5)))
                .count();
        if (recentCount > 3) {
            isFraudulent = true;
            reasons.append("VELOCITY_LIMIT; ");
        }

        // Rule 3: Location Change
        if (!lastTransactions.isEmpty()) {
            Transaction lastTx = lastTransactions.get(0);
            if (!lastTx.getLocation().equalsIgnoreCase(transaction.getLocation())) {
                isFraudulent = true;
                reasons.append("LOCATION_MISMATCH; ");
            }
        }

        if (isFraudulent) {
            transaction.setStatus(TransactionStatus.FLAGGED);
            FraudAlert alert = FraudAlert.builder()
                    .transaction(transaction)
                    .reason(reasons.toString())
                    .createdAt(LocalDateTime.now())
                    .isResolved(false)
                    .build();
            java.util.Objects.requireNonNull(alert);
            fraudAlertRepository.save(alert);
            
            // Send Email Notification
            emailService.sendFraudAlert(
                    transaction.getUser().getEmail(),
                    "Amount: $" + transaction.getAmount() + " at " + transaction.getMerchant(),
                    reasons.toString()
            );
        } else {
            transaction.setStatus(TransactionStatus.APPROVED);
        }
    }
}
