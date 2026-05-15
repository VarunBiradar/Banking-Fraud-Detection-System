package com.fraud.controller;

import com.fraud.model.Transaction;
import com.fraud.model.User;
import com.fraud.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService service;
    private final com.fraud.repository.FraudAlertRepository alertRepository;

    @PostMapping
    public ResponseEntity<Transaction> createTransaction(
            @RequestBody Transaction transaction,
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(service.processTransaction(transaction, user));
    }

    @GetMapping("/my")
    public ResponseEntity<List<Transaction>> getMyTransactions(
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(service.getUserTransactions(user));
    }

    @GetMapping("/alerts")
    public ResponseEntity<List<com.fraud.model.FraudAlert>> getMyAlerts(
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(alertRepository.findByTransactionUserOrderByCreatedAtDesc(user));
    }
}
