package com.fraud.service;

import com.fraud.model.Transaction;
import com.fraud.model.User;
import com.fraud.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class TransactionService {

    private final TransactionRepository repository;
    private final FraudDetectionService fraudDetectionService;

    public Transaction processTransaction(Transaction transaction, User user) {
        transaction.setUser(user);
        transaction.setTimestamp(LocalDateTime.now());
        transaction.setStatus(com.fraud.model.TransactionStatus.PENDING);

        // Save transaction first to generate ID before creating fraud alerts
        Transaction savedTx = repository.save(transaction);

        // Initial check and fraud detection
        fraudDetectionService.detectFraud(savedTx);

        return repository.save(savedTx);
    }

    public List<Transaction> getUserTransactions(User user) {
        return repository.findByUserOrderByTimestampDesc(user);
    }

    public List<Transaction> getAllTransactions() {
        return repository.findAllByOrderByTimestampDesc();
    }
}
