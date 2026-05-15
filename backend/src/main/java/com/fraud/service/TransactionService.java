package com.fraud.service;

import com.fraud.model.Transaction;
import com.fraud.model.User;
import com.fraud.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository repository;
    private final FraudDetectionService fraudDetectionService;

    public Transaction processTransaction(Transaction transaction, User user) {
        transaction.setUser(user);
        transaction.setTimestamp(LocalDateTime.now());
        
        // Initial check and fraud detection
        fraudDetectionService.detectFraud(transaction);
        
        return repository.save(transaction);
    }

    public List<Transaction> getUserTransactions(User user) {
        return repository.findByUserOrderByTimestampDesc(user);
    }

    public List<Transaction> getAllTransactions() {
        return repository.findAllByOrderByTimestampDesc();
    }
}
