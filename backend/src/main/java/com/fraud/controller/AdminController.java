package com.fraud.controller;

import com.fraud.model.FraudAlert;
import com.fraud.model.Transaction;
import com.fraud.repository.FraudAlertRepository;
import com.fraud.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('ADMIN')")
public class AdminController {

    private final TransactionService transactionService;
    private final FraudAlertRepository fraudAlertRepository;

    @GetMapping("/transactions")
    public ResponseEntity<List<Transaction>> getAllTransactions() {
        return ResponseEntity.ok(transactionService.getAllTransactions());
    }

    @GetMapping("/alerts")
    public ResponseEntity<List<FraudAlert>> getPendingAlerts() {
        return ResponseEntity.ok(fraudAlertRepository.findByIsResolvedFalseOrderByCreatedAtDesc());
    }
}
